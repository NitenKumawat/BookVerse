import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCart, updateQuantity, removeFromCart, clearCart } from "../redux/cartSlice";
import { Link, useNavigate } from "react-router-dom";
import Checkout from "../components/Checkout"; // ✅ Import Checkout Component

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, loading, error } = useSelector((state) => state.cart);
  const user = useSelector((state) => state.auth.user);

  const [showCheckout, setShowCheckout] = useState(false); // ✅ Track checkout visibility

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  const cartItems = useMemo(() => Object.values(items), [items]);

  const totalPrice = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  const totalDiscount = cartItems.reduce(
    (discount, item) => discount + (item.price * (item.discount / 100)) * item.quantity,
    0
  );
  const finalAmount = totalPrice - totalDiscount;

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      alert("Your cart is empty! Please add items before checkout.");
      return;
    }

    if (!user || !user._id) {
      alert("You need to log in to place an order.");
      navigate("/login");
      return;
    }

    // ✅ Show checkout component instead of cart
    setShowCheckout(true);
  };

  // ✅ Show Checkout Component when `showCheckout` is true
  if (showCheckout) {
    return (
      <Checkout
        cartItems={cartItems}
        totalPrice={totalPrice}
        totalDiscount={totalDiscount}
        finalAmount={finalAmount}
        setShowCheckout={setShowCheckout} // ✅ Allow returning to cart
      />
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gradient-to-r from-purple-50 to-indigo-50 shadow-xl rounded-lg mt-6">
      <h2 className="text-4xl font-bold mb-6 text-black text-center">🛍️ Your Shopping Cart</h2>

      {loading && <p className="text-center text-yellow-300 animate-pulse">Loading...</p>}
      {error && <p className="text-red-500 text-center">{error}</p>}
      {!loading && cartItems.length === 0 && (
        <p className="text-center text-white text-lg">Your cart is empty. 😞</p>
      )}

      {/* Cart Items */}
      {cartItems.map((book) => (
        <div key={book._id} className="flex items-center justify-between bg-white rounded-lg shadow-md p-4 mb-4 transition hover:scale-105">
          <div className="flex items-center">
            <img
              src={book.imageUrl}
              alt={book.name}
              className="w-20 h-20 object-cover rounded-lg shadow-lg border-2 border-indigo-400"
            />
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-800">{book.name}</h3>
              <p className="text-gray-600">
                Price: <span className="font-semibold text-blue-600">₹{book.price}</span>
              </p>
              <p className="text-gray-600">
                Discount: <span className="font-semibold text-green-600">{book.discount}%</span>
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => dispatch(updateQuantity({ id: book._id, quantity: book.quantity - 1 }))}
              disabled={book.quantity <= 1}
              className="px-3 py-1 bg-red-500 text-white rounded-lg shadow-md hover:bg-red-600 transition disabled:bg-gray-300"
            >
              -
            </button>
            <span className="px-4 py-1 bg-indigo-100 text-lg font-semibold text-gray-800 rounded-lg shadow-md">
              {book.quantity}
            </span>
            <button
              onClick={() => dispatch(updateQuantity({ id: book._id, quantity: book.quantity + 1 }))}
              className="px-3 py-1 bg-green-500 text-white rounded-lg shadow-md hover:bg-green-600 transition"
            >
              +
            </button>
            <button
              onClick={() => dispatch(removeFromCart(book._id))}
              className="ml-4 px-3 py-1 text-red-600 hover:text-red-800 transition"
            >
              🗑️ Remove
            </button>
          </div>
        </div>
      ))}

      {/* Order Summary */}
      <div className="mt-6 p-6 bg-indigo-100 rounded-lg shadow-md border-2 border-indigo-500">
        <h3 className="text-xl font-semibold text-indigo-700 mb-3">📦 Order Summary</h3>
        <p className="text-gray-700 flex justify-between">
          Total Price: <span className="font-semibold text-blue-600">₹{totalPrice.toFixed(2)}</span>
        </p>
        <p className="text-gray-700 flex justify-between">
          Discount: <span className="font-semibold text-green-600">-₹{totalDiscount.toFixed(2)}</span>
        </p>
        <p className="text-lg font-bold text-gray-800 flex justify-between border-t pt-2">
          Final Amount: <span className="text-purple-700">₹{finalAmount.toFixed(2)}</span>
        </p>
      </div>

      {/* Checkout Button */}
      <button
        className="mt-6 px-6 py-3 bg-green-500 text-white text-lg font-semibold rounded-lg w-full shadow-lg hover:scale-105 transition"
        onClick={handleCheckout}
      >
        🚀 Checkout
      </button>

      <button
        className="mt-3 px-6 py-3 bg-red-500 text-white text-lg font-semibold rounded-lg w-full shadow-lg hover:scale-105 transition"
        onClick={() => dispatch(clearCart())}
      >
        🗑️ Clear Cart
      </button>

      <Link
        to="/"
        className="block mt-6 text-center text-white text-lg font-semibold bg-indigo-600 py-3 rounded-lg shadow-md hover:bg-indigo-700 transition"
      >
        🔄 Continue Shopping
      </Link>
    </div>
  );
};

export default Cart;
