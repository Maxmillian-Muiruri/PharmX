import { useState, type FormEvent, type ChangeEvent } from 'react';
import { Mail, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface LoginData {
  email: string;
  password: string;
  rememberMe: boolean;
}

interface UserData {
<<<<<<< HEAD
  userId?: string;
=======
>>>>>>> origin/main
  email: string;
  loggedIn?: boolean;
  loginTime?: string;
}

export const Signin = () => {
  const [loginData, setLoginData] = useState<LoginData>({
    email: '',
    password: '',
    rememberMe: false,
  });

  const navigate = useNavigate();

  const handleLogin = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!loginData.email || !loginData.password) {
      toast.error('Please fill in all fields');
      return;
    }

    toast.loading('Signing in...');

    setTimeout(() => {
      toast.dismiss();

      const user: UserData = {
<<<<<<< HEAD
        userId: 'user_' + Date.now().toString(36) + Math.random().toString(36).substr(2, 9),
=======
>>>>>>> origin/main
        email: loginData.email,
        loggedIn: true,
        loginTime: new Date().toISOString(),
      };

      localStorage.setItem('pharmacie_user', JSON.stringify(user));
      window.dispatchEvent(new Event('auth-change'));

      toast.success('Welcome back!');
<<<<<<< HEAD
      navigate('/');
=======
      navigate('/home');
>>>>>>> origin/main
    }, 1000);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setLoginData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  return (
<<<<<<< HEAD
    <div className="w-full">
      <h2 className="text-2xl font-bold text-teal-800 mb-1">Sign in</h2>
      <p className="text-gray-500 mb-6">Enter your credentials to access your account</p>

      <form onSubmit={handleLogin}>
        <div className="mb-5">
          <label className="block text-sm font-medium text-gray-700 mb-2">Email address</label>
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <Mail className="w-5 h-5" />
            </div>
            <input
              type="email"
              name="email"
              placeholder="you@example.com"
              value={loginData.email}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all bg-gray-50 focus:bg-white"
              required
            />
          </div>
        </div>

        <div className="mb-5">
          <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <Lock className="w-5 h-5" />
            </div>
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={loginData.password}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all bg-gray-50 focus:bg-white"
              required
            />
          </div>
        </div>

        <div className="flex justify-between items-center mb-6">
          <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
            <input
              type="checkbox"
              name="rememberMe"
              checked={loginData.rememberMe}
              onChange={handleChange}
              className="w-4 h-4 text-teal-600 rounded focus:ring-teal-500 cursor-pointer"
            />
            <span>Remember me</span>
          </label>
          <span className="text-sm text-teal-600 cursor-pointer hover:text-teal-700 hover:underline">Forgot password?</span>
        </div>

        <button 
          type="submit" 
          className="w-full py-3.5 bg-teal-600 text-white font-semibold rounded-lg cursor-pointer transition-all hover:bg-teal-700 active:scale-[0.98] shadow-lg hover:shadow-xl mb-6"
        >
          Sign in
        </button>

        <div className="text-center text-gray-600">
          Don't have an account?{' '}
          <button 
            type="button" 
            className="text-teal-600 font-semibold cursor-pointer bg-none border-none p-0 hover:text-teal-700 hover:underline"
            onClick={() => navigate('/auth/signup')}
          >
            Create account
          </button>
        </div>

        <div className="text-center text-xs text-gray-400 mt-6">© 2026 Pharmacie Nouni. All rights reserved.</div>
      </form>
    </div>
  );
};

export default Signin;
=======
    <div className="min-h-screen bg-muted/30 flex items-center justify-center py-8 px-4">
      <div className="wrap">
        <div className="left">
          <div className="logo-box">
            <img
              src="/logo.jpeg"
              alt="Pharmacie Nouni"
              className="w-full h-full object-contain p-2"
            />
          </div>
          <div className="ltitle">Welcome to Pharmacie Nouni</div>
          <div className="lsub">Your trusted online pharmacy solution</div>

          <div className="stats">
            <div className="stat">
              <div className="sn">1000+</div>
              <div className="sl">Products</div>
            </div>
            <div className="stat">
              <div className="sn">99%</div>
              <div className="sl">Satisfaction</div>
            </div>
            <div className="stat">
              <div className="sn">24/7</div>
              <div className="sl">Support</div>
            </div>
          </div>
        </div>

        <div className="right">
          <div className="scene">
            <div className="face front-face">
              <div className="ftitle">Sign in</div>
              <div className="fsub">Enter your credentials to access your account</div>

              <form onSubmit={handleLogin}>
                <div className="field">
                  <label>Email address</label>
                  <div className="finput">
                    <Mail className="w-[15px] h-[15px] text-[#9ca3af] mr-2" />
                    <input
                      type="email"
                      name="email"
                      placeholder="you@example.com"
                      value={loginData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="field">
                  <label>Password</label>
                  <div className="finput">
                    <Lock className="w-[15px] h-[15px] text-[#9ca3af] mr-2" />
                    <input
                      type="password"
                      name="password"
                      placeholder="••••••••"
                      value={loginData.password}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="row">
                  <div className="rem">
                    <input
                      type="checkbox"
                      name="rememberMe"
                      checked={loginData.rememberMe}
                      onChange={handleChange}
                    />
                    <span>Remember me</span>
                  </div>
                  <span className="forgot">Forgot password?</span>
                </div>

                <button type="submit" className="btn">Sign in</button>

                <div className="switch">
                  Don't have an account?{' '}
                  <a href="/auth/signup" className="slink">
                    Create account
                  </a>
                </div>

                <div className="fnote">© 2026 Pharmacie Nouni. All rights reserved.</div>
              </form>
            </div>
          </div>
        </div>
      </div>

      <style>{`
  .wrap {
          display: flex;
          min-height: 580px;
          border-radius: 16px;
          overflow: hidden;
          background: #f0f4f8;
          max-width: 1000px;
          width: 100%;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
        }
        .left {
          width: 42%;
          background: #1f7a8c;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 40px 28px;
          color: white;
        }
        .logo-box {
          width: 88px;
          height: 88px;
          background: white;
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 20px;
          overflow: hidden;
        }
        .ltitle {
          font-size: 19px;
          font-weight: 700;
          text-align: center;
          margin-bottom: 6px;
        }
        .lsub {
          font-size: 12px;
          color: rgba(255, 255, 255, 0.75);
          text-align: center;
          margin-bottom: 28px;
        }
        .stats {
          display: flex;
          gap: 24px;
        }
        .stat {
          text-align: center;
        }
        .sn {
          font-size: 20px;
          font-weight: 700;
        }
        .sl {
          font-size: 11px;
          color: rgba(255, 255, 255, 0.7);
          margin-top: 2px;
        }
        .right {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 28px;
        }
        .scene {
          width: 100%;
          max-width: 350px;
        }
        .face {
          background: white;
          border-radius: 14px;
          padding: 28px 24px;
          box-shadow: 0 2px 20px rgba(0, 0, 0, 0.09);
        }
        .ftitle {
          font-size: 20px;
          font-weight: 700;
          color: #1f7a8c;
          margin-bottom: 3px;
        }
        .fsub {
          font-size: 12px;
          color: #6b7280;
          margin-bottom: 20px;
        }
        .field {
          margin-bottom: 14px;
        }
        .field label {
          display: block;
          font-size: 12px;
          font-weight: 600;
          color: #374151;
          margin-bottom: 5px;
        }
        .finput {
          display: flex;
          align-items: center;
          border: 1.5px solid #e5e7eb;
          border-radius: 8px;
          padding: 0 10px;
          background: #f9fafb;
          transition: border-color 0.2s;
        }
        .finput:focus-within {
          border-color: #1f7a8c;
          background: white;
        }
        .finput input {
          flex: 1;
          border: none;
          background: transparent;
          padding: 9px 0;
          font-size: 13px;
          color: #111;
          outline: none;
        }
        .finput input::placeholder {
          color: #9ca3af;
        }
        .row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 14px;
        }
        .forgot {
          font-size: 12px;
          color: #1f7a8c;
          cursor: pointer;
        }
        .forgot:hover {
          text-decoration: underline;
        }
        .rem {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          color: #374151;
        }
        .rem input {
          accent-color: #1f7a8c;
          cursor: pointer;
        }
        .btn {
          width: 100%;
          padding: 11px;
          background: #1f7a8c;
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          transition: background 0.2s, transform 0.1s;
          margin-bottom: 14px;
        }
        .btn:hover {
          background: #0d5c6e;
        }
        .btn:active {
          transform: scale(0.98);
        }
        .switch {
          text-align: center;
          font-size: 12px;
          color: #6b7280;
        }
        .slink {
          color: #1f7a8c;
          font-weight: 700;
          cursor: pointer;
          text-decoration: underline;
        }
        .slink:hover {
          color: #0d5c6e;
        }
        .fnote {
          text-align: center;
          font-size: 10px;
          color: #9ca3af;
          margin-top: 14px;
        }

        @media (max-width: 768px) {
          .wrap {
            flex-direction: column;
            min-height: auto;
          }
          .left {
            width: 100%;
            padding: 30px 20px;
          }
          .right {
            padding: 30px 20px;
          }
        }
      `}</style>
    </div>
  );
};
>>>>>>> origin/main
