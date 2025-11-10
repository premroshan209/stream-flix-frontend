import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import videoReducer from './slices/videoSlice';
import subscriptionReducer from './slices/subscriptionSlice';
import profileReducer from './slices/profileSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    videos: videoReducer,
    subscription: subscriptionReducer,
    profiles: profileReducer,
  },
});
