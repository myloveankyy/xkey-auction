import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { KeyRound, Lock, Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';

const AdminPinPage = () => {
  const [pin, setPin] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // --- SECURITY BEST PRACTICE ---
  // The PIN is now fetched from environment variables.
  // In your frontend folder, create a .env file and add:
  // REACT_APP_ADMIN_PIN=1234
  const CORRECT_PIN = process.env.REACT_APP_ADMIN_PIN;

  useEffect(() => {
    const pinAuth = sessionStorage.getItem('adminPinAuthenticated');
    if (pinAuth === 'true') {
      navigate('/admin/login');
    }
  }, [navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate a short delay for better UX
    setTimeout(() => {
      if (pin === CORRECT_PIN) {
        sessionStorage.setItem('adminPinAuthenticated', 'true');
        navigate('/admin/login');
      } else {
        toast.error('Invalid PIN. Please try again.');
        setPin(''); // Clear input on error
      }
      setIsLoading(false);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-4">
       <div className="w-full max-w-sm">
        <div className="flex items-center justify-center gap-2 font-semibold mb-6">
            <Link to="/" className="flex items-center gap-2 font-semibold">
              <KeyRound className="h-7 w-7 text-blue-600" />
              <span className="text-2xl text-slate-900">xKeyAuction</span>
            </Link>
        </div>
        
        <div className="bg-white p-8 rounded-2xl shadow-md border border-slate-200/80">
          <div className="text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
              <Lock className="h-6 w-6 text-slate-500" />
            </div>
            <h2 className="mt-4 text-2xl font-bold text-slate-900">Admin Verification</h2>
            <p className="mt-2 text-slate-500">Enter your security PIN to proceed.</p>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="rounded-md">
              <input
                id="pin-code"
                name="pin"
                type="password"
                required
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                className="appearance-none block w-full px-3 py-3 text-center text-2xl tracking-[.5em] bg-slate-50 border border-slate-300 placeholder-slate-400 text-slate-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="••••"
                maxLength="4"
                autoComplete="off"
                autoFocus
              />
            </div>
            <div>
              <button
                type="submit"
                disabled={isLoading || pin.length < 4}
                className="w-full flex justify-center py-3 px-4 text-sm font-bold rounded-lg text-white bg-slate-800 hover:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-800 disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? (
                  <Loader2 className="animate-spin h-5 w-5" />
                ) : (
                  'Unlock'
                )}
              </button>
            </div>
          </form>
        </div>
       </div>
    </div>
  );
};

export default AdminPinPage;