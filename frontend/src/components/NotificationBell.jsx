import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { Bell, BellRing, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getNotifications, markAsRead, markAllAsRead, reset } from '../features/notifications/notificationSlice';
import TimeAgo from 'react-timeago';

const NotificationBell = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  const { notifications, isLoading } = useSelector((state) => state.notifications);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (user) {
      dispatch(getNotifications());
    }
    return () => {
      dispatch(reset());
    };
  }, [user, dispatch]);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  // Handle clicking outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  const handleNotificationClick = (notification) => {
    if (!notification.isRead) {
      dispatch(markAsRead(notification._id));
    }
    if (notification.link) {
      navigate(notification.link);
    }
    setIsOpen(false);
  };

  const handleMarkAllRead = () => {
      dispatch(markAllAsRead());
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button onClick={() => setIsOpen(!isOpen)} className="relative p-2 text-slate-600 hover:text-slate-900 rounded-full hover:bg-slate-100 transition-colors">
        {unreadCount > 0 ? <BellRing size={20} className="animate-wiggle" /> : <Bell size={20} />}
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 block h-5 w-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center font-bold ring-2 ring-white">
            {unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-lg shadow-2xl border border-slate-200/80 origin-top-right z-50 overflow-hidden"
          >
            <div className="p-3 flex justify-between items-center border-b border-slate-200/80">
                <h3 className="font-bold text-slate-800">Notifications</h3>
                { unreadCount > 0 && 
                    <button onClick={handleMarkAllRead} className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1">
                        <Check size={14}/> Mark all as read
                    </button>
                }
            </div>
            <div className="max-h-96 overflow-y-auto">
              {notifications.length > 0 ? (
                notifications.map(notification => (
                  <div
                    key={notification._id}
                    onClick={() => handleNotificationClick(notification)}
                    className={`p-3 flex items-start gap-3 cursor-pointer transition-colors hover:bg-slate-50 ${!notification.isRead ? 'bg-blue-50' : 'bg-white'}`}
                  >
                    <div className={`mt-1 h-2.5 w-2.5 rounded-full flex-shrink-0 ${!notification.isRead ? 'bg-blue-500' : 'bg-slate-300'}`}></div>
                    <div className="flex-grow">
                      <p className={`text-sm ${!notification.isRead ? 'text-slate-800 font-semibold' : 'text-slate-600'}`}>
                        {notification.message}
                      </p>
                      <p className="text-xs text-slate-400 mt-1">
                        <TimeAgo date={notification.createdAt} />
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-6 text-center text-sm text-slate-500">
                  {isLoading ? 'Loading...' : 'You have no new notifications.'}
                </div>
              )}
            </div>
            <Link to="/notifications" onClick={() => setIsOpen(false)} className="block w-full text-center bg-slate-50/50 p-3 text-sm font-bold text-blue-600 hover:bg-slate-100 transition-colors border-t border-slate-200/80">
              View All Notifications
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationBell;