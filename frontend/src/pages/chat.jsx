import React, { useState, useEffect } from "react";
import api from "../api/axios";
import HeaderUser from "../layouts/headeruser";
import { useNavigate, useParams } from "react-router-dom";

const Chat = () => {
  const [order, setOrder] = useState(null);
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(""); // new error state
  const navigate = useNavigate();
  const { orderId, itemId } = useParams();

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        setError("");
        const token = localStorage.getItem("token");
        const res = await api.get(`/api/orders/user/${orderId}/${itemId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setOrder(res.data.order || null);
        setItem(res.data.item || null);
      } catch (err) {
        console.error("Failed to load order:", err);
        setOrder(null);
        setItem(null);

        if (err.response?.status === 404) {
          setError("Order or item not found.");
        } else {
          setError("Something went wrong. Please try again.");
        }
      } finally {
        setLoading(false);
      }
    };

    if (orderId && itemId) fetchOrder();
  }, [orderId, itemId]);

  const goOrderHistory = () => navigate("/orders");

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <div className="fixed w-full z-50">
        <HeaderUser />
      </div>

      <div className="flex-1 flex flex-col w-full max-w-full mx-auto mt-20 p-2">
        {/* Order Details */}
        <div
          className="bg-white shadow-sm rounded-sm p-3 mb-2 cursor-pointer hover:shadow-lg transition"
          onClick={goOrderHistory}
        >
          <h2 className="text-xl font-semibold mb-2">Order Details</h2>

          {loading ? (
            <p className="text-gray-500">Loading order...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : order && item ? (
            <div className="bg-gray-50 rounded-lg p-2 space-y-2 border border-gray-200">
              <div>
                <strong>Product:</strong>{" "}
                {item.productId?.name || "Unknown Product"} – ₱
                {(item.price || 0).toLocaleString()} × {item.quantity}
              </div>

              <div className="flex flex-col sm:flex-row sm:justify-between sm:gap-2">
                <div>
                  <strong>Total:</strong> ₱
                  {(item.price * item.quantity || 0).toLocaleString()}
                </div>
                <div>
                  <strong>Status:</strong>{" "}
                  <span className="px-2 py-1 rounded text-white font-medium text-sm bg-yellow-500">
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
            <p className="text-gray-500">No order/item data available.</p>
          )}
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col bg-white rounded-lg shadow-md overflow-hidden">
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {order && item ? (
              <div className="text-gray-400 text-center text-sm">
                Chat messages will appear here
              </div>
            ) : (
              <div className="text-gray-400 text-center text-sm">
                No chat available for this order/item.
              </div>
            )}
          </div>

          <div className="flex border-t border-gray-200 p-2 bg-gray-50">
            <input
              type="text"
              placeholder="Type your message..."
              className="flex-1 border rounded-lg px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
              disabled={!order || !item} // disable input if no data
            />
            <button
              className="ml-2 px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm"
              disabled={!order || !item} // disable button if no data
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
