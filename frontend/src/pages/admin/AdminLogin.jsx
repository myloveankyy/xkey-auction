// frontend/src/pages/admin/AdminLogin.jsx

import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom'; // Import Link
import { toast } from 'react-hot-toast';
import { Lock, Mail, Loader2, KeyRound } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
// --- IMPORT LOGOUT ACTION ---
import { login, logout, reset } from '../../features/auth/authSlice';

const AdminLogin = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  );

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const { email, password } = formData;

  // --- REFACTORED useEffect WITH SECURITY CHECK ---
  useEffect(() => {
    if (isError) {
      toast.error(message);
      dispatch(reset()); // Reset after showing error
    }

    // This block runs ONLY on successful login
    if (isSuccess && user) {
      // Check the user's role AFTER successful login
      if (user.role === 'admin') {
        toast.success('Login Successful!');
        navigate('/admin/dashboard');
      } else {
        // If the user is NOT an admin (e.g., a seller)
        toast.error("Access Denied: You do not have permission to access the admin panel.");
        dispatch(logout()); // Immediately log them out to clear their invalid session
      }
    }
  }, [user, isError, isSuccess, message, navigate, dispatch]);

  const handleChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const userData = { email, password };
    dispatch(login(userData));
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col items-center justify-center p-4">
      <Link to="/" className="flex items-center gap-3 mb-8">
        <KeyRound className="text-slate-800" size={36} />
        <span className="text-3xl font-extrabold text-slate-800 tracking-tight">xKeyAuction Admin</span>
      </Link>
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
              <input
                type="email" id="email" name="email" placeholder="you@example.com"
                className="w-full pl-10 pr-4 py-2 bg-white border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-slate-500 placeholder:text-slate-400"
                value={email} onChange={handleChange} required
              />
            </div>
          </div>
          <div>
            <label htmlFor="password" className="text-sm font-semibold text-slate-700 block mb-1.5">Password</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <Lock className="h-5 w-5 text-slate-400" />
              </span>
              <input
                type="password" id="password" name="password" placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2 bg-white border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-slate-500 placeholder:text-slate-400"
                value={password} onChange={handleChange} required
              />
            </div>
          </div>
          <div>
            <button
              type="submit" disabled={isLoading}
              className="w-full flex justify-center items-center py-2.5 px-4 bg-slate-800 hover:bg-slate-900 rounded-md text-white font-bold transition duration-300 disabled:bg-slate-600 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? ( <Loader2 className="h-6 w-6 animate-spin" /> ) : ( 'Sign In' )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;