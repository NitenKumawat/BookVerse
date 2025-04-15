import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL;



// Fetch cart from backend
export const fetchCart = createAsyncThunk("cart/fetchCart", async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get(`${API_URL}/cart`, { withCredentials: true });
    return response.data;
  } catch (error) {
    console.error("❌ Fetch Cart Error:", error.response?.data); // Debugging
    return rejectWithValue(error.response?.data?.error || "Failed to fetch cart");
  }
});

// Add item to cart
export const addToCart = createAsyncThunk("cart/addToCart", async (book, { rejectWithValue }) => {
  try {
    const response = await axios.post(
      `${API_URL}/cart/add`,
      { productId: book._id, quantity: 1 },
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    console.error("❌ Add to Cart Error:", error.response?.data); // Debugging
    return rejectWithValue(error.response?.data?.error || "Failed to add to cart");
  }
});

// Update quantity
export const updateQuantity = createAsyncThunk("cart/updateCart", async ({ id, quantity }, { rejectWithValue }) => {
  try {
    const response = await axios.put(`${API_URL}/cart/update/${id}`, { quantity }, { withCredentials: true });
    return response.data;
  } catch (error) {
    console.error("❌ Update Quantity Error:", error.response?.data); // Debugging
    return rejectWithValue(error.response?.data?.error || "Failed to update cart");
  }
});

// Remove item from cart
export const removeFromCart = createAsyncThunk("cart/removeFromCart", async (id, { rejectWithValue }) => {
  try {
    await axios.delete(`${API_URL}/cart/remove/${id}`, { withCredentials: true });
    return id;
  } catch (error) {
    console.error("❌ Remove From Cart Error:", error.response?.data); // Debugging
    return rejectWithValue(error.response?.data?.error || "Failed to remove from cart");
  }
});

// Clear entire cart
export const clearCart = createAsyncThunk("cart/clearCart", async (_, { rejectWithValue }) => {
  try {
    await axios.delete(`${API_URL}/cart/clear`, { withCredentials: true });
    return {};
  } catch (error) {
    console.error("❌ Clear Cart Error:", error.response?.data); // Debugging
    return rejectWithValue(error.response?.data?.error || "Failed to clear cart");
  }
});

const cartSlice = createSlice({
  name: "cart",
  initialState: { items: {}, loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Cart
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.items = action.payload.items.reduce((acc, item) => {
          acc[item.productId._id] = { ...item.productId, quantity: item.quantity };
          return acc;
        }, {});
        state.loading = false;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload; // Store error message
      })

      // Add to Cart
      .addCase(addToCart.fulfilled, (state, action) => {
        const book = action.payload.item;
        state.items[book.productId._id] = { ...book.productId, quantity: book.quantity };
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.error = action.payload;
      })

      // Update Quantity
      .addCase(updateQuantity.fulfilled, (state, action) => {
        console.log("✅ Updated quantity response:", action.payload); // Debugging
        const { productId, quantity } = action.payload.item || {}; // Ensure `item` exists

        if (!productId) {
          console.error("❌ Missing productId in updateQuantity");
          return;
        }

        if (state.items[productId._id]) {
          state.items[productId._id].quantity = quantity;
        }
      })
      .addCase(updateQuantity.rejected, (state, action) => {
        state.error = action.payload;
      })

      // Remove from Cart
      .addCase(removeFromCart.fulfilled, (state, action) => {
        delete state.items[action.payload];
      })
      .addCase(removeFromCart.rejected, (state, action) => {
        state.error = action.payload;
      })

      // Clear Cart
      .addCase(clearCart.fulfilled, (state) => {
        state.items = {};
      })
      .addCase(clearCart.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export default cartSlice.reducer;
