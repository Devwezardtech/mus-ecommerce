
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

      <div className="pt-20 max-w-6xl mx-auto">

        {loading ? (
          <p className="text-gray-500">Loading orders...</p>
        ) : orders.length === 0 ? (
          <p className="text-gray-600">No orders for your products yet.</p>
        ) : (
          <div className=" px-4 overflow-x-auto rounded-md border">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-100 ">
                <tr>
                  <th>Photo</th>
                  <th>Product</th>
                  <th>Buyer</th>
                  <th>Address</th>
                  <th>Phone</th>
                  <th>Payment</th>
                  <th>Qty</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Action</th>
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
                              className="w-12 h-10 object-cover rounded"
                            />
                          ) : (
                            <div className="w-16 h-16 bg-gray-300 rounded"></div>
                          )}
                        </td>
                        <td className='px-2'>{item.productId?.name}</td>
                        <td className='px-2'>{order.userId?.email}</td>
                        <td className='px-2'>{order.address}</td>
                        <td className='px-2'>{order.phone}</td>
                        <td className='px-2'>{order.paymentMethod}</td>
                        <td className='px-2'>{item.quantity}</td>
                        <td className='px-2'>₱{(item.price * item.quantity).toFixed(2)}</td>
                        <td className='px-2'>{order.status}</td>
                        <td className="space-x-2">
                          <button
                            onClick={() => handleAction('print', order._id, item._id)}
                            className="text-green-600 hover:underline className='px-2'"
                          >
                            Print
                          </button>
                          <button
                            onClick={() => handleAction('pdf', order._id, item._id)}
                            className="text-blue-600 hover:underline className='px-2'"
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
