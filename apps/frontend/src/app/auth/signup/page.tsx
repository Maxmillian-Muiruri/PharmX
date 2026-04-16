import { useState, type FormEvent } from 'react';
import { Mail, Lock, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface RegisterData {
  username: string;
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export function Signup() {
  return <SignUpPage />;
}

export default function SignUpPage() {
  const [registerData, setRegisterData] = useState<RegisterData>({
    username: '',
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const navigate = useNavigate();

  const handleRegister = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!registerData.username || !registerData.fullName || !registerData.email || !registerData.password || !registerData.confirmPassword) {
      toast.error('Please fill in all fields');
      return;
    }

    if (registerData.password.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }

    if (registerData.password !== registerData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    toast.loading('Creating your account...');
    setTimeout(() => {
      toast.dismiss();
      toast.success('Account created successfully! Please sign in.');
      
      setTimeout(() => {
        navigate('/auth/signin', { 
          state: { email: registerData.email } 
        });
      }, 1500);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-muted/30 flex items-center justify-center py-8 px-4">
      <div className="wrap">
        {/* Left Side */}
        <div className="left">
          <div className="logo-box">
            <img 
              src="/logo.jpg" 
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

        {/* Right Side */}
        <div className="right">
          <div className="scene">
            <div className="card">
              <div className="face front-face">
                <div className="ftitle">Create account</div>
                <div className="fsub">Fill in your details to get started</div>
                
                <form onSubmit={handleRegister}>
                  <div className="field">
                    <label>Username</label>
                    <div className="finput">
                      <User className="w-[15px] h-[15px] text-[#9ca3af] mr-2" />
                      <input
                        type="text"
                        placeholder="john_doe"
                        value={registerData.username}
                        onChange={(e) => setRegisterData(prev => ({ ...prev, username: e.target.value }))}
                      />
                    </div>
                  </div>

                  <div className="field">
                    <label>Full name</label>
                    <div className="finput">
                      <User className="w-[15px] h-[15px] text-[#9ca3af] mr-2" />
                      <input
                        type="text"
                        placeholder="John Doe"
                        value={registerData.fullName}
                        onChange={(e) => setRegisterData(prev => ({ ...prev, fullName: e.target.value }))}
                      />
                    </div>
                  </div>

                  <div className="field">
                    <label>Email address</label>
                    <div className="finput">
                      <Mail className="w-[15px] h-[15px] text-[#9ca3af] mr-2" />
                      <input
                        type="email"
                        placeholder="you@example.com"
                        value={registerData.email}
                        onChange={(e) => setRegisterData(prev => ({ ...prev, email: e.target.value }))}
                      />
                    </div>
                  </div>

                  <div className="field">
                    <label>Password</label>
                    <div className="finput">
                      <Lock className="w-[15px] h-[15px] text-[#9ca3af] mr-2" />
                      <input
                        type="password"
                        placeholder="Min. 8 characters"
                        value={registerData.password}
                        onChange={(e) => setRegisterData(prev => ({ ...prev, password: e.target.value }))}
                      />
                    </div>
                  </div>

                  <div className="field">
                    <label>Confirm password</label>
                    <div className="finput">
                      <Lock className="w-[15px] h-[15px] text-[#9ca3af] mr-2" />
                      <input
                        type="password"
                        placeholder="Repeat password"
                        value={registerData.confirmPassword}
                        onChange={(e) => setRegisterData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                      />
                    </div>
                  </div>

                  <button type="submit" className="btn">Create account</button>
                  
                  <div className="switch">
                    Already have an account?{' '}
                    <button 
                      type="button" 
                      className="slink" 
                      onClick={() => navigate('/auth/signin')}
                    >
                      Sign in
                    </button>
                  </div>
                  
                  <div className="fnote">© 2025 Pharmacie Nouni. All rights reserved.</div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        * {
          box-sizing: border-box;
        }

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
          perspective: 1000px;
        }

        .card {
          width: 100%;
          transform-style: preserve-3d;
          position: relative;
        }

        .face {
          background: white;
          border-radius: 14px;
          padding: 28px 24px;
          box-shadow: 0 2px 20px rgba(0, 0, 0, 0.09);
        }

        .front-face {
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
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
          border: none;
          background: none;
          font-size: 12px;
          text-decoration: underline;
          padding: 0;
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

          .stats {
            gap: 16px;
          }
        }
      `}</style>
    </div>
  );
}
