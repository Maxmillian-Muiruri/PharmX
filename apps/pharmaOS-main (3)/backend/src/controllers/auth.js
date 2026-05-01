import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import crypto from 'crypto'
import prisma from '../lib/prisma.js'
import { AppError } from '../middleware/errorHandler.js'

// In-memory token blacklist (production should use Redis)
const tokenBlacklist = new Set()

/**
 * Sign an access token for a user
 */
function signAccessToken(userId) {
  return jwt.sign(
    { sub: userId, type: 'access' },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '1d' }
  )
}

/**
 * Sign a refresh token for a user
 */
function signRefreshToken(userId) {
  const refreshToken = jwt.sign(
    { sub: userId, type: 'refresh', jti: crypto.randomUUID() },
    process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d' }
  )
  return refreshToken
}

/**
 * Verify a refresh token and return new access + refresh tokens
 */
export async function refreshToken(req, res, next) {
  try {
    const { refreshToken } = req.body

    if (!refreshToken) {
      throw new AppError('Refresh token is required', 400, 'VALIDATION_ERROR')
    }

    // Check if token is blacklisted
    if (tokenBlacklist.has(refreshToken)) {
      throw new AppError('Invalid refresh token', 401, 'TOKEN_BLACKLISTED')
    }

    // Verify refresh token
    let payload
    try {
      payload = jwt.verify(
        refreshToken,
        process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET
      )
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        throw new AppError('Refresh token expired, please log in again', 401, 'TOKEN_EXPIRED')
      }
      throw new AppError('Invalid refresh token', 401, 'INVALID_TOKEN')
    }

    // Ensure it's a refresh token
    if (payload.type !== 'refresh') {
      throw new AppError('Invalid token type', 401, 'INVALID_TOKEN_TYPE')
    }

    // Verify user still exists
    const user = await prisma.user.findUnique({
      where: { id: payload.sub },
      select: { id: true, email: true, userType: true, isActive: true },
    })

    if (!user) {
      throw new AppError('User no longer exists', 401, 'USER_NOT_FOUND')
    }

    if (!user.isActive) {
      throw new AppError('User account is disabled', 403, 'ACCOUNT_DISABLED')
    }

    // Blacklist old refresh token (rotation)
    tokenBlacklist.add(refreshToken)

    // Generate new tokens
    const newAccessToken = signAccessToken(user.id)
    const newRefreshToken = signRefreshToken(user.id)

    res.json({
      success: true,
      data: {
        token: newAccessToken,
        refreshToken: newRefreshToken,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          userType: user.userType,
          isActive: user.isActive,
        },
      },
    })
  } catch (err) {
    next(err)
  }
}

/**
 * POST /api/auth/login
 */
export async function login(req, res, next) {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      throw new AppError('Email and password are required', 400, 'VALIDATION_ERROR')
    }

    // Find user
    const user = await prisma.user.findUnique({ where: { email: email.toLowerCase().trim() } })
    if (!user) {
      throw new AppError('Invalid email or password', 401, 'INVALID_CREDENTIALS')
    }

    // Verify password
    const isValid = await bcrypt.compare(password, user.password)
    if (!isValid) {
      throw new AppError('Invalid email or password', 401, 'INVALID_CREDENTIALS')
    }

    const token = signAccessToken(user.id)
    const refreshToken = signRefreshToken(user.id)

    res.json({
      success: true,
      data: {
        token,
        refreshToken,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          userType: user.userType,
          isActive: user.isActive,
        },
      },
    })
  } catch (err) {
    next(err)
  }
}

/**
 * GET /api/auth/me
 * Returns the currently authenticated user (req.user is set by auth middleware)
 */
export async function getMe(req, res) {
  res.json({
    success: true,
    data: req.user,
  })
}

/**
 * POST /api/auth/logout
 * Blacklist the access token and confirm logout
 */
export async function logout(req, res) {
  const authHeader = req.headers.authorization
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1]
    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET)
      tokenBlacklist.add(token)
      // Also blacklist refresh token if provided
      if (req.body.refreshToken) {
        tokenBlacklist.add(req.body.refreshToken)
      }
    } catch (err) {
      // Token might be expired, still blacklist it
      tokenBlacklist.add(token)
    }
  }
  res.json({ success: true, message: 'Logged out successfully' })
}

// Cleanup blacklist periodically (every hour)
setInterval(() => {
  tokenBlacklist.clear()
}, 60 * 60 * 1000)

// Export blacklist for use in auth middleware
export { tokenBlacklist }
