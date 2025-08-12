// frontend/src/pages/admin/AdminLogin.jsx

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { Lock, Mail, Loader2, KeyRound } from 'lucide-react';
import authService from '../../features/auth/authService';

const AdminLogin = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const { email, password } = formData;

  const handleChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const userData = { email, password };
    try {
      await authService.login(userData);
      toast.success('Login Successful!');
      navigate('/admin/dashboard');
    } catch (error) {
      const message = (error.response?.data?.message) || error.message || 'An error occurred';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col items-center justify-center p-4">
      
      {/* --- MODIFIED: Branding icon is now dark slate --- */}
      <div className="flex items-center gap-3 mb-8">
        <KeyRound className="text-slate-800" size={36} />
        <span className="text-3xl font-extrabold text-slate-800 tracking-tight">xKeyAuction Admin</span>
      </div>

      <div className="w-full max-w-sm p-8 space-y-6 bg-white rounded-xl shadow-sm border border-slate-200">
        <div className="text-center">
          <h1 className="text-2xl font-bold tracking-tight">Sign in to your account</h1>
          <p className="mt-2 text-sm text-slate-500">Enter your credentials to access the dashboard.</p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="text-sm font-semibold text-slate-700 block mb-1.5">Email</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <Mail className="h-5 w-5 text-slate-400" />
              </span>
              {/* --- MODIFIED: Focus ring color is now dark slate --- */}
              <input
                type="email"
                id="email"
                name="email"
                placeholder="you@example.com"
                className="w-full pl-10 pr-4 py-2 bg-white border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-slate-500 placeholder:text-slate-400"
                value={email}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div>
            <label htmlFor="password" className="text-sm font-semibold text-slate-700 block mb-1.5">Password</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <Lock className="h-5 w-5 text-slate-400" />
              </span>
              {/* --- MODIFIED: Focus ring color is now dark slate --- */}
              <input
                type="password"
                id="password"
                name="password"
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2 bg-white border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-slate-500 placeholder:text-slate-400"
                value={password}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div>
            {/* --- MODIFIED: Button is now dark slate --- */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center items-center py-2.5 px-4 bg-slate-800 hover:bg-slate-900 rounded-md text-white font-bold transition duration-300 disabled:bg-slate-600 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : (
                'Sign In'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;