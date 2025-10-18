import React, { useEffect, useState } from "react";
import api from "../../../api/axios";
import { useAuth } from "../../../contexts/AuthContect";
import Message from "../../message";

const CkeckedInDelevery = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [message, setMessage] = useState({ message: "", type: "" });
  const token = localStorage.getItem("token");

  const showMessage = (msg, type) => {
    setMessage({ message: msg, type });
    setTimeout(() => setMessage({ message: "", type: "" }), 2000);
  };

  const fetchOrders = async () => {
    try {
      const res = await api.get("/api/orders/delivery", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Fetch delivery orders error:", err);
      showMessage("Failed to load orders", "failed");
      setOrders([]);
    }
  };

  const handleCheckedIn = async (orderId) => {
    try {
      await api.put(
        `/api/orders/${orderId}/status`,
        { status: "picked up" },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      showMessage("Order marked as Picked Up", "success");
      fetchOrders();
    } catch (err) {
      console.error("Update status error:", err);
      showMessage("Failed to update status", "failed");
    }
  };

  useEffect(() => {
    if (user?.role === "delivery") {
      fetchOrders();
    }
  }, [user]);

  return (
    <div className="bg-white rounded-xl shadow p-6 mt-6">
      <h2 className="text-lg font-semibold mb-4">📦 Orders for Delivery</h2>

      {orders.length === 0 ? (
        <p className="text-gray-600">No orders assigned yet.</p>
      ) : (
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th>Product</th>
              <th>Buyer</th>
              <th>Address</th>
              <th>Phone</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {orders.map((order) =>
              order.products?.map((item) => (
                <tr key={`${order._id}-${item._id}`}>
                  <td className="flex items-center gap-2">
                    {item.productId?.photo && (
                      <img
                        src={item.productId.photo}
                        alt={item.productId?.name}
                        className="h-10 w-10 object-cover rounded"
                      />
                    )}
                    <span>{item.productId?.name || "N/A"}</span>
                  </td>
                  <td>{order.userId?.email || "N/A"}</td>
                  <td>{order.address}</td>
                  <td>{order.phone}</td>
                  <td>{order.status}</td>
                  <td>
                    {order.status === "picked up" && (
                      <button
                        onClick={() => handleCheckedIn(order._id)}
                        className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                      >
                        Checked In
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}

      {message.message && (
        <div className="flex justify-center mt-4">
          <Message message={message.message} type={message.type} />
        </div>
      )}
    </div>
  );
};

export default CkeckedInDelevery;
