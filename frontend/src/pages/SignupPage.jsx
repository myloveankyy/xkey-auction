import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useSelector, useDispatch } from 'react-redux';
import { register, reset } from '../features/auth/authSlice';
import { KeyRound, User, Mail, Lock, Loader2 } from 'lucide-react';

const SignupPage = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', password2: '' });
  const { name, email, password, password2 } = formData;

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user, isLoading, isError, isSuccess, message } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isError) {
      toast.error(message);
    }
    if (isSuccess || user) {
      navigate('/dashboard'); // Redirect to seller dashboard after signup
    }
    dispatch(reset());
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

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-4">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-sm">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-4">
            <KeyRound className="text-blue-600" size={32} />
            <span className="text-3xl font-extrabold text-slate-900 tracking-tight">xKeyAuction</span>
          </Link>
          <h2 className="text-2xl font-bold text-slate-800">Create a Seller Account</h2>
          <p className="text-slate-500">Join our platform to list and sell your vehicles.</p>
        </div>

        <form onSubmit={onSubmit} className="space-y-5">
          <div className="relative">
            <User className="absolute top-1/2 -translate-y-1/2 left-3 text-slate-400" size={20} />
            <input type="text" id="name" name="name" value={name} onChange={onChange} placeholder="Full Name" required className="w-full pl-10 pr-3 py-3 border border-slate-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition" />
          </div>
          <div className="relative">
            <Mail className="absolute top-1/2 -translate-y-1/2 left-3 text-slate-400" size={20} />
            <input type="email" id="email" name="email" value={email} onChange={onChange} placeholder="Email Address" required className="w-full pl-10 pr-3 py-3 border border-slate-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition" />
          </div>
          <div className="relative">
            <Lock className="absolute top-1/2 -translate-y-1/2 left-3 text-slate-400" size={20} />
            <input type="password" id="password" name="password" value={password} onChange={onChange} placeholder="Password" required className="w-full pl-10 pr-3 py-3 border border-slate-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition" />
          </div>
          <div className="relative">
            <Lock className="absolute top-1/2 -translate-y-1/2 left-3 text-slate-400" size={20} />
            <input type="password" id="password2" name="password2" value={password2} onChange={onChange} placeholder="Confirm Password" required className="w-full pl-10 pr-3 py-3 border border-slate-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition" />
          </div>
          <button type="submit" disabled={isLoading} className="w-full bg-slate-800 text-white font-bold py-3 px-4 rounded-lg hover:bg-slate-900 transition-colors duration-300 flex items-center justify-center disabled:bg-slate-500">
            {isLoading ? <Loader2 className="animate-spin" /> : 'Create Account'}
          </button>
        </form>

        <p className="text-center text-sm text-slate-500 mt-8">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-blue-600 hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;