{/*import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import HeaderUser from "../layouts/headeruser";

const Chat = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);
  const token = localStorage.getItem("token");

  // Fetch order details
  useEffect(() => {
    const fetchOrder = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/api/orders/${orderId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrder(res.data);

        // Load initial messages (replace with real messages if available)
        setMessages(res.data.messages || [
          { id: 1, sender: "seller", text: "Hi! We received your order. Can you confirm your address?" }
        ]);
      } catch (err) {
        console.error("Failed to fetch order:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId, token]);

  // Scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!newMessage.trim()) return;

    const msg = { id: Date.now(), sender: "user", text: newMessage };

    setMessages(prev => [...prev, msg]);
    setNewMessage("");

    try {
      await api.post(
        `/api/orders/${orderId}/messages`,
        { text: newMessage },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (err) {
      console.error("Failed to send message:", err);
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
            <>
              <div className="mb-2">
                <strong>Products:</strong>
                <ul className="list-disc list-inside">
                  {(order.products || []).map((item, i) => (
                    <li key={i}>
                      {item.productId?.name || "Unknown Product"} - ₱{item.price} x {item.quantity}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <strong>Total:</strong> ₱{order.totalAmount}
              </div>
              <div className="mt-2">
                <strong>Shipping Address:</strong> {order.address}
              </div>
              <div>
                <strong>Phone:</strong> {order.phone}
              </div>
              <div className="mt-2">
                <strong>Payment Method:</strong> {order.paymentMethod}
              </div>
              <div>
                <strong>Status:</strong> {order.status || "pending"}
              </div>
            </>
          ) : (
            <p>Order details not found.</p>
          )}
        </div>


        <div className="flex-1 overflow-y-auto p-2 bg-gray-100 rounded-lg mb-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`mb-2 flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`p-2 rounded-lg max-w-xs break-words ${
                  msg.sender === "user"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-300 text-gray-800"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Type your message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="flex-1 px-4 py-2 border rounded focus:outline-none"
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
          />
          <button
            onClick={handleSend}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};



export default Chat;

*/}