import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import vehicleService from './vehicleService';

const initialState = {
  vehicles: [],
  vehicle: null,
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: '',
};

const getToken = (thunkAPI) => {
    const token = thunkAPI.getState().auth.user?.token;
    if (!token) {
      return thunkAPI.rejectWithValue('Not authorized. Please log in.');
    }
    return token;
}

// --- All Async Thunks ---

export const getVehicles = createAsyncThunk('vehicles/getAll', async (_, thunkAPI) => {
  try { return await vehicleService.getVehicles(); } catch (error) { const message = (error.response?.data?.message) || error.message; return thunkAPI.rejectWithValue(message); }
});

export const getVehicleById = createAsyncThunk('vehicles/getById', async (vehicleId, thunkAPI) => {
    try {
        return await vehicleService.getVehicleById(vehicleId);
    } catch (error) {
        const message = (error.response?.data?.message) || error.message;
        return thunkAPI.rejectWithValue(message);
    }
});

export const createVehicle = createAsyncThunk('vehicles/create', async (vehicleData, thunkAPI) => {
  try { const token = getToken(thunkAPI); return await vehicleService.createVehicle(vehicleData, token); } catch (error) { const message = (error.response?.data?.message) || error.message; return thunkAPI.rejectWithValue(message); }
});

export const getMyListings = createAsyncThunk('vehicles/getMyListings', async (_, thunkAPI) => {
  try { const token = getToken(thunkAPI); return await vehicleService.getMyListings(token); } catch (error) { const message = (error.response?.data?.message) || error.message; return thunkAPI.rejectWithValue(message); }
});

export const getAllVehiclesAsAdmin = createAsyncThunk('vehicles/getAllAdmin', async (_, thunkAPI) => {
  try { const token = getToken(thunkAPI); return await vehicleService.getAllVehiclesAsAdmin(token); } catch (error) { const message = (error.response?.data?.message) || error.message; return thunkAPI.rejectWithValue(message); }
});

export const approveListing = createAsyncThunk('vehicles/approveListing', async (id, thunkAPI) => {
  try { const token = getToken(thunkAPI); return await vehicleService.approveListing(id, token); } catch (error) { const message = (error.response?.data?.message) || error.message; return thunkAPI.rejectWithValue(message); }
});

export const rejectListing = createAsyncThunk('vehicles/rejectListing', async (data, thunkAPI) => {
  try { const token = getToken(thunkAPI); return await vehicleService.rejectListing(data.id, { reason: data.reason }, token); } catch (error) { const message = (error.response?.data?.message) || error.message; return thunkAPI.rejectWithValue(message); }
});

export const submitOffer = createAsyncThunk('vehicles/submitOffer', async (data, thunkAPI) => {
  try { const token = getToken(thunkAPI); return await vehicleService.submitNegotiationOffer(data.vehicleId, { amount: data.amount, message: data.message }, token); } catch (error) { const message = (error.response?.data?.message) || error.message; return thunkAPI.rejectWithValue(message); }
});

export const acceptOffer = createAsyncThunk('vehicles/acceptOffer', async (vehicleId, thunkAPI) => {
  try { const token = getToken(thunkAPI); return await vehicleService.acceptOffer(vehicleId, token); } catch (error) { const message = (error.response?.data?.message) || error.message; return thunkAPI.rejectWithValue(message); }
});

// --- NEW: DELETE VEHICLE THUNK ---
export const deleteVehicle = createAsyncThunk('vehicles/delete', async (vehicleId, thunkAPI) => {
    try {
        const token = getToken(thunkAPI);
        return await vehicleService.deleteVehicle(vehicleId, token);
    } catch (error) {
        const message = (error.response?.data?.message) || error.message;
        return thunkAPI.rejectWithValue(message);
    }
});


export const vehicleSlice = createSlice({
  name: 'vehicle',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = '';
      state.vehicle = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getVehicles.fulfilled, (state, action) => {
        state.isLoading = false; state.isSuccess = true; state.vehicles = action.payload;
      })
      .addCase(getVehicleById.fulfilled, (state, action) => {
        state.isLoading = false; state.isSuccess = true; state.vehicle = action.payload;
      })
      .addCase(getMyListings.fulfilled, (state, action) => {
        state.isLoading = false; state.isSuccess = true; state.vehicles = action.payload;
      })
      .addCase(getAllVehiclesAsAdmin.fulfilled, (state, action) => {
        state.isLoading = false; state.isSuccess = true; state.vehicles = action.payload;
      })
      .addCase(createVehicle.fulfilled, (state, action) => {
        state.isLoading = false; state.isSuccess = true; state.message = "Vehicle created successfully!";
        state.vehicles.push(action.payload);
      })
      .addCase(approveListing.fulfilled, (state, action) => {
        state.isLoading = false; state.isSuccess = true; state.message = "Listing Approved!";
        state.vehicles = state.vehicles.map((v) => v._id === action.payload._id ? action.payload : v);
      })
      .addCase(rejectListing.fulfilled, (state, action) => {
        state.isLoading = false; state.isSuccess = true; state.message = "Listing Rejected!";
        state.vehicles = state.vehicles.map((v) => v._id === action.payload._id ? action.payload : v);
      })
      .addCase(submitOffer.fulfilled, (state, action) => {
        state.isLoading = false; state.isSuccess = true; state.message = "Offer submitted!";
        state.vehicles = state.vehicles.map((v) => v._id === action.payload._id ? action.payload : v);
      })
      .addCase(acceptOffer.fulfilled, (state, action) => {
        state.isLoading = false; state.isSuccess = true; state.message = "Offer Accepted!";
        state.vehicles = state.vehicles.map((v) => v._id === action.payload._id ? action.payload : v);
      })
      // --- NEW: REDUCER FOR DELETING A VEHICLE ---
      .addCase(deleteVehicle.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.message = action.payload.message; // Use message from backend
        // Remove the deleted vehicle from the state array
        state.vehicles = state.vehicles.filter((v) => v._id !== action.payload.id);
      })
      .addMatcher(
        (action) => action.type.endsWith('/pending'),
        (state) => { state.isLoading = true; }
      )
      .addMatcher(
        (action) => action.type.endsWith('/rejected'),
        (state, action) => {
          state.isLoading = false;
          state.isError = true;
          state.message = action.payload;
          state.vehicle = null;
        }
      );
  },
});

export const { reset } = vehicleSlice.actions;
export default vehicleSlice.reducer;