import React, { useState, useEffect } from 'react'; // CORRECTED IMPORT
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-hot-toast';
import { register, reset } from '../features/auth/authSlice';
import { Loader2, KeyRound } from 'lucide-react';

const SellerSignupPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password2: '',
  });

  const { name, email, password, password2 } = formData;

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (isError) {
      toast.error(message);
    }

    if (isSuccess || user) {
      navigate('/dashboard');
    }
    
    return () => {
        dispatch(reset());
    }
  }, [user, isError, isSuccess, message, navigate, dispatch]);

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = (e) => {
    e.preventDefault();

    if (password !== password2) {
      toast.error('Passwords do not match');
    } else {
      const userData = { name, email, password };
      dispatch(register(userData));
    }
  };

  const inputStyle = "w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg placeholder-slate-400 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow";
  const labelStyle = "block text-sm font-semibold text-slate-700 mb-1.5";

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-md">
        <Link to="/" className="flex items-center justify-center gap-2 font-semibold mb-6">
            <KeyRound className="h-7 w-7 text-blue-600" />
            <span className="text-2xl text-slate-900">xKeyAuction</span>
        </Link>

        <div className="bg-white p-8 rounded-2xl shadow-md border border-slate-200/80">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-slate-900">
              Create a Seller Account
            </h2>
            <p className="mt-2 text-slate-600">
              Already have an account?{' '}
              <Link to="/login" className="font-semibold text-blue-600 hover:text-blue-500">
                Sign in
              </Link>
            </p>
          </div>
          <form className="mt-8 space-y-6" onSubmit={onSubmit}>
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className={labelStyle}>Full name</label>
                <input id="name" name="name" type="text" value={name} onChange={onChange} required className={inputStyle} placeholder="John Doe" />
              </div>
              <div>
                <label htmlFor="email" className={labelStyle}>Email address</label>
                <input id="email" name="email" type="email" value={email} onChange={onChange} required className={inputStyle} placeholder="you@example.com" />
              </div>
              <div>
                <label htmlFor="password" className={labelStyle}>Password</label>
                <input id="password" name="password" type="password" value={password} onChange={onChange} required className={inputStyle} placeholder="••••••••" />
              </div>
              <div>
                <label htmlFor="password2" className={labelStyle}>Confirm Password</label>
                <input id="password2" name="password2" type="password" value={password2} onChange={onChange} required className={inputStyle} placeholder="••••••••" />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-3 px-4 text-sm font-bold rounded-lg text-white bg-slate-800 hover:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-800 disabled:bg-slate-500 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? (
                  <Loader2 className="animate-spin h-5 w-5" />
                ) : (
                  'Create Account'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SellerSignupPage;