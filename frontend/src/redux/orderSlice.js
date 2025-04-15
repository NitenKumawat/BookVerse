import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// ✅ Define Backend API Base URL
const API_URL = import.meta.env.VITE_API_URL;



// 🛒 Place Order (Async Action)
export const placeOrder = createAsyncThunk(
  "orders/placeOrder",
  async (orderData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/orders/place`, orderData, { withCredentials: true });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to place order");
    }
  }
);

// 📦 Fetch User Orders
export const fetchOrders = createAsyncThunk(
  "orders/fetchOrders",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/orders`, { withCredentials: true });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch orders");
    }
  }
);

// 🚚 Update Order Status (Admin Only)
export const updateOrderStatus = createAsyncThunk(
  "orders/updateStatus",
  async ({ orderId, status }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${API_URL}/orders/${orderId}/status`, { status }, { withCredentials: true });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to update order status");
    }
  }
);

// ❌ Cancel Order
export const cancelOrder = createAsyncThunk(
  "orders/cancelOrder",
  async (orderId, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${API_URL}/orders/${orderId}/cancel`, {}, { withCredentials: true });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to cancel order");
    }
  }
);

// 🏗 Order Slice
const orderSlice = createSlice({
  name: "orders",
  initialState: {
    orders: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearOrderState: (state) => {
      state.orders = [];
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(placeOrder.pending, (state) => {
        state.loading = true;
      })
      .addCase(placeOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.orders.push(action.payload.order);
      })
      .addCase(placeOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        const updatedOrder = action.payload.order;
        const index = state.orders.findIndex((order) => order._id === updatedOrder._id);
        if (index !== -1) state.orders[index] = updatedOrder;
      })
      .addCase(cancelOrder.fulfilled, (state, action) => {
        const updatedOrder = action.payload.order;
        const index = state.orders.findIndex((order) => order._id === updatedOrder._id);
        if (index !== -1) state.orders[index] = updatedOrder;
      });
  },
});

export const { clearOrderState } = orderSlice.actions;
export default orderSlice.reducer;
