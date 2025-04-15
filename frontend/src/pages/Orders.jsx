import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchOrders, cancelOrder } from "../redux/orderSlice";

const Orders = () => {
  const dispatch = useDispatch();
  const { orders, loading, error } = useSelector((state) => state.orders);

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  const handleCancelOrder = (orderId) => {
    if (window.confirm("Are you sure you want to cancel this order?")) {
      dispatch(cancelOrder(orderId));
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-3xl font-extrabold text-gray-800 mb-6 text-center">📦 Your Orders</h2>

      {loading && <p className="text-center text-blue-500 animate-pulse">Loading orders...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}

      {orders.length === 0 ? (
        <p className="text-center text-gray-600 text-lg">No orders found. 😞</p>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order._id}
              className="border rounded-lg shadow-lg p-6 bg-white transition-all transform hover:scale-105 hover:shadow-xl duration-300"
            >
              {/* Order ID & Date */}
              <div className="flex justify-between items-center border-b pb-3 mb-4">
                <p className="text-lg font-semibold text-gray-700">
                  🆔 Order ID: <span className="text-gray-600">{order._id}</span>
                </p>
                <p className="text-sm text-gray-500">📅 {new Date(order.createdAt).toLocaleDateString()}</p>
              </div>

              {/* Status & Payment Status */}
              <div className="flex items-center space-x-3">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    order.status === "Pending"
                      ? "bg-yellow-200 text-yellow-800"
                      : order.status === "Shipped"
                      ? "bg-blue-200 text-blue-800"
                      : order.status === "Delivered"
                      ? "bg-green-200 text-green-800"
                      : order.status === "Cancelled"
                      ? "bg-red-200 text-red-800"
                      : "bg-gray-200 text-gray-800"
                  }`}
                >
                  {order.status}
                </span>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    order.paymentStatus === "Paid"
                      ? "bg-green-200 text-green-800"
                      : "bg-red-200 text-red-800"
                  }`}
                >
                  {order.paymentStatus}
                </span>
              </div>

              {/* Order Summary */}
              <div className="mt-4 grid grid-cols-2 gap-4 text-gray-700">
                <p>💰 <span className="font-semibold">Total:</span> ₹{order.totalAmount.toFixed(2)}</p>
                <p>🎯 <span className="font-semibold">Discount:</span> ₹{order.discountApplied.toFixed(2)}</p>
                <p>🏦 <span className="font-semibold">Payment:</span> {order.paymentMethod}</p>
              </div>

              {/* Address Section */}
              <div className="mt-4 bg-gray-100 p-4 rounded-md border">
                <h3 className="font-semibold text-gray-800">📍 Delivery Address</h3>
                <p className="text-gray-600">{order.address.street}, {order.address.city}</p>
                <p className="text-gray-600">{order.address.state}, {order.address.postalCode}, {order.address.country}</p>
              </div>

              {/* Order Items */}
              <h3 className="font-semibold text-gray-800 mt-4">🛒 Items Ordered:</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-2">
                {order.items.map((item) => (
                  <div key={item.productId} className="bg-gray-50 p-3 rounded-lg flex items-center space-x-3 border hover:shadow-md">
                    <img src={item.imageUrl} alt={item.name} className="w-16 h-16 rounded-lg shadow-sm border border-gray-300" />
                    <div>
                      <p className="font-semibold">{item.name}</p>
                      <p className="text-gray-600 text-sm">₹{item.price.toFixed(2)} x {item.quantity}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Cancel Button */}
              {order.status === "Pending" && (
                <button
                  onClick={() => handleCancelOrder(order._id)}
                  className="mt-4 px-5 py-2 bg-red-500 text-white text-sm font-semibold rounded-lg hover:bg-red-600 transition-all duration-300 shadow-md"
                >
                  ❌ Cancel Order
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
