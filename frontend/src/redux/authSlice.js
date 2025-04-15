import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://localhost:5000/api/auth";

// 🔹 Login Thunk
export const loginUser = createAsyncThunk("auth/login", async (userData, thunkAPI) => {
  try {
    const response = await axios.post(`${API_URL}/login`, userData, { withCredentials: true });
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data || "Login failed");
  }
});

// 🔹 Fetch User Thunk (Auto-Logout on Expired Session)
export const fetchUser = createAsyncThunk("auth/fetchUser", async (_, { dispatch, rejectWithValue }) => {
  try {
    const response = await axios.get(`${API_URL}/me`, { withCredentials: true });
    return response.data;
  } catch (error) {
    if (error.response?.status === 401) {
      dispatch(logoutUser()); // 🔹 Auto logout if session expired
    }
    return rejectWithValue(error.response?.data || "Session expired. Please log in again.");
  }
});

// 🔹 Logout Thunk
export const logoutUser = createAsyncThunk("auth/logout", async (_, thunkAPI) => {
  try {
    await axios.post(`${API_URL}/logout`, {}, { withCredentials: true });
    return null;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data || "Logout failed");
  }
});

// 🔹 Auth Slice
const initialState = { user: null, isAuthenticated: false, loading: false, error: null };

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {}, // No synchronous reducers
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Login failed";
        state.isAuthenticated = false;
      })
      .addCase(fetchUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.loading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.error = action.payload;
      })
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
        state.isAuthenticated = false;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default authSlice.reducer;
