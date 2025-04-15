import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { fetchUser } from "./redux/authSlice";
import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import Cart from "./pages/Cart";
import Orders from "./pages/Orders";
import ProtectedRoute from "./components/ProtectedRoute";
import NotFound from "./pages/NotFound";  // 🔹 Import the NotFound Page

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchUser()); // 🔹 Fetch user on app load
  }, [dispatch]);

  return (
    <>
      <Header />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected Routes */}
        <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
        <Route path="/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />

        {/* 🔹 404 Page Route (Catch All) */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};

export default App;
