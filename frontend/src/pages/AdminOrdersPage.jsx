import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';
import HeaderAdmin from '../layouts/headeradmin'; 
import Message from './message';

const AdminOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const [message, setMessage] = useState({message: "", type: ""})

  const showMessage = (msg, type) => {
    setMessage({ message: msg, type });
    setTimeout(() => {
      setMessage({ message: "", type: "" });
    }, 1000);
  };

  const handleBack = () => {
    navigate('/admin');
  };

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        showMessage("You must be logged in.", "loading");
        return;
      }

      showMessage("loading...", "loadig")
      const res = await api.get('/api/orders/admin', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(res.data);
    } catch (err) {
      console.error('Error fetching orders:', err);
      showMessage('Failed to fetch orders. Make sure you are an admin.');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      await api.put(
        `/api/orders/${orderId}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setOrders(prev =>
        prev.map(order =>
          order._id === orderId ? { ...order, status: newStatus } : order
        )
      );
    showMessage("Order status updated.", "success");
    } catch (err) {
      console.error('Error updating order status:', err);
      showMessage("Failed to update status. Make sure you are an admin.", "failed");
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  if (loading) return <div>
     <div div="bg-gray-200 min-h-scree">
       <div className="fixed w-full">
        <HeaderAdmin />
      </div>

     
     <div className="mx-4 pt-20">
  <button
    onClick={handleBack}
     className="px-3 py-1 bg-gray-400 m-1 text-white rounded hover:bg-gray-300 hover:text-black"
  >
    Back
  </button>

    <div className="overflow-x-auto justify-center item-center rounded-lg shadow-sm bg-white w-full max-w-6xl">
      <table className="min-w-full divide-y divide-gray-200 text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-3 text-left font-semibold text-gray-700">User</th>
            <th className="px-4 py-3 text-left font-semibold text-gray-700">Total</th>
            <th className="px-4 py-3 text-left font-semibold text-gray-700">Payment</th>
            <th className="px-4 py-3 text-left font-semibold text-gray-700">Address</th>
            <th className="px-4 py-3 text-left font-semibold text-gray-700">Phone</th>
            <th className="px-4 py-3 text-left font-semibold text-gray-700">Status</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-100">
          {[...Array(15)].map((_, index) => (
            <tr key={index} className="hover:bg-gray-50">
              <td className="px-4 py-2"><div className="h-4 w-24 bg-gray-200 rounded"></div></td>
              <td className="px-4 py-2"><div className="h-4 w-16 bg-gray-200 rounded"></div></td>
              <td className="px-4 py-2"><div className="h-4 w-20 bg-gray-200 rounded"></div></td>
              <td className="px-4 py-2"><div className="h-4 w-32 bg-gray-200 rounded"></div></td>
              <td className="px-4 py-2"><div className="h-4 w-20 bg-gray-200 rounded"></div></td>
              <td className="px-4 py-2">
                <div className="h-8 w-28 bg-gray-100 rounded"></div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    </div>
    </div>
    </div>
    ;

  return (
    <div div="bg-gray-200 min-h-scree">
        <div className="fixed w-full z-50">
        <HeaderAdmin />
      </div>

     
     <div className="mx-4 pt-20">
  <button
    onClick={handleBack}
     className="px-3 py-1 bg-gray-400 m-1 mt-2 text-white rounded hover:bg-gray-300 hover:text-black"
  >
    Back
  </button>

  {orders.length === 0 ? (
    <div className="flex justify-center item-center">
    <div className="overflow-x-auto rounded-lg shadow-sm bg-white w-full max-w-6xl">
      <table className="min-w-full divide-y divide-gray-200 text-sm animate-pulse">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-3 text-left font-semibold text-gray-700">User</th>
            <th className="px-4 py-3 text-left font-semibold text-gray-700">Total</th>
            <th className="px-4 py-3 text-left font-semibold text-gray-700">Payment</th>
            <th className="px-4 py-3 text-left font-semibold text-gray-700">Address</th>
            <th className="px-4 py-3 text-left font-semibold text-gray-700">Phone</th>
            <th className="px-4 py-3 text-left font-semibold text-gray-700">Status</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-100">
          {[...Array(12)].map((_, index) => (
            <tr key={index} className="hover:bg-gray-50">
              <td className="px-4 py-2"><div className="h-4 w-24 bg-gray-200 rounded"></div></td>
              <td className="px-4 py-2"><div className="h-4 w-16 bg-gray-200 rounded"></div></td>
              <td className="px-4 py-2"><div className="h-4 w-20 bg-gray-200 rounded"></div></td>
              <td className="px-4 py-2"><div className="h-4 w-32 bg-gray-200 rounded"></div></td>
              <td className="px-4 py-2"><div className="h-4 w-20 bg-gray-200 rounded"></div></td>
              <td className="px-4 py-2">
                <div className="h-8 w-28 bg-gray-200 rounded"></div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    </div>
  ) : (
    <div className="overflow-x-auto rounded-md">
      <table className="min-w-full divide-y divide-gray-200 text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-3 text-left font-semibold text-gray-700">User</th>
            <th className="px-4 py-3 text-left font-semibold text-gray-700">Total</th>
            <th className="px-4 py-3 text-left font-semibold text-gray-700">Payment</th>
            <th className="px-4 py-3 text-left font-semibold text-gray-700">Address</th>
            <th className="px-4 py-3 text-left font-semibold text-gray-700">Phone</th>
            <th className="px-4 py-3 text-left font-semibold text-gray-700">Status</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-100">
          {orders.map((order) => (
            <tr key={order._id} className="hover:bg-gray-50">
              <td className="px-4 py-2">{order.userId?.email || 'N/A'}</td>
              <td className="px-4 py-2">₱{order.totalAmount.toFixed(2)}</td>
              <td className="px-4 py-2">{order.paymentMethod}</td>
              <td className="px-4 py-2">{order.address}</td>
              <td className="px-4 py-2">{order.phone}</td>
              <td className="px-4 py-2">
                <select
                  value={order.status}
                  onChange={(e) => handleStatusChange(order._id, e.target.value)}
                  className="border rounded px-2 py-1 bg-gray-50 hover:bg-gray-100"
                >
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )}
</div>

  {/* message login successful or failed */}
<div className="flex justify-center item-center"> 
    {message.message && <Message message={message.message} type={message.type} />}
</div>

    </div>
  );
};

export default AdminOrdersPage;
