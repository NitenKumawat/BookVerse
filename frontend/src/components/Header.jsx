import { NavLink, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from "../redux/authSlice";
import { setSearchQuery } from "../redux/bookSlice";
import { useState, useCallback } from "react";
import { debounce } from "lodash"; // Import debounce for optimized search handling

const Header = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  // Debounced search input handler (Optimized)
  const debouncedSearch = useCallback(
    debounce((query) => {
      dispatch(setSearchQuery(query));
    }, 300),
    [dispatch]
  );

  const handleSearch = (e) => {
    debouncedSearch(e.target.value);
  };

  // Close menu on navigation
  const handleNavClick = () => {
    setMenuOpen(false);
  };

  return (
    <nav className="bg-gradient-to-r from-blue-800 to-blue-900 text-white shadow-md">
      <div className="container mx-auto flex flex-nowrap items-center justify-between p-4 lg:p-6">
        {/* Left Side: Logo & Search */}
        <div className="flex flex-nowrap items-center space-x-4 flex-1">
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-2xl lg:text-4xl font-bold">📚 BookVerse</span>
          </Link>
          {/* 🔎 Search Bar */}
          <div className="flex-grow mx-4">
            <input
              type="text"
              placeholder="Search books..."
              onChange={handleSearch}
              className="w-full px-3 py-2 lg:px-4 lg:py-3 rounded-md text-black bg-gray-200 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
          </div>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          <NavLink to="/" className="hover:underline text-lg lg:text-xl">🏠 Home</NavLink>
          <NavLink to="/cart" className="hover:underline text-lg lg:text-xl">🛒 Cart</NavLink>
          <NavLink to="/orders" className="hover:underline text-lg lg:text-xl">📜 Orders</NavLink>
          {user ? (
            <>
              <span className="hover:underline text-lg lg:text-xl">👤 {user.name}</span>
              <button onClick={handleLogout} className="hover:underline text-red-500 text-lg lg:text-xl">Logout</button>
            </>
          ) : (
            <>
              <NavLink to="/login" className="hover:underline text-lg lg:text-xl">Login</NavLink>
              <NavLink to="/signup" className="hover:underline text-lg lg:text-xl">Signup</NavLink>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden focus:outline-none"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span className="text-2xl">☰</span>
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-blue-900 p-4">
          <NavLink to="/" className="block text-lg py-2 hover:underline" onClick={handleNavClick}>
            🏠 Home
          </NavLink>
          <NavLink to="/cart" className="block text-lg py-2 hover:underline" onClick={handleNavClick}>
            🛒 Cart
          </NavLink>
          <NavLink to="/orders" className="block text-lg py-2 hover:underline" onClick={handleNavClick}>
            📜 Orders
          </NavLink>
          {user ? (
            <>
              <span className="block text-lg py-2 hover:underline">👤 {user.name}</span>
              <button onClick={handleLogout} className="block text-red-500 text-lg py-2 hover:underline">
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" className="block text-lg py-2 hover:underline" onClick={handleNavClick}>
                Login
              </NavLink>
              <NavLink to="/signup" className="block text-lg py-2 hover:underline" onClick={handleNavClick}>
                Signup
              </NavLink>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Header;
