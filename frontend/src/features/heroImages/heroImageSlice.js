import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import heroImageService from './heroImageService';

const initialState = {
  heroImages: [],
  isLoading: false,
  isError: false,
  isSuccess: false,
  message: '',
};

// Async Thunks
// Get all hero images
export const getHeroImages = createAsyncThunk(
  'heroImages/getAll',
  async (_, thunkAPI) => {
    try {
      return await heroImageService.getHeroImages();
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Create a new hero image
export const createHeroImage = createAsyncThunk(
  'heroImages/create',
  async (imageData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await heroImageService.createHeroImage(imageData, token);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Delete a hero image
export const deleteHeroImage = createAsyncThunk(
  'heroImages/delete',
  async (imageId, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await heroImageService.deleteHeroImage(imageId, token);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const heroImageSlice = createSlice({
  name: 'heroImages',
  initialState,
  reducers: {
    // --- FIX 1: MODIFIED RESET REDUCER ---
    // This now only resets status flags and leaves the data untouched.
    reset: (state) => {
      state.isLoading = false;
      state.isError = false;
      state.isSuccess = false;
      state.message = '';
    },
  },
  extraReducers: (builder) => {
    builder
      // Get Images
      .addCase(getHeroImages.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getHeroImages.fulfilled, (state, action) => {
        state.isLoading = false;
        // --- FIX 2: REMOVED isSuccess ---
        // Fetching data isn't a "success" action that needs a toast.
        // state.isSuccess = true; <-- This line is removed.
        state.heroImages = action.payload;
      })
      .addCase(getHeroImages.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Create Image
      .addCase(createHeroImage.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createHeroImage.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.message = "Image uploaded successfully!";
        state.heroImages.unshift(action.payload);
      })
      .addCase(createHeroImage.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Delete Image
      .addCase(deleteHeroImage.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteHeroImage.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.message = "Image deleted successfully!";
        state.heroImages = state.heroImages.filter(
          (image) => image._id !== action.payload.id
        );
      })
      .addCase(deleteHeroImage.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { reset } = heroImageSlice.actions;
export default heroImageSlice.reducer;