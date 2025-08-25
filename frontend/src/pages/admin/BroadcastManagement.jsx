import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-hot-toast';
import {
  getAllBroadcasts,
  createBroadcast,
  deleteBroadcast,
  activateBroadcast,
  deactivateAllBroadcasts,
  sendBroadcastToAllUsers, // --- NEW IMPORT ---
  reset,
} from '../../features/broadcasts/broadcastSlice';
import { Loader2, Trash2, Megaphone, Plus, Power, PowerOff, Link as LinkIcon, Bell } from 'lucide-react'; // --- NEW: Bell icon ---
import { motion, AnimatePresence } from 'framer-motion';
import TimeAgo from 'react-timeago';

const BroadcastManagement = () => {
  const dispatch = useDispatch();
  const [message, setMessage] = useState('');
  const [link, setLink] = useState('');

  const { broadcasts, isLoading, isError, isSuccess, message: broadcastMessage } = useSelector(
    (state) => state.broadcasts
  );

  useEffect(() => {
    if (isError) toast.error(broadcastMessage);
    if (isSuccess && broadcastMessage) toast.success(broadcastMessage);
    // Note: We don't reset `isSuccess` immediately after a successful sendBroadcastToAllUsers
    // to allow the toast to show. The next fetch or action will reset it.
    if (isError) {
        dispatch(reset());
    }
  }, [isError, isSuccess, broadcastMessage, dispatch]);

  useEffect(() => {
    dispatch(getAllBroadcasts());
  }, [dispatch]);

  const handleCreateBroadcast = (e) => {
    e.preventDefault();
    if (message.trim()) {
      dispatch(createBroadcast({ message, link }))
        .unwrap()
        .then(() => {
          setMessage('');
          setLink('');
        });
    }
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this broadcast?')) {
      dispatch(deleteBroadcast(id));
    }
  };
  
  const handleActivate = (id) => {
    dispatch(activateBroadcast(id));
  };
  
  const handleDeactivateAll = () => {
      if (window.confirm('Are you sure you want to turn off the site-wide announcement?')) {
          dispatch(deactivateAllBroadcasts());
      }
  };

  // --- NEW: Handle sending to all user bells ---
  const handleSendToAllBells = (id, broadcastMessageText) => {
    if (window.confirm(`Are you sure you want to send "${broadcastMessageText}" to ALL registered users' notification bells?`)) {
        dispatch(sendBroadcastToAllUsers(id));
    }
  }

  return (
    <div className="p-4 sm:p-8">
      <header className="mb-6 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
            <h1 className="text-2xl font-bold text-slate-800">Broadcast Management</h1>
            <p className="mt-1 text-sm text-slate-500">Create and manage site-wide announcements.</p>
        </div>
        <div>
            <button 
                onClick={handleDeactivateAll}
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-amber-500 text-white font-semibold py-2 px-4 rounded-lg text-sm hover:bg-amber-600 transition-colors duration-300"
            >
                <PowerOff size={16} />
                Deactivate All
            </button>
        </div>
      </header>

      {/* Create Broadcast Form */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-8">
        <form onSubmit={handleCreateBroadcast} className="space-y-4">
          <div>
            <label htmlFor="broadcast-message" className="block text-sm font-medium text-slate-700 mb-1">
              New Broadcast Message
            </label>
            <textarea
              id="broadcast-message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={3}
              className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              placeholder="e.g., Scheduled maintenance this Sunday at 2 AM."
              required
            />
          </div>
          <div>
            <label htmlFor="broadcast-link" className="block text-sm font-medium text-slate-700 mb-1">
              Optional Link <span className="text-slate-400">(e.g., /vehicles/some-id)</span>
            </label>
            <input
              id="broadcast-link"
              type="text"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              placeholder="/contact"
            />
          </div>
          <div className="text-right">
            <button type="submit" disabled={isLoading} className="inline-flex items-center gap-2 bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg text-sm hover:bg-blue-700 disabled:bg-blue-300 transition-colors">
              {isLoading ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
              Create Broadcast
            </button>
          </div>
        </form>
      </motion.div>

      {/* Broadcasts List */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {isLoading && broadcasts.length === 0 ? (
          <div className="p-16 text-center"><Loader2 className="h-8 w-8 animate-spin text-slate-500 mx-auto" /></div>
        ) : (
          <div className="divide-y divide-slate-200">
            {broadcasts.map(b => (
              <motion.div
                key={b._id}
                layout
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -50 }}
                className={`p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${b.isActive ? 'bg-sky-50/50' : ''}`}
              >
                <div className="flex-grow">
                  <p className="text-slate-800">{b.message}</p>
                  {b.link && (
                      <a href={b.link} target="_blank" rel="noopener noreferrer" className="mt-1 text-xs text-blue-600 hover:underline flex items-center gap-1">
                          <LinkIcon size={12} /> {b.link}
                      </a>
                  )}
                  <p className="text-xs text-slate-400 mt-2">
                    By {b.createdBy?.name || 'Unknown'} - <TimeAgo date={b.createdAt} />
                  </p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0 w-full sm:w-auto">
                  {/* --- NEW: Send to All Bells Button --- */}
                  <button onClick={() => handleSendToAllBells(b._id, b.message)} disabled={isLoading} className="w-1/2 sm:w-auto flex-grow sm:flex-grow-0 flex items-center justify-center gap-2 p-2 text-sm font-semibold bg-purple-100 text-purple-800 rounded-lg hover:bg-purple-200 disabled:bg-slate-200 disabled:text-slate-500 disabled:cursor-not-allowed transition-colors">
                    <Bell size={14} /> Send to All Bells
                  </button>
                  <button onClick={() => handleActivate(b._id)} disabled={b.isActive || isLoading} className="w-1/2 sm:w-auto flex-grow sm:flex-grow-0 flex items-center justify-center gap-2 p-2 text-sm font-semibold bg-green-100 text-green-800 rounded-lg hover:bg-green-200 disabled:bg-slate-200 disabled:text-slate-500 disabled:cursor-not-allowed transition-colors">
                    <Power size={14} /> Activate
                  </button>
                  <button onClick={() => handleDelete(b._id)} disabled={isLoading} className="w-1/2 sm:w-auto flex-grow sm:flex-grow-0 flex items-center justify-center gap-2 p-2 text-sm font-semibold bg-red-100 text-red-800 rounded-lg hover:bg-red-200 disabled:bg-slate-200 disabled:text-slate-500 disabled:cursor-not-allowed transition-colors">
                    <Trash2 size={14} /> Delete
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BroadcastManagement;