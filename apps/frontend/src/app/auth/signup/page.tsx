import { useState } from 'react';
import { Mail, Lock, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface RegisterFormData {
  username: string;
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export const Signup = () => {
  const navigate = useNavigate();

  const [registerData, setRegisterData] = useState<RegisterFormData>({
    username: '',
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (
      !registerData.username ||
      !registerData.fullName ||
      !registerData.email ||
      !registerData.password ||
      !registerData.confirmPassword
    ) {
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

    setIsLoading(true);
    toast.loading('Creating your account...');

    setTimeout(() => {
      toast.dismiss();

      const userData = {
        username: registerData.username,
        fullName: registerData.fullName,
        email: registerData.email,
        phone: '',
        gender: 'Prefer not to say',
        dateOfBirth: '',
        address: '',
        profilePicture: '',
      };

      localStorage.setItem('pharmacie_user', JSON.stringify(userData));
      window.dispatchEvent(new Event('auth-change'));

      toast.success('Account created and logged in successfully!');
      navigate('/my-account');
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#f0f4f8] flex items-center justify-center py-8 px-4">
      <div className="flex flex-col lg:flex-row min-h-[580px] w-full max-w-[1000px] bg-white lg:bg-[#f0f4f8] rounded-3xl overflow-hidden shadow-xl">
        <div className="lg:w-[42%] bg-[#1f7a8c] flex flex-col items-center justify-center p-8 lg:p-10 text-white">
          <div className="w-24 h-24 bg-white rounded-3xl flex items-center justify-center mb-6 overflow-hidden shadow-inner">
            <img
              src="/logo.jpeg"
              alt="Pharmacie Nouni"
              className="w-full h-full object-contain p-2"
            />
          </div>

          <h1 className="text-2xl font-bold text-center mb-2">Welcome to Pharmacie Nouni</h1>
          <p className="text-sm text-white/75 text-center mb-8 max-w-[240px]">
            Your trusted online pharmacy solution
          </p>

          <div className="flex gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold">1000+</div>
              <div className="text-xs text-white/70 mt-1">Products</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">99%</div>
              <div className="text-xs text-white/70 mt-1">Satisfaction</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">24/7</div>
              <div className="text-xs text-white/70 mt-1">Support</div>
            </div>
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center p-6 lg:p-8 bg-white">
          <div className="w-full max-w-[350px]">
            <div className="mb-6">
              <h2 className="text-3xl font-semibold text-[#1f7a8c]">Create account</h2>
              <p className="text-sm text-gray-500 mt-1">Fill in your details to get started</p>
            </div>

            <form onSubmit={handleRegister} className="space-y-5">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">Username</label>
                <div className="flex items-center border border-gray-200 bg-gray-50 rounded-2xl px-4 py-1 focus-within:border-[#1f7a8c] focus-within:bg-white transition-all">
                  <User className="w-4 h-4 text-gray-400 mr-3" />
                  <input
                    type="text"
                    placeholder="john_doe"
                    value={registerData.username}
                    onChange={(e) => setRegisterData((prev) => ({ ...prev, username: e.target.value }))}
                    className="flex-1 bg-transparent py-3 text-sm outline-none placeholder:text-gray-400"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">Full name</label>
                <div className="flex items-center border border-gray-200 bg-gray-50 rounded-2xl px-4 py-1 focus-within:border-[#1f7a8c] focus-within:bg-white transition-all">
                  <User className="w-4 h-4 text-gray-400 mr-3" />
                  <input
                    type="text"
                    placeholder="John Doe"
                    value={registerData.fullName}
                    onChange={(e) => setRegisterData((prev) => ({ ...prev, fullName: e.target.value }))}
                    className="flex-1 bg-transparent py-3 text-sm outline-none placeholder:text-gray-400"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">Email address</label>
                <div className="flex items-center border border-gray-200 bg-gray-50 rounded-2xl px-4 py-1 focus-within:border-[#1f7a8c] focus-within:bg-white transition-all">
                  <Mail className="w-4 h-4 text-gray-400 mr-3" />
                  <input
                    type="email"
                    placeholder="you@example.com"
                    value={registerData.email}
                    onChange={(e) => setRegisterData((prev) => ({ ...prev, email: e.target.value }))}
                    className="flex-1 bg-transparent py-3 text-sm outline-none placeholder:text-gray-400"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">Password</label>
                <div className="flex items-center border border-gray-200 bg-gray-50 rounded-2xl px-4 py-1 focus-within:border-[#1f7a8c] focus-within:bg-white transition-all">
                  <Lock className="w-4 h-4 text-gray-400 mr-3" />
                  <input
                    type="password"
                    placeholder="Min. 8 characters"
                    value={registerData.password}
                    onChange={(e) => setRegisterData((prev) => ({ ...prev, password: e.target.value }))}
                    className="flex-1 bg-transparent py-3 text-sm outline-none placeholder:text-gray-400"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">Confirm password</label>
                <div className="flex items-center border border-gray-200 bg-gray-50 rounded-2xl px-4 py-1 focus-within:border-[#1f7a8c] focus-within:bg-white transition-all">
                  <Lock className="w-4 h-4 text-gray-400 mr-3" />
                  <input
                    type="password"
                    placeholder="Repeat password"
                    value={registerData.confirmPassword}
                    onChange={(e) => setRegisterData((prev) => ({ ...prev, confirmPassword: e.target.value }))}
                    className="flex-1 bg-transparent py-3 text-sm outline-none placeholder:text-gray-400"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#1f7a8c] hover:bg-[#0d5c6e] active:scale-[0.98] transition-all text-white font-semibold py-4 rounded-2xl text-base disabled:opacity-70"
              >
                {isLoading ? 'Creating account...' : 'Create account'}
              </button>

              <div className="text-center text-sm text-gray-500">
                Already have an account?{' '}
                <a href="/auth" className="text-[#1f7a8c] font-semibold hover:underline">
                  Sign in
                </a>
              </div>

              <p className="text-center text-[10px] text-gray-400 mt-8">
                © 2025 Pharmacie Nouni. All rights reserved.
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};