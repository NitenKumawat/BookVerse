import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

import authReducer from "./authSlice";
import cartReducer from "./cartSlice";
import bookReducer from "./bookSlice";
import orderReducer from "./orderSlice"; // ✅ Import Order Reducer

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth", "cart"], // ✅ Persist auth & cart, but NOT orders or books
  blacklist: ["orders", "books"], // ✅ Explicitly prevent persistence for these
};

const rootReducer = combineReducers({
  auth: authReducer,
  cart: cartReducer,
  books: bookReducer,
  orders: orderReducer, // ✅ Add orders reducer
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // ✅ Fix for Redux Persist
    }),
});

export const persistor = persistStore(store);
