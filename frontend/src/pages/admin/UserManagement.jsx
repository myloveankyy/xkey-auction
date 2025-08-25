import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-hot-toast';
import { getAllUsers, deleteUser, sendDirectNotification, reset } from '../../features/auth/authSlice';
import { Loader2, Trash2, ShieldCheck, User, MessageSquare, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- Reusable Modal Component ---
const NotificationModal = ({ user, onClose, onSend, isLoading }) => {
    const [message, setMessage] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (message.trim()) {
            onSend(message);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="bg-white rounded-xl shadow-2xl w-full max-w-lg border border-slate-200"
                onClick={(e) => e.stopPropagation()}
            >
                <form onSubmit={handleSubmit}>
                    <div className="p-6 border-b border-slate-200 flex justify-between items-center">
                        <div>
                           <h2 className="text-lg font-bold text-slate-800">Send Notification</h2>
                           <p className="text-sm text-slate-500">To: {user.name} ({user.email})</p>
                        </div>
                        <button type="button" onClick={onClose} className="p-1 rounded-full hover:bg-slate-100">
                            <X size={20} className="text-slate-500" />
                        </button>
                    </div>
                    <div className="p-6">
                        <label htmlFor="message" className="block text-sm font-medium text-slate-700 mb-2">Message</label>
                        <textarea
                            id="message"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            rows={5}
                            className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                            placeholder="Type your message here..."
                            required
                        />
                    </div>
                    <div className="p-4 bg-slate-50/70 border-t border-slate-200 flex justify-end gap-3 rounded-b-xl">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition">
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading || !message.trim()}
                            className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed transition flex items-center gap-2"
                        >
                            {isLoading && <Loader2 size={16} className="animate-spin" />}
                            Send Notification
                        </button>
                    </div>
                </form>
            </motion.div>
        </motion.div>
    );
};

// --- Main UserManagement Component ---
const UserManagement = () => {
  const dispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const { users, user: loggedInUser, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (isError) toast.error(message);
    if (isSuccess && message) toast.success(message);
    if (isError || isSuccess) dispatch(reset());
  }, [isError, isSuccess, message, dispatch]);

  useEffect(() => {
    dispatch(getAllUsers());
  }, [dispatch]);

  const handleDeleteUser = (userId) => {
    if (window.confirm('Are you sure? This will also remove all their vehicle listings.')) {
      dispatch(deleteUser(userId));
    }
  };

  const openNotificationModal = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };
  
  const closeNotificationModal = () => {
    setSelectedUser(null);
    setIsModalOpen(false);
  };

  const handleSendNotification = (messageText) => {
    dispatch(sendDirectNotification({ recipientId: selectedUser._id, message: messageText }))
      .unwrap()
      .then(() => {
          closeNotificationModal();
      })
      .catch(() => {
          // Error toast is already handled by the main useEffect
      });
  };

  const tableRowVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, x: -50, transition: { duration: 0.2 } },
  };

  return (
    <>
      <div className="p-8">
        <header className="mb-6">
          <h1 className="text-2xl font-bold text-slate-800">User Management</h1>
          <p className="mt-1 text-sm text-slate-500">View, manage, and send notifications to users.</p>
        </header>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          {isLoading && users.length === 0 ? (
            <div className="flex justify-center items-center h-full p-16"><Loader2 className="h-8 w-8 animate-spin text-slate-500" /></div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50/70"><tr className="border-b border-slate-200">
                  <th className="p-3 font-bold text-slate-600 uppercase text-left">Name</th>
                  <th className="p-3 font-bold text-slate-600 uppercase text-left">Email</th>
                  <th className="p-3 font-bold text-slate-600 uppercase text-left">Role</th>
                  <th className="p-3 font-bold text-slate-600 uppercase text-center">Actions</th>
                </tr></thead>
                <tbody>{users.map((user) => (
                  <motion.tr key={user._id} variants={tableRowVariants} initial="hidden" animate="visible" exit="exit" layout className="border-b border-slate-200 hover:bg-slate-50/70">
                    <td className="p-3 font-medium text-slate-800">{user.name}</td>
                    <td className="p-3 text-slate-600">{user.email}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 text-xs font-medium rounded-full inline-flex items-center gap-1.5 ${user.role === 'admin' ? 'bg-sky-100 text-sky-800' : 'bg-slate-100 text-slate-800'}`}>
                        {user.role === 'admin' ? <ShieldCheck size={12} /> : <User size={12} />}
                        {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                      </span>
                    </td>
                    <td className="p-3 text-center flex justify-center items-center gap-2">
                        {/* --- NEW NOTIFICATION BUTTON --- */}
                        <button onClick={() => openNotificationModal(user)} disabled={user._id === loggedInUser._id} className="p-1.5 text-blue-500 hover:text-blue-700 disabled:text-slate-300 disabled:cursor-not-allowed" title={user._id === loggedInUser._id ? "Cannot message yourself" : "Send Notification"}>
                            <MessageSquare size={16} />
                        </button>
                        <button onClick={() => handleDeleteUser(user._id)} disabled={user._id === loggedInUser._id} className="p-1.5 text-red-500 hover:text-red-700 disabled:text-slate-300 disabled:cursor-not-allowed" title={user._id === loggedInUser._id ? "Cannot delete yourself" : "Delete User"}>
                            <Trash2 size={16} />
                        </button>
                    </td>
                  </motion.tr>
                ))}</tbody>
              </table>
            </div>
          )}
        </div>
      </div>
      
      {/* --- MODAL RENDER --- */}
      <AnimatePresence>
          {isModalOpen && selectedUser && (
              <NotificationModal
                  user={selectedUser}
                  onClose={closeNotificationModal}
                  onSend={handleSendNotification}
                  isLoading={isLoading}
              />
          )}
      </AnimatePresence>
    </>
  );
};

export default UserManagement;