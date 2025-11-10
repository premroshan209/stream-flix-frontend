import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import profileAPI from '../../services/profileAPI';

// Async thunks
export const createProfile = createAsyncThunk(
  'profiles/create',
  async (profileData, { rejectWithValue }) => {
    try {
      const response = await profileAPI.createProfile(profileData);
      return response;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const updateProfile = createAsyncThunk(
  'profiles/update',
  async ({ profileId, profileData }, { rejectWithValue }) => {
    try {
      const response = await profileAPI.updateProfile(profileId, profileData);
      return response;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const deleteProfile = createAsyncThunk(
  'profiles/delete',
  async (profileId, { rejectWithValue }) => {
    try {
      await profileAPI.deleteProfile(profileId);
      return profileId;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const fetchWatchlist = createAsyncThunk(
  'profiles/fetchWatchlist',
  async (profileId, { rejectWithValue }) => {
    try {
      const response = await profileAPI.getWatchlist(profileId);
      return response;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const fetchWatchHistory = createAsyncThunk(
  'profiles/fetchWatchHistory',
  async (profileId, { rejectWithValue }) => {
    try {
      const response = await profileAPI.getWatchHistory(profileId);
      return response;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

const profileSlice = createSlice({
  name: 'profiles',
  initialState: {
    profiles: [],
    currentProfile: null,
    watchlist: [],
    watchHistory: [],
    loading: false,
    error: null
  },
  reducers: {
    setCurrentProfile: (state, action) => {
      state.currentProfile = action.payload;
    },
    clearCurrentProfile: (state) => {
      state.currentProfile = null;
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Create Profile
      .addCase(createProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profiles.push(action.payload.profile);
      })
      .addCase(createProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update Profile
      .addCase(updateProfile.fulfilled, (state, action) => {
        const index = state.profiles.findIndex(p => p._id === action.payload.profile._id);
        if (index !== -1) {
          state.profiles[index] = action.payload.profile;
        }
      })
      // Delete Profile
      .addCase(deleteProfile.fulfilled, (state, action) => {
        state.profiles = state.profiles.filter(p => p._id !== action.payload);
      })
      // Fetch Watchlist
      .addCase(fetchWatchlist.fulfilled, (state, action) => {
        state.watchlist = action.payload;
      })
      // Fetch Watch History
      .addCase(fetchWatchHistory.fulfilled, (state, action) => {
        state.watchHistory = action.payload;
      });
  }
});

export const { setCurrentProfile, clearCurrentProfile, clearError } = profileSlice.actions;
export default profileSlice.reducer;
