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
        // Get the latest order based on createdAt
        const latest = res.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0];
        setOrder(latest);
      } else {
        setOrder(null);
      }

      console.log("All orders:", res.data);
    } catch (err) {
      console.error("Failed to fetch orders:", err);
      setOrder(null);
    } finally {
      setLoading(false);
    }
  };

  const goOrderHistory = () => navigate("/orders");

  return (
    <div className="flex flex-col h-screen">
      <div className="fixed w-full z-50">
        <HeaderUser />
      </div>

      <div className="flex-1 max-w-3xl mx-auto mt-20 p-4 flex flex-col">
        <div
          className="bg-white shadow rounded p-4 mb-4 cursor-pointer"
          onClick={goOrderHistory}
        >
          <h2 className="text-xl font-bold mb-2">Order Details</h2>

          {loading ? (
            <p>Loading order...</p>
          ) : order ? (
            <div className="bg-white shadow rounded p-4 mb-4">
              <div className="mb-2">
                <strong>Products:</strong>
                {order.products?.length > 0 ? (
                  <ul className="list-disc list-inside">
                    {order.products.map((item, i) => (
                      <li key={i}>
                        {item.productId?.name || "Unknown Product"} - ₱{item.price} x {item.quantity}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No products in this order.</p>
                )}
              </div>

              <div><strong>Total:</strong> ₱{order.totalAmount}</div>
              <div className="mt-2"><strong>Shipping Address:</strong> {order.address}</div>
              <div><strong>Phone:</strong> {order.phone}</div>
              <div className="mt-2"><strong>Payment Method:</strong> {order.paymentMethod}</div>
              <div><strong>Status:</strong> {order.status || "pending"}</div>
            </div>
          ) : (
            <p>No recent order found.</p>
          )}
        </div>

        <div className="flex-1 overflow-y-auto p-2 bg-gray-100 rounded-lg mb-4">
          {/* Chat messages will go here */}
        </div>

        <div className="flex gap-2">
          <input type="text" placeholder="Type your message..." />
          <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
