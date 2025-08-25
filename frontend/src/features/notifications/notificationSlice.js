import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import notificationService from './notificationService';

const initialState = {
  notifications: [],
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: '',
};

// --- Async Thunks ---

// Get user notifications
export const getNotifications = createAsyncThunk('notifications/getAll', async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await notificationService.getNotifications(token);
    } catch (error) {
      const message = (error.response?.data?.message) || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
});

// Mark a notification as read
export const markAsRead = createAsyncThunk('notifications/markAsRead', async (id, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token;
        return await notificationService.markAsRead(id, token);
    } catch (error) {
        const message = (error.response?.data?.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

// Mark all notifications as read
export const markAllAsRead = createAsyncThunk('notifications/markAllAsRead', async (_, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token;
        return await notificationService.markAllAsRead(token);
    } catch (error) {
        const message = (error.response?.data?.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});


// --- The Notification Slice ---
export const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    reset: (state) => initialState,
  },
  extraReducers: (builder) => {
    builder
      // Get Notifications
      .addCase(getNotifications.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getNotifications.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.notifications = action.payload;
      })
      .addCase(getNotifications.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Mark as Read
      .addCase(markAsRead.fulfilled, (state, action) => {
        state.notifications = state.notifications.map((notification) =>
          notification._id === action.payload._id ? { ...notification, isRead: true } : notification
        );
      })
      // Mark All as Read
      .addCase(markAllAsRead.fulfilled, (state) => {
          state.notifications.forEach((notification) => {
              notification.isRead = true;
          });
      });
  },
});

export const { reset } = notificationSlice.actions;
export default notificationSlice.reducer;