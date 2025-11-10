import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import videoAPI from '../../services/videoAPI';

// Async thunks
export const fetchVideos = createAsyncThunk(
  'videos/fetchVideos',
  async (params, { rejectWithValue }) => {
    try {
      const response = await videoAPI.getVideos(params);
      return response;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const fetchFeaturedVideos = createAsyncThunk(
  'videos/fetchFeatured',
  async (_, { rejectWithValue }) => {
    try {
      const response = await videoAPI.getFeaturedVideos();
      return response;
    } catch (error) {
      console.error('Error fetching featured videos:', error);
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch featured videos');
    }
  }
);

export const fetchRecommendations = createAsyncThunk(
  'videos/fetchRecommendations',
  async (profileId, { rejectWithValue }) => {
    try {
      const response = await videoAPI.getRecommendations(profileId);
      return response;
    } catch (error) {
      console.error('Error fetching recommendations:', error);
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch recommendations');
    }
  }
);

export const fetchVideoDetails = createAsyncThunk(
  'videos/fetchDetails',
  async (videoId, { rejectWithValue }) => {
    try {
      const response = await videoAPI.getVideoDetails(videoId);
      return response;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const updateWatchHistory = createAsyncThunk(
  'videos/updateWatchHistory',
  async ({ videoId, profileId, progress }, { rejectWithValue }) => {
    try {
      const response = await videoAPI.updateWatchHistory(videoId, profileId, progress);
      return response;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const toggleWatchlist = createAsyncThunk(
  'videos/toggleWatchlist',
  async ({ videoId, profileId }, { rejectWithValue }) => {
    try {
      const response = await videoAPI.toggleWatchlist(videoId, profileId);
      return { videoId, ...response };
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

const videoSlice = createSlice({
  name: 'videos',
  initialState: {
    videos: [],
    featuredVideos: [],
    recommendations: [],
    currentVideo: null,
    watchlist: [],
    loading: false,
    error: null,
    pagination: {
      currentPage: 1,
      totalPages: 0,
      totalVideos: 0
    }
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setCurrentVideo: (state, action) => {
      state.currentVideo = action.payload;
    },
    clearCurrentVideo: (state) => {
      state.currentVideo = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Videos
      .addCase(fetchVideos.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchVideos.fulfilled, (state, action) => {
        state.loading = false;
        state.videos = action.payload.videos;
        state.pagination = {
          currentPage: action.payload.currentPage,
          totalPages: action.payload.totalPages,
          totalVideos: action.payload.totalVideos
        };
      })
      .addCase(fetchVideos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch Featured Videos
      .addCase(fetchFeaturedVideos.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFeaturedVideos.fulfilled, (state, action) => {
        state.loading = false;
        state.featuredVideos = action.payload || [];
      })
      .addCase(fetchFeaturedVideos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.featuredVideos = [];
      })
      // Fetch Recommendations
      .addCase(fetchRecommendations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRecommendations.fulfilled, (state, action) => {
        state.loading = false;
        state.recommendations = action.payload || [];
      })
      .addCase(fetchRecommendations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.recommendations = [];
      })
      // Fetch Video Details
      .addCase(fetchVideoDetails.fulfilled, (state, action) => {
        state.currentVideo = action.payload;
      })
      // Toggle Watchlist
      .addCase(toggleWatchlist.fulfilled, (state, action) => {
        const { videoId, inWatchlist } = action.payload;
        if (inWatchlist) {
          state.watchlist.push(videoId);
        } else {
          state.watchlist = state.watchlist.filter(id => id !== videoId);
        }
      });
  }
});

export const { clearError, setCurrentVideo, clearCurrentVideo } = videoSlice.actions;
export default videoSlice.reducer;
