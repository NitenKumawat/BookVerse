import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { placeOrder } from "../redux/orderSlice";
import { clearCart } from "../redux/cartSlice";
import { useNavigate } from "react-router-dom";

const Checkout = ({ cartItems, totalPrice, totalDiscount, finalAmount, setShowCheckout }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  
  const [step, setStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [orderPlaced, setOrderPlaced] = useState(false);

  const [address, setAddress] = useState({
    street: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
  });

  const handlePlaceOrder = () => {
    if (!user) {
      alert("Please log in first.");
      return;
    }

    if (!address.street || !address.city || !address.state || !address.postalCode || !address.country) {
      alert("⚠️ Please fill in all address fields.");
      return;
    }

    const orderData = {
      userId: user._id,
      items: cartItems.map((item) => ({
        productId: item._id,
        name: item.name,
        imageUrl: item.imageUrl,
        price: item.price,
        discount: item.discount,
        quantity: item.quantity,
      })),
      totalAmount: finalAmount,
      discountApplied: totalDiscount,
      paymentMethod,
      address,
    };

    dispatch(placeOrder(orderData))
      .unwrap()
      .then(() => {
        setOrderPlaced(true);
        dispatch(clearCart());
      })
      .catch((err) => alert("⚠️ Failed to place order: " + err));
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-gradient-to-r from-blue-50 to-purple-50 shadow-xl rounded-lg mt-6">
      {orderPlaced ? (
        <div className="text-center">
          <h2 className="text-3xl font-bold text-green-600">🎉 Order Placed Successfully!</h2>
          <p className="text-gray-600 mt-2">Thank you for shopping with us. Your order will be processed soon.</p>
          <button 
            className="mt-4 px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg shadow-md hover:from-purple-600 hover:to-blue-600 transition"
            onClick={() => navigate("/")}
          >
            🏠 Go to Home
          </button>
        </div>
      ) : (
        <>
          {/* Step Progress Indicator */}
          <div className="flex justify-between mb-6">
            {["1️⃣ Order Summary", "2️⃣ Shipping Details", "3️⃣ Payment"].map((label, index) => (
              <span 
                key={index}
                className={`px-4 py-2 rounded-full text-white font-semibold transition ${
                  step >= index + 1
                    ? "bg-gradient-to-r from-blue-500 to-purple-500 shadow-md"
                    : "bg-gray-300 text-gray-700"
                }`}
              >
                {label}
              </span>
            ))}
          </div>

          {/* Step 1: Order Summary */}
          {step === 1 && (
            <>
              <h2 className="text-2xl font-bold text-gray-800">📦 Order Summary</h2>
              <div className="border p-4 rounded-lg mt-3 bg-white shadow">
                {cartItems.map((item) => (
                  <div key={item._id} className="flex justify-between mb-2">
                    <span className="font-semibold text-gray-800">{item.name} x {item.quantity}</span>
                    <span className="text-gray-700">₹{(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
                <hr className="my-2 border-gray-300" />
                <p className="flex justify-between text-gray-700">
                  <span>Total Price:</span> <span className="font-semibold">₹{totalPrice.toFixed(2)}</span>
                </p>
                <p className="flex justify-between text-green-600 font-semibold">
                  <span>Discount:</span> <span>-₹{totalDiscount.toFixed(2)}</span>
                </p>
                <p className="flex justify-between text-lg font-bold text-blue-700">
                  <span>Final Amount:</span> <span>₹{finalAmount.toFixed(2)}</span>
                </p>
              </div>
              <div className="flex justify-between mt-4">
                <button 
                  className="px-6 py-2 bg-gray-400 text-white rounded-lg shadow-md hover:bg-gray-500 transition"
                  onClick={() => setShowCheckout(false)}
                >
                  ⬅️ Back to Cart
                </button>
                <button 
                  className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg shadow-md hover:from-purple-600 hover:to-blue-600 transition"
                  onClick={() => setStep(2)}
                >
                  Next ➡️
                </button>
              </div>
            </>
          )}

          {/* Step 2: Shipping Details */}
          {step === 2 && (
            <>
              <h2 className="text-2xl font-bold text-gray-800">🏡 Shipping Address</h2>
              <div className="border p-4 rounded-lg mt-3 bg-white shadow">
                {["Street", "City", "State", "Postal Code", "Country"].map((field, index) => (
                  <input
                    key={index}
                    type="text"
                    placeholder={field}
                    className="w-full p-2 border rounded my-2 focus:ring-2 focus:ring-blue-300"
                    value={address[field.toLowerCase().replace(" ", "")]}
                    onChange={(e) => setAddress({ ...address, [field.toLowerCase().replace(" ", "")]: e.target.value })}
                  />
                ))}
              </div>
              <div className="flex justify-between mt-4">
                <button 
                  className="px-4 py-2 bg-gray-400 text-white rounded-lg shadow-md hover:bg-gray-500 transition"
                  onClick={() => setStep(1)}
                >
                  ⬅️ Back
                </button>
                <button 
                  className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg shadow-md hover:from-purple-600 hover:to-blue-600 transition"
                  onClick={() => setStep(3)}
                >
                  Next ➡️
                </button>
              </div>
            </>
          )}

          {/* Step 3: Payment */}
          {step === 3 && (
            <>
              <h2 className="text-2xl font-bold text-gray-800">💳 Payment Method</h2>
              <div className="border p-4 rounded-lg mt-3 bg-white shadow">
                <select
                  className="w-full p-2 border rounded my-2 focus:ring-2 focus:ring-blue-300"
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                >
                  <option value="COD">Cash on Delivery</option>
                  <option value="Online">Online Payment</option>
                </select>
              </div>
              <div className="flex justify-between mt-4">
                <button className="px-4 py-2 bg-gray-400 text-white rounded-lg" onClick={() => setStep(2)}>⬅️ Back</button>
                <button className="px-6 py-2 bg-green-500 text-white rounded-lg shadow-md hover:bg-green-600 transition" onClick={handlePlaceOrder}>🛒 Place Order</button>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default Checkout;
