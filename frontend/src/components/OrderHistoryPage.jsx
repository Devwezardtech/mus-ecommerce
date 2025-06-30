import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import HeaderUser from '../layouts/headeruser';

const OrderHistoryPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/user');
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:5000/api/orders/my', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(res.data);
      console.log('Fetched orders:', res.data);
    } catch (err) {
      console.error('Failed to fetch orders:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="fixed w-full z-50" >
        <HeaderUser/>
      </div>
   
    <div className="min-h-screen bg-gray-100 px-6 py-10 pt-20">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h6 className="text-md font-semibold text-gray-900">Your Orders</h6>
          <button
            onClick={handleBack}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded shadow"
          >
            Back
          </button>
        </div>

        {loading ? (
          <p className="text-gray-600">Loading your orders...</p>
        ) : orders.length === 0 ? (
          <p className="text-gray-500">No orders yet.</p>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div
                key={order._id}
                className="bg-white rounded-lg shadow-md p-6 border border-gray-200"
              >
                <div className="mb-4">
                  <p><span className="font-medium text-gray-700">Order ID:</span> {order._id}</p>
                  <p><span className="font-medium text-gray-700">Status:</span> {order.status}</p>
                  <p><span className="font-medium text-gray-700">Total:</span> ₱{order.totalAmount}</p>
                  <p><span className="font-medium text-gray-700">Payment Method:</span> {order.paymentMethod}</p>
                  <p><span className="font-medium text-gray-700">Shipping Address:</span> {order.address}</p>
                  <p><span className="font-medium text-gray-700">Phone:</span> {order.phone}</p>
                </div>

                <div>
                  <h4 className="text-lg font-semibold text-gray-800 mb-2">Items:</h4>
                  <ul className="list-disc list-inside space-y-1 text-gray-700">
                    {(order.products || []).map((item, idx) => (
                      <li key={idx}>
                        {item.productId?.name || 'Unknown Product'} - {item.quantity} pcs - ₱{item.price}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
     </div>
  );
};

export default OrderHistoryPage;
