import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import authService from './authService';

const user = JSON.parse(localStorage.getItem('user'));

const initialState = {
  user: user ? user : null,
  users: [],
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: '',
};

// --- Async Thunks ---

// Register user
export const register = createAsyncThunk('auth/register', async (user, thunkAPI) => {
    try {
      return await authService.register(user);
    } catch (error) {
      const message = (error.response?.data?.message) || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
});

// Login user
export const login = createAsyncThunk('auth/login', async (user, thunkAPI) => {
  try {
    return await authService.login(user);
  } catch (error) {
    const message = (error.response?.data?.message) || error.message || error.toString();
    return thunkAPI.rejectWithValue(message);
  }
});

// Logout user
export const logout = createAsyncThunk('auth/logout', async () => {
  await authService.logout();
});

// Get all users (Admin only)
export const getAllUsers = createAsyncThunk('auth/getAllUsers', async (_, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token;
        return await authService.getAllUsers(token);
    } catch (error) {
        const message = (error.response?.data?.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

// Delete a user (Admin only)
export const deleteUser = createAsyncThunk('auth/deleteUser', async (userId, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token;
        return await authService.deleteUser(userId, token);
    } catch (error) {
        const message = (error.response?.data?.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

// --- NEW: Send Direct Notification (Admin only) ---
export const sendDirectNotification = createAsyncThunk('auth/sendNotification', async (notificationData, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token;
        return await authService.sendDirectNotification(notificationData, token);
    } catch (error) {
        const message = (error.response?.data?.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

// --- The Auth Slice ---
export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = '';
    },
  },
  extraReducers: (builder) => {
    builder
      // ... (Register, Login, Logout cases remain unchanged)
      .addCase(register.pending, (state) => { state.isLoading = true; })
      .addCase(register.fulfilled, (state, action) => { state.isLoading = false; state.isSuccess = true; state.user = action.payload; })
      .addCase(register.rejected, (state, action) => { state.isLoading = false; state.isError = true; state.message = action.payload; state.user = null; })
      .addCase(login.pending, (state) => { state.isLoading = true; })
      .addCase(login.fulfilled, (state, action) => { state.isLoading = false; state.isSuccess = true; state.user = action.payload; })
      .addCase(login.rejected, (state, action) => { state.isLoading = false; state.isError = true; state.message = action.payload; state.user = null; })
      .addCase(logout.fulfilled, (state) => { state.user = null; })
      // Get All Users
      .addCase(getAllUsers.pending, (state) => { state.isLoading = true; })
      .addCase(getAllUsers.fulfilled, (state, action) => { state.isLoading = false; state.users = action.payload; })
      .addCase(getAllUsers.rejected, (state, action) => { state.isLoading = false; state.isError = true; state.message = action.payload; })
      // Delete User
      .addCase(deleteUser.pending, (state) => { /* Optionally handle loading state */ })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.isSuccess = true;
        state.message = action.payload.message;
        state.users = state.users.filter((user) => user._id !== action.payload.id);
      })
      .addCase(deleteUser.rejected, (state, action) => { state.isError = true; state.message = action.payload; })
      // --- NEW: Send Notification Cases ---
      .addCase(sendDirectNotification.pending, (state) => {
        state.isLoading = true; // Use loading state for feedback
      })
      .addCase(sendDirectNotification.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.message = action.payload.message; // "Notification sent successfully."
      })
      .addCase(sendDirectNotification.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { reset } = authSlice.actions;
export default authSlice.reducer;