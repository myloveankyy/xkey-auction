import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import analyticsService from './analyticsService';

const initialState = {
  dashboardStats: null,
  vehiclesByStatus: [],
  leadsByStatus: [],
  userRegistrationTrends: [], // --- NEW STATE ---
  vehicleSubmissionTrends: [], // --- NEW STATE ---
  topVehiclesByLeads: [], // --- NEW STATE ---
  isLoading: false,
  isError: false,
  isSuccess: false,
  message: '',
};

// --- Async Thunks ---

// Get Dashboard Stats
export const getDashboardStats = createAsyncThunk('analytics/getDashboardStats', async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await analyticsService.getDashboardStats(token);
    } catch (error) {
      const message = (error.response?.data?.message) || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
});

// Get Vehicles by Status
export const getVehiclesByStatus = createAsyncThunk('analytics/getVehiclesByStatus', async (_, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token;
        return await analyticsService.getVehiclesByStatus(token);
    } catch (error) {
        const message = (error.response?.data?.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

// Get Leads by Status
export const getLeadsByStatus = createAsyncThunk('analytics/getLeadsByStatus', async (_, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token;
        return await analyticsService.getLeadsByStatus(token);
    } catch (error) {
        const message = (error.response?.data?.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

// --- NEW: Get User Registration Trends ---
export const getUserRegistrationTrends = createAsyncThunk('analytics/getUserRegistrationTrends', async (_, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token;
        return await analyticsService.getUserRegistrationTrends(token);
    } catch (error) {
        const message = (error.response?.data?.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

// --- NEW: Get Vehicle Submission Trends ---
export const getVehicleSubmissionTrends = createAsyncThunk('analytics/getVehicleSubmissionTrends', async (_, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token;
        return await analyticsService.getVehicleSubmissionTrends(token);
    } catch (error) {
        const message = (error.response?.data?.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

// --- NEW: Get Top Vehicles by Leads ---
export const getTopVehiclesByLeads = createAsyncThunk('analytics/getTopVehiclesByLeads', async (_, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token;
        return await analyticsService.getTopVehiclesByLeads(token);
    } catch (error) {
        const message = (error.response?.data?.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});


// --- The Analytics Slice ---
export const analyticsSlice = createSlice({
  name: 'analytics',
  initialState,
  reducers: {
    reset: (state) => initialState,
  },
  extraReducers: (builder) => {
    builder
      // Get Dashboard Stats
      .addCase(getDashboardStats.pending, (state) => { state.isLoading = true; })
      .addCase(getDashboardStats.fulfilled, (state, action) => { state.isLoading = false; state.isSuccess = true; state.dashboardStats = action.payload; })
      .addCase(getDashboardStats.rejected, (state, action) => { state.isLoading = false; state.isError = true; state.message = action.payload; })
      // Get Vehicles by Status
      .addCase(getVehiclesByStatus.pending, (state) => { state.isLoading = true; })
      .addCase(getVehiclesByStatus.fulfilled, (state, action) => { state.isLoading = false; state.isSuccess = true; state.vehiclesByStatus = action.payload; })
      .addCase(getVehiclesByStatus.rejected, (state, action) => { state.isLoading = false; state.isError = true; state.message = action.payload; })
      // Get Leads by Status
      .addCase(getLeadsByStatus.pending, (state) => { state.isLoading = true; })
      .addCase(getLeadsByStatus.fulfilled, (state, action) => { state.isLoading = false; state.isSuccess = true; state.leadsByStatus = action.payload; })
      .addCase(getLeadsByStatus.rejected, (state, action) => { state.isLoading = false; state.isError = true; state.message = action.payload; })
      // --- NEW: Get User Registration Trends ---
      .addCase(getUserRegistrationTrends.pending, (state) => { state.isLoading = true; })
      .addCase(getUserRegistrationTrends.fulfilled, (state, action) => { state.isLoading = false; state.isSuccess = true; state.userRegistrationTrends = action.payload; })
      .addCase(getUserRegistrationTrends.rejected, (state, action) => { state.isLoading = false; state.isError = true; state.message = action.payload; })
      // --- NEW: Get Vehicle Submission Trends ---
      .addCase(getVehicleSubmissionTrends.pending, (state) => { state.isLoading = true; })
      .addCase(getVehicleSubmissionTrends.fulfilled, (state, action) => { state.isLoading = false; state.isSuccess = true; state.vehicleSubmissionTrends = action.payload; })
      .addCase(getVehicleSubmissionTrends.rejected, (state, action) => { state.isLoading = false; state.isError = true; state.message = action.payload; })
      // --- NEW: Get Top Vehicles by Leads ---
      .addCase(getTopVehiclesByLeads.pending, (state) => { state.isLoading = true; })
      .addCase(getTopVehiclesByLeads.fulfilled, (state, action) => { state.isLoading = false; state.isSuccess = true; state.topVehiclesByLeads = action.payload; })
      .addCase(getTopVehiclesByLeads.rejected, (state, action) => { state.isLoading = false; state.isError = true; state.message = action.payload; });
  },
});

export const { reset } = analyticsSlice.actions;
export default analyticsSlice.reducer;