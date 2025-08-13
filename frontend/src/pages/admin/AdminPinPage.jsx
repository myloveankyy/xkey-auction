// frontend/src/pages/admin/AdminPinPage.jsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LockKeyhole } from 'lucide-react';

const AdminPinPage = () => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // --- SECURITY ---
  // This is your hardcoded 6-digit PIN.
  // For better security in a real production environment,
  // this would be stored as an environment variable.
  const CORRECT_PIN = '987654';

  const handleSubmit = (e) => {
    e.preventDefault();
    if (pin === CORRECT_PIN) {
      // If the PIN is correct, set a flag in sessionStorage.
      // sessionStorage is temporary and clears when the browser tab is closed.
      sessionStorage.setItem('isAdminPinVerified', 'true');
      
      // Redirect to the actual signup page.
      navigate('/admin/signup');
    } else {
      setError('Invalid PIN. Please try again.');
      setPin('');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-100">
      <motion.div
        initial={{ opacity: 0, y: -20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="w-full max-w-md p-8 space-y-6 bg-white rounded-2xl shadow-xl"
      >
        <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 mx-auto bg-blue-100 rounded-full mb-4">
                <LockKeyhole className="w-8 h-8 text-blue-600" />
            </div>
          <h1 className="text-3xl font-bold text-slate-900">Admin Access</h1>
          <p className="mt-2 text-slate-600">Enter the security PIN to proceed to registration.</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="pin" className="sr-only">
              PIN
            </label>
            <input
              id="pin"
              name="pin"
              type="password"
              autoComplete="off"
              required
              maxLength="6"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              className="w-full px-4 py-3 text-center text-2xl tracking-[.5em] font-mono bg-slate-100 border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              placeholder="••••••"
            />
          </div>

          {error && (
            <p className="text-sm text-center text-red-600">{error}</p>
          )}

          <div>
            <button
              type="submit"
              className="w-full px-4 py-3 font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-transform transform hover:scale-105"
            >
              Verify
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default AdminPinPage;