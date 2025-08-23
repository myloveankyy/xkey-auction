import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import vehicleReducer from '../features/vehicles/vehicleSlice';
// --- ADD THIS IMPORT ---
import heroImageReducer from '../features/heroImages/heroImageSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    vehicles: vehicleReducer,
    // --- ADD THIS LINE ---
    heroImages: heroImageReducer,
  },
});