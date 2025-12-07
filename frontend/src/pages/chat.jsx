import React, { useState, useEffect } from "react";
import api from "../api/axios";
import HeaderUser from "../layouts/headeruser";
import { useNavigate } from "react-router-dom";

const Chat = () => {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/orders/my", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data && res.data.length > 0) {
        const latest = res.data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        )[0];
        setOrder(latest);
      } else {
        setOrder(null);
      }
    } catch (err) {
      console.error("Failed to fetch orders:", err); 
      setOrder(null);
    } finally {
      setLoading(false);
    }
  };

  const goOrderHistory = () => navigate("/orders");

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <div className="fixed w-full z-50">
        <HeaderUser />
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col w-full max-w-full mx-auto mt-20 p-2">
        {/* Order Details */}
        <div
          className="bg-white shadow-sm rounded-sm p-3 mb-2 cursor-pointer hover:shadow-lg transition"
          onClick={goOrderHistory}
        >
          <h2 className="text-xl font-semibold mb-2">Latest Order</h2>

          {loading ? (
            <p className="text-gray-500">Loading order...</p>
          ) : order ? (
            <div className="bg-gray-50 rounded-lg p-2 space-y-2 border border-gray-200">
              <div>
                <strong>Products:</strong>
                {order.products?.length > 0 ? (
                  <ul className="list-disc list-inside mt-1">
                    {order.products.map((item, i) => (
                      <li key={i}>
                        {item.productId?.name || "Unknown Product"} - ₱
                        {item.price} x {item.quantity}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500 mt-1">No products in this order.</p>
                )}
              </div>

              <div className="flex flex-col sm:flex-row sm:justify-between sm:gap-2">
                <div>
                  <strong>Total:</strong> ₱{order.totalAmount}
                </div>
                <div>
                  <strong>Status:</strong>{" "}
                  <span
                    className={`px-2 py-1 rounded text-white font-medium text-sm ${
                      order.status === "pending"
                        ? "bg-yellow-500"
                        : order.status === "processing"
                        ? "bg-blue-500"
                        : order.status === "picked up"
                        ? "bg-indigo-500"
                        : order.status === "delivered"
                        ? "bg-green-500"
                        : "bg-red-500"
                    }`}
                  >
                    {order.status || "pending"}
                  </span>
                </div>
              </div>

              <div>
                <strong>Shipping Address:</strong> {order.address}
              </div>
              <div>
                <strong>Phone:</strong> {order.phone}
              </div>
              <div>
                <strong>Payment Method:</strong> {order.paymentMethod}
              </div>
            </div>
          ) : (
            <p className="text-gray-500">No recent order found.</p>
          )}
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col bg-white rounded-lg shadow-md overflow-hidden">
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            <div className="text-gray-400 text-center text-sm">
              Chat messages will appear here
            </div>
          </div>

          {/* Input */}
          <div className="flex border-t border-gray-200 p-2 bg-gray-50">
            <input
              type="text"
              placeholder="Type your message..."
              className="flex-1 border rounded-lg px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
            />
            <button className="ml-2 px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm">
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
