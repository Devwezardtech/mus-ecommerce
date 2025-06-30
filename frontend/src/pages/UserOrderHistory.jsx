import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import HeaderUser from '../layouts/headeruser';
import Message from './message';

const UserOrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
   const [message, setMessage] = useState({message: "", type: ""});

const showMessage = (msg, type) => {
    setMessage({ message: msg, type });
    setTimeout(() => {
      setMessage({ message: "", type: "" });
    }, 2000);
  };


  const handleBack = () => {
    navigate('/user');
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      showMessage("loading...", "loading")
      const res = await axios.get("http://localhost:5000/api/orders/user", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(res.data);
    } catch (err) {
      console.error("Fetch orders error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="fixed w-full">
         <HeaderUser />
      </div>
      <div className="mx-4 my-1 pt-8 md:pt-10 lg:pt-12">
        <button
          onClick={handleBack}
          className="mt-10 px-3 py-1 bg-gray-300 m-1 text-black rounded hover:bg-gray-200 hover:text-black lg:mx-16"
        >
          Back
        </button>

        <div className="overflow-x-auto rounded-lg py-1 sm:py-2 md:py-4 lg:py-8 px-1 sm:px-4 md:px-8 lg:px-16">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Status</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Payment</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Address</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Product</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Quantity</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Price (₱)</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {loading ? (
                
                [...Array(20)].map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    {[...Array(6)].map((__, j) => (
                      <td key={j} className="px-4 py-2">
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      </td>
                    ))}
                  </tr>
                ))
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-4  text-gray-500">
                   
                  <div className='min-h-[600px]'>

                 
                   No orders found.
                 
                   </div>
                    </td>
                </tr>
              ) : (
                orders.map((order) =>
                  (order.products || []).map((p, index) => (
                    <tr key={`${order._id}-${index}`} className="hover:bg-gray-50">
                      <td className="px-4 py-2">{order.status || "N/A"}</td>
                      <td className="px-4 py-2">{order.paymentMethod || "N/A"}</td>
                      <td className="px-4 py-2">{order.address || "N/A"}</td>
                      <td className="px-4 py-2">{p.productId?.name || "Unknown Product"}</td>
                      <td className="px-4 py-2">{p.quantity}</td>
                      <td className="px-4 py-2">₱{p.price.toFixed(2)}</td>
                    </tr>
                  ))
                )
              )}
            </tbody>
          </table>
        </div>
      </div>
      <div className="flex justify-center item-center"> 
    {message.message && <Message message={message.message} type={message.type} />}
</div>
    </div>
  );
};

export default UserOrderHistory;
