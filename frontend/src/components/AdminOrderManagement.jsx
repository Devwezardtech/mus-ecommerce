import { useEffect, useState } from 'react';
import api from '../api/axios';

const AdminOrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await api.get("/orders/admin", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(res.data);
    } catch (err) {
      console.error("Admin fetch error:", err);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/orders/${id}/status`, { status }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchOrders(); // refresh
    } catch (err) {
      console.error("Update status error:", err);
    }
  };

  return (
    <div>
      <h2>Admin: All Orders</h2>
      {orders.map((order) => (
        <div key={order._id} style={{ border: '1px solid gray', padding: 10, marginBottom: 15 }}>
          <p><strong>User Email:</strong> {order.userId.email}</p>
          <p><strong>Status:</strong> {order.status}</p>
          <select onChange={(e) => updateStatus(order._id, e.target.value)} value={order.status}>
            <option value="pending">Pending</option>
            <option value="shipping">Shipping</option>
            <option value="delivered">Delivered</option>
          </select>
          <ul>
            {order.products.map((p, i) => (
              <li key={i}>
                Product: {p.productId} | Qty: {p.quantity} | ₱{p.price}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default AdminOrderManagement;