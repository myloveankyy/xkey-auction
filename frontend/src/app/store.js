import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import vehicleReducer from '../features/vehicles/vehicleSlice';
import heroImageReducer from '../features/heroImages/heroImageSlice';
import notificationReducer from '../features/notifications/notificationSlice';
import broadcastReducer from '../features/broadcasts/broadcastSlice';
import leadReducer from '../features/leads/leadSlice';
// --- ADD THIS IMPORT ---
import analyticsReducer from '../features/analytics/analyticsSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    vehicles: vehicleReducer,
    heroImages: heroImageReducer,
    notifications: notificationReducer,
    broadcasts: broadcastReducer,
    leads: leadReducer,
    // --- ADD THIS LINE ---
    analytics: analyticsReducer,
  },
});