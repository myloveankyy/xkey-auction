import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-hot-toast';
import { getAllUsers, deleteUser, reset } from '../../features/auth/authSlice';
import { Loader2, Trash2, ShieldCheck, User } from 'lucide-react';
import { motion } from 'framer-motion';

const UserManagement = () => {
  const dispatch = useDispatch();

  // Get the list of users AND the currently logged-in user from the auth state
  const { users, user: loggedInUser, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    // Handle toast notifications and reset state
    if (isError) {
      toast.error(message);
    }
    if (isSuccess && message) {
      toast.success(message);
    }
    if (isError || isSuccess) {
      dispatch(reset());
    }
  }, [isError, isSuccess, message, dispatch]);

  useEffect(() => {
    // Fetch all users when the component mounts
    dispatch(getAllUsers());
  }, [dispatch]);

  const handleDeleteUser = (userId) => {
    if (window.confirm('Are you sure you want to delete this user? This will also remove all their vehicle listings.')) {
      dispatch(deleteUser(userId));
    }
  };

  const tableRowVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, x: -50, transition: { duration: 0.2 } },
  };

  return (
    <div className="p-8">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">User Management</h1>
        <p className="mt-1 text-sm text-slate-500">View, manage, and delete user accounts.</p>
      </header>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {isLoading && users.length === 0 ? (
          <div className="flex justify-center items-center h-full p-16">
            <Loader2 className="h-8 w-8 animate-spin text-slate-500" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50/70">
                <tr className="border-b border-slate-200">
                  <th className="p-3 font-bold text-slate-600 uppercase text-left">Name</th>
                  <th className="p-3 font-bold text-slate-600 uppercase text-left">Email</th>
                  <th className="p-3 font-bold text-slate-600 uppercase text-left">Role</th>
                  <th className="p-3 font-bold text-slate-600 uppercase text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <motion.tr
                    key={user._id}
                    variants={tableRowVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    layout
                    className="border-b border-slate-200 hover:bg-slate-50/70"
                  >
                    <td className="p-3 font-medium text-slate-800">{user.name}</td>
                    <td className="p-3 text-slate-600">{user.email}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 text-xs font-medium rounded-full inline-flex items-center gap-1.5 ${
                        user.role === 'admin' 
                        ? 'bg-sky-100 text-sky-800' 
                        : 'bg-slate-100 text-slate-800'
                      }`}>
                        {user.role === 'admin' ? <ShieldCheck size={12} /> : <User size={12} />}
                        {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                      </span>
                    </td>
                    <td className="p-3 text-center">
                      <button
                        onClick={() => handleDeleteUser(user._id)}
                        // CRITICAL: Disable the button if the user is the currently logged-in admin
                        disabled={user._id === loggedInUser._id}
                        className="p-1.5 text-red-500 hover:text-red-700 disabled:text-slate-300 disabled:cursor-not-allowed"
                        title={user._id === loggedInUser._id ? "You cannot delete your own account" : "Delete User"}
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserManagement;