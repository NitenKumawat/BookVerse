import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL;

// ✅ Fetch Categories
export const fetchCategories = createAsyncThunk("books/fetchCategories", async () => {
  const response = await axios.get(`${API_URL}/products/categories`);
  return response.data;
});

// ✅ Fetch Books by Category (with Pagination)
export const fetchBooksByCategory = createAsyncThunk(
  "books/fetchByCategory",
  async ({ category, page = 1 }) => {
    const response = await axios.get(`${API_URL}/products?category=${category}&page=${page}`);
    return response.data;
  }
);

const bookSlice = createSlice({
  name: "books",
  initialState: {
    books: [],
    categories: [],
    loading: false,
    error: null,
    searchQuery: "", // 🔥 Added search query state
  },
  reducers: {
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload; // 🔥 Update search query
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categories = action.payload;
      })
      .addCase(fetchBooksByCategory.fulfilled, (state, action) => {
        state.books = action.payload.products;
      });
  },
});

export const { setSearchQuery } = bookSlice.actions;
export default bookSlice.reducer;
