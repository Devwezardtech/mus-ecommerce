// ✅ Refactored SellerOrders.jsx

import React, { useEffect, useState } from 'react';
import api from "../../api/axios";
import { useAuth } from '../../contexts/AuthContect';
import HeaderSeller from './HeaderSeller';
import Message from '../message';
import { useNavigate } from 'react-router-dom';

const SellerOrders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ message: '', type: '' });
  const navigate = useNavigate();

  const showMessage = (msg, type) => {
    setMessage({ message: msg, type });
    setTimeout(() => setMessage({ message: '', type: '' }), 2000);
  };

  const fetchSellerOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return showMessage('Unauthorized access', 'failed');

      setLoading(true);
      const res = await api.get('/api/orders/seller', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(res.data);
    } catch (err) {
      console.error('Error fetching seller orders:', err);
      showMessage('Failed to fetch seller orders', 'failed');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.role === 'seller') {
      fetchSellerOrders();
    }
  }, [user]);

  const handleAction = (actionType, orderId, productId) => {
    navigate(`/seller/order/${orderId}/${productId}/${actionType}`);
  };

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
                  <th>Photo</th><th>Product</th><th>Buyer</th><th>Address</th><th>Phone</th>
                  <th>Payment</th><th>Qty</th><th>Total</th><th>Status</th><th>Action</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {orders.map((order) =>
                  order.products
                    ?.filter((item) => item.productId?.createdBy === user.id)
                    .map((item) => (
                      <tr key={`${order._id}-${item._id}`} className="hover:bg-gray-50">
                        <td>
                          {item.productId?.photo ? (
                            <img
                              src={item.productId.photo}
                              alt={item.productId.name}
                              className="w-16 h-16 object-cover rounded"
                            />
                          ) : (
                            <div className="w-16 h-16 bg-gray-300 rounded"></div>
                          )}
                        </td>
                        <td>{item.productId?.name}</td>
                        <td>{order.userId?.email}</td>
                        <td>{order.address}</td>
                        <td>{order.phone}</td>
                        <td>{order.paymentMethod}</td>
                        <td>{item.quantity}</td>
                        <td>₱{(item.price * item.quantity).toFixed(2)}</td>
                        <td>{order.status}</td>
                        <td className="space-x-2">
                          <button
                            onClick={() => handleAction('print', order._id, item._id)}
                            className="text-green-600 hover:underline"
                          >
                            Print
                          </button>
                          <button
                            onClick={() => handleAction('pdf', order._id, item._id)}
                            className="text-blue-600 hover:underline"
                          >
                            PDF
                          </button>
                        </td>
                      </tr>
                    ))
                )}
              </tbody>
            </table>
          </div>
        )}

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
