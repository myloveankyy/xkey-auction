import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import broadcastService from './broadcastService';

const initialState = {
  broadcasts: [], // For admin panel list
  activeBroadcast: null, // For public banner
  isLoading: false,
  isError: false,
  isSuccess: false,
  message: '',
};

// --- Async Thunks ---
export const getActiveBroadcast = createAsyncThunk('broadcasts/getActive', async (_, thunkAPI) => {
  try {
    return await broadcastService.getActiveBroadcast();
  } catch (error) {
    return thunkAPI.rejectWithValue('Could not fetch active broadcast.');
  }
});

export const getAllBroadcasts = createAsyncThunk('broadcasts/getAllAdmin', async (_, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token;
        return await broadcastService.getAllBroadcasts(token);
    } catch (error) {
        const message = (error.response?.data?.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

export const createBroadcast = createAsyncThunk('broadcasts/create', async (broadcastData, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token;
        return await broadcastService.createBroadcast(broadcastData, token);
    } catch (error) {
        const message = (error.response?.data?.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

export const activateBroadcast = createAsyncThunk('broadcasts/activate', async (id, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token;
        await broadcastService.activateBroadcast(id, token);
        return { id }; // Return the ID for the reducer
    } catch (error) {
        const message = (error.response?.data?.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

export const deactivateAllBroadcasts = createAsyncThunk('broadcasts/deactivateAll', async (_, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token;
        return await broadcastService.deactivateAllBroadcasts(token);
    } catch (error) {
        const message = (error.response?.data?.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

export const deleteBroadcast = createAsyncThunk('broadcasts/delete', async (id, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token;
        await broadcastService.deleteBroadcast(id, token);
        return { id }; // Return the ID for the reducer
    } catch (error) {
        const message = (error.response?.data?.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

// --- NEW: Send Broadcast to All Users Thunk ---
export const sendBroadcastToAllUsers = createAsyncThunk('broadcasts/sendToAllUsers', async (broadcastId, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token;
        return await broadcastService.sendBroadcastToAllUsers(broadcastId, token);
    } catch (error) {
        const message = (error.response?.data?.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});


// --- The Broadcast Slice ---
export const broadcastSlice = createSlice({
  name: 'broadcasts',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isError = false;
      state.isSuccess = false;
      state.message = '';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getActiveBroadcast.fulfilled, (state, action) => {
        state.activeBroadcast = action.payload;
      })
      .addCase(getAllBroadcasts.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllBroadcasts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.broadcasts = action.payload;
      })
      .addCase(getAllBroadcasts.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(createBroadcast.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createBroadcast.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.message = 'Broadcast created successfully.';
        state.broadcasts.unshift(action.payload);
      })
      .addCase(createBroadcast.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(deleteBroadcast.fulfilled, (state, action) => {
        state.isSuccess = true;
        state.message = 'Broadcast deleted.';
        state.broadcasts = state.broadcasts.filter((b) => b._id !== action.payload.id);
      })
      .addCase(activateBroadcast.fulfilled, (state, action) => {
        state.isSuccess = true;
        state.message = 'Broadcast activated.';
        state.broadcasts.forEach(b => {
            b.isActive = b._id === action.payload.id;
        });
      })
      .addCase(deactivateAllBroadcasts.fulfilled, (state) => {
          state.isSuccess = true;
          state.message = 'All broadcasts deactivated.';
          state.broadcasts.forEach(b => {
              b.isActive = false;
          });
      })
      // --- NEW: Send Broadcast to All Users Cases ---
      .addCase(sendBroadcastToAllUsers.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(sendBroadcastToAllUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.message = action.payload.message; // Message from backend: "Broadcast sent..."
      })
      .addCase(sendBroadcastToAllUsers.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { reset } = broadcastSlice.actions;
export default broadcastSlice.reducer;