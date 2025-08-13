// frontend/src/pages/admin/AdminSignupPage.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { UserPlus } from 'lucide-react';

// --- CHANGE 1: Import the default export from authService ---
import authService from '../../features/auth/authService';

const AdminSignupPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const { name, email, password, confirmPassword } = formData;

  // --- SECURITY CHECK ---
  useEffect(() => {
    const isVerified = sessionStorage.getItem('isAdminPinVerified');
    if (isVerified !== 'true') {
      navigate('/admin/pin', { replace: true });
    }
  }, [navigate]);

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (password !== confirmPassword) {
      return setError('Passwords do not match.');
    }
    if (password.length < 6) {
      return setError('Password must be at least 6 characters.');
    }

    try {
      setIsLoading(true);
      const userData = { name, email, password };
      
      // --- CHANGE 2: Call the register function from the authService object ---
      const response = await authService.register(userData);

      setSuccess(`Admin user ${response.name} created successfully! Redirecting to login...`);
      
      sessionStorage.removeItem('isAdminPinVerified');

      setTimeout(() => {
        navigate('/admin/login');
      }, 3000);

    } catch (err) {
      const message =
        (err.response && err.response.data && err.response.data.message) ||
        err.message ||
        err.toString();
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-100">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-lg p-8 space-y-6 bg-white rounded-2xl shadow-xl"
      >
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 mx-auto bg-blue-100 rounded-full mb-4">
            <UserPlus className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900">Create Admin Account</h1>
          <p className="mt-2 text-slate-600">Enter your details to register a new administrator.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <div className="p-3 text-sm text-center text-red-800 bg-red-100 rounded-lg">{error}</div>}
          {success && <div className="p-3 text-sm text-center text-green-800 bg-green-100 rounded-lg">{success}</div>}
          
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-slate-700">Full Name</label>
            <input
              id="name" name="name" type="text" required value={name} onChange={onChange}
              className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-700">Email Address</label>
            <input
              id="email" name="email" type="email" required value={email} onChange={onChange}
              className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label htmlFor="password"className="block text-sm font-medium text-slate-700">Password</label>
            <input
              id="password" name="password" type="password" required value={password} onChange={onChange}
              className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label htmlFor="confirmPassword"className="block text-sm font-medium text-slate-700">Confirm Password</label>
            <input
              id="confirmPassword" name="confirmPassword" type="password" required value={confirmPassword} onChange={onChange}
              className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div>
            <button
              type="submit"
              disabled={isLoading || success}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-slate-400 disabled:cursor-not-allowed transition-all"
            >
              {isLoading ? 'Creating Account...' : 'Create Admin Account'}
            </button>
          </div>
        </form>
        <p className="text-center text-sm text-slate-600">
            Already have an account?{' '}
            <Link to="/admin/login" className="font-medium text-blue-600 hover:text-blue-500">
                Log in here
            </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default AdminSignupPage;