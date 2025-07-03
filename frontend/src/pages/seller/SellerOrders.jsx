import React, { useEffect, useState } from 'react';
import api from '../../api/axios';
import { useAuth } from '../../contexts/AuthContect';
import HeaderSeller from './HeaderSeller';
import Message from '../message';

const SellerOrders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ message: "", type: "" });

  const showMessage = (msg, type) => {
    setMessage({ message: msg, type });
    setTimeout(() => setMessage({ message: "", type: "" }), 2000);
  };

  const fetchSellerOrders = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return showMessage("Unauthorized access", "failed");

      setLoading(true);
      const res = await api.get("/orders/seller", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(res.data);
    } catch (err) {
      console.error("Error fetching seller orders:", err);
      showMessage("Failed to fetch seller orders", "failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.role === "seller") {
      fetchSellerOrders();
    }
  }, [user]);

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="fixed w-full z-50">
        <HeaderSeller />
      </div>

      <div className="pt-20 p-4 max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold mb-4">Your Product Orders</h2>

        {loading ? (
          <p className="text-gray-500">Loading orders...</p>
        ) : orders.length === 0 ? (
          <p className="text-gray-600">No orders for your products yet.</p>
        ) : (
          <div className="overflow-x-auto rounded-md border">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
             <thead className="bg-gray-100">
  <tr>
    <th className="px-4 py-2 text-left font-semibold text-gray-700">Photo</th>
    <th className="px-4 py-2 text-left font-semibold text-gray-700">Product</th>
    <th className="px-4 py-2 text-left font-semibold text-gray-700">Buyer</th>
    <th className="px-4 py-2 text-left font-semibold text-gray-700">Address</th>
    <th className="px-4 py-2 text-left font-semibold text-gray-700">Phone</th>
    <th className="px-4 py-2 text-left font-semibold text-gray-700">Payment</th>
    <th className="px-4 py-2 text-left font-semibold text-gray-700">Qty</th>
    <th className="px-4 py-2 text-left font-semibold text-gray-700">Total</th>
    <th className="px-4 py-2 text-left font-semibold text-gray-700">Status</th>
  </tr>
</thead>
<tbody className="bg-white divide-y divide-gray-100">
  {orders.map((order) =>
    order.products
      ?.filter((item) => item.productId?.createdBy === user.id)
      .map((item) => (
        <tr key={`${order._id}-${item._id}`} className="hover:bg-gray-50">
          <td className="px-4 py-2">
            {item.productId?.photo ? (
              <img
                src={`${api.defaults.baseURL.replace("/api", "")}/uploads/${item.productId.photo}`}
                alt="product"
                className="w-16 h-16 object-cover rounded shadow"
              />
            ) : (
              <div className="w-16 h-16 bg-gray-300 rounded"></div>
            )}
          </td>
          <td className="px-4 py-2">{item.productId?.name || "N/A"}</td>
          <td className="px-4 py-2">{order.userId?.email || "Unknown"}</td>
          <td className="px-4 py-2">{order.address || "No address"}</td>
          <td className="px-4 py-2">{order.phone || "No phone"}</td>
          <td className="px-4 py-2">{order.paymentMethod || "N/A"}</td>
          <td className="px-4 py-2">{item.quantity}</td>
          <td className="px-4 py-2">₱{(item.price * item.quantity).toFixed(2)}</td>
          <td className="px-4 py-2">{order.status}</td>
        </tr>
      ))
  )}
</tbody>
            </table>
          </div>
        )}

        {/* Toast / Notification */}
        {message.message && (
          <div className="flex justify-center mt-4">
            <Message message={message.message} type={message.type} />
          </div>
        )}
      </div>
    </div>
  );
};

export default SellerOrders;
