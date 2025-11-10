import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import subscriptionAPI from '../../services/subscriptionAPI';

// Async thunks
export const fetchSubscriptionPlans = createAsyncThunk(
  'subscription/fetchPlans',
  async (_, { rejectWithValue }) => {
    try {
      const response = await subscriptionAPI.getPlans();
      return response;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const createOrder = createAsyncThunk(
  'subscription/createOrder',
  async (planId, { rejectWithValue }) => {
    try {
      const response = await subscriptionAPI.createOrder(planId);
      return response;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const verifyPayment = createAsyncThunk(
  'subscription/verifyPayment',
  async (paymentData, { rejectWithValue }) => {
    try {
      const response = await subscriptionAPI.verifyPayment(paymentData);
      return response;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const cancelSubscription = createAsyncThunk(
  'subscription/cancel',
  async (_, { rejectWithValue }) => {
    try {
      const response = await subscriptionAPI.cancelSubscription();
      return response;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

const subscriptionSlice = createSlice({
  name: 'subscription',
  initialState: {
    plans: [],
    currentPlan: null,
    paymentOrder: null,
    loading: false,
    error: null,
    paymentLoading: false
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearPaymentOrder: (state) => {
      state.paymentOrder = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Plans
      .addCase(fetchSubscriptionPlans.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSubscriptionPlans.fulfilled, (state, action) => {
        state.loading = false;
        state.plans = action.payload;
      })
      .addCase(fetchSubscriptionPlans.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create Order
      .addCase(createOrder.pending, (state) => {
        state.paymentLoading = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.paymentLoading = false;
        state.paymentOrder = action.payload;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.paymentLoading = false;
        state.error = action.payload;
      })
      // Verify Payment
      .addCase(verifyPayment.pending, (state) => {
        state.paymentLoading = true;
      })
      .addCase(verifyPayment.fulfilled, (state, action) => {
        state.paymentLoading = false;
        state.paymentOrder = null;
        state.currentPlan = action.payload.subscription;
      })
      .addCase(verifyPayment.rejected, (state, action) => {
        state.paymentLoading = false;
        state.error = action.payload;
      })
      // Cancel Subscription
      .addCase(cancelSubscription.fulfilled, (state) => {
        if (state.currentPlan) {
          state.currentPlan.status = 'cancelled';
          state.currentPlan.autoRenew = false;
        }
      });
  }
});

export const { clearError, clearPaymentOrder } = subscriptionSlice.actions;
export default subscriptionSlice.reducer;
