import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getNotifications, markAsRead, markAllAsRead, reset } from '../features/notifications/notificationSlice';
import { Loader2, BellOff, CheckCheck } from 'lucide-react';
import TimeAgo from 'react-timeago';
import Header from '../components/Header'; // Assuming Header is a standard layout component

const NotificationsPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { notifications, isLoading, isError, message } = useSelector((state) => state.notifications);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    // If there's an error, you might want to show a toast
    if (isError) {
      console.error(message);
    }
    // Fetch notifications when the component mounts
    if (user) {
      dispatch(getNotifications());
    }
    // Cleanup on unmount
    return () => {
      dispatch(reset());
    };
  }, [user, isError, message, dispatch]);

  const handleNotificationClick = (notification) => {
    if (!notification.isRead) {
      dispatch(markAsRead(notification._id));
    }
    if (notification.link) {
      navigate(notification.link);
    }
  };
  
  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="bg-slate-50 min-h-screen">
      <Header />
      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg border border-slate-200/80">
          {/* Header Section */}
          <div className="p-6 border-b border-slate-200/80 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                Notifications
              </h1>
              <p className="text-slate-500 mt-1">
                Here's a list of your recent activities and updates.
              </p>
            </div>
            {unreadCount > 0 && (
                <button 
                    onClick={() => dispatch(markAllAsRead())}
                    className="flex items-center gap-2 bg-slate-100 text-slate-700 font-semibold py-2 px-4 rounded-lg text-sm hover:bg-slate-200 transition-colors duration-300"
                >
                    <CheckCheck size={16} />
                    Mark All as Read
                </button>
            )}
          </div>

          {/* Notifications List */}
          <div className="divide-y divide-slate-200/80">
            {isLoading && notifications.length === 0 ? (
              <div className="flex justify-center items-center p-20">
                <Loader2 className="h-10 w-10 animate-spin text-blue-500" />
              </div>
            ) : notifications.length > 0 ? (
              notifications.map((notification) => (
                <div
                  key={notification._id}
                  onClick={() => handleNotificationClick(notification)}
                  className={`p-6 flex items-start gap-4 cursor-pointer transition-colors hover:bg-slate-50 ${!notification.isRead ? 'bg-white' : 'bg-slate-50/50'}`}
                >
                  <div
                    className={`mt-1 h-2.5 w-2.5 rounded-full flex-shrink-0 ${!notification.isRead ? 'bg-blue-500 ring-4 ring-blue-500/10' : 'bg-slate-300'}`}
                  ></div>
                  <div className="flex-grow">
                    <p className={`text-base ${!notification.isRead ? 'text-slate-800 font-semibold' : 'text-slate-600'}`}>
                      {notification.message}
                    </p>
                    <p className="text-sm text-slate-400 mt-1">
                      <TimeAgo date={notification.createdAt} />
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-20 text-center">
                <BellOff className="mx-auto h-12 w-12 text-slate-400" />
                <h3 className="mt-4 text-lg font-bold text-slate-800">No notifications yet</h3>
                <p className="mt-1 text-sm text-slate-500">
                  We'll let you know when something new happens.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default NotificationsPage;