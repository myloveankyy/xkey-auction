import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import leadService from './leadService';

const initialState = {
  leads: [], // For admin panel
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: '',
};

// --- Async Thunks ---

// Create New Lead (Public/Guest users)
export const createLead = createAsyncThunk('leads/create', async (leadData, thunkAPI) => {
    try {
      return await leadService.createLead(leadData);
    } catch (error) {
      const message = (error.response?.data?.message) || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
});

// Get All Leads (Admin only)
export const getAllLeads = createAsyncThunk('leads/getAll', async (_, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token;
        return await leadService.getAllLeads(token);
    } catch (error) {
        const message = (error.response?.data?.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

// Update Lead Status (Admin only)
export const updateLeadStatus = createAsyncThunk('leads/updateStatus', async ({ id, statusData }, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token;
        return await leadService.updateLeadStatus(id, statusData, token);
    } catch (error) {
        const message = (error.response?.data?.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

// Delete Lead (Admin only)
export const deleteLead = createAsyncThunk('leads/delete', async (id, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token;
        await leadService.deleteLead(id, token);
        return { id }; // Return the ID for the reducer to remove it from state
    } catch (error) {
        const message = (error.response?.data?.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});


// --- The Lead Slice ---
export const leadSlice = createSlice({
  name: 'leads',
  initialState,
  reducers: {
    reset: (state) => initialState,
  },
  extraReducers: (builder) => {
    builder
      // Create Lead
      .addCase(createLead.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createLead.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.message = action.payload.message; // "Lead submitted successfully."
      })
      .addCase(createLead.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Get All Leads
      .addCase(getAllLeads.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllLeads.fulfilled, (state, action) => {
        state.isLoading = false;
        state.leads = action.payload;
      })
      .addCase(getAllLeads.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Update Lead Status
      .addCase(updateLeadStatus.fulfilled, (state, action) => {
        state.isSuccess = true;
        state.message = 'Lead status updated.';
        state.leads = state.leads.map((lead) =>
          lead._id === action.payload._id ? action.payload : lead
        );
      })
      .addCase(updateLeadStatus.rejected, (state, action) => {
        state.isError = true;
        state.message = action.payload;
      })
      // Delete Lead
      .addCase(deleteLead.fulfilled, (state, action) => {
        state.isSuccess = true;
        state.message = 'Lead deleted.';
        state.leads = state.leads.filter((lead) => lead._id !== action.payload.id);
      })
      .addCase(deleteLead.rejected, (state, action) => {
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { reset } = leadSlice.actions;
export default leadSlice.reducer;