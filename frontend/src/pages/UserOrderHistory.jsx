import { useEffect, useState } from 'react';
import api from '../api/axios';
//import { useNavigate } from 'react-router-dom';
import HeaderUser from '../layouts/headeruser';
import Message from './message';

const UserOrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");
  //const navigate = useNavigate();
   const [message, setMessage] = useState({message: "", type: ""});

const showMessage = (msg, type) => {
    setMessage({ message: msg, type });
    setTimeout(() => {
      setMessage({ message: "", type: "" });
    }, 2000);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      showMessage("loading...", "loading")
      const res = await api.get("api/orders/user", {
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
      <div className=" pt-12 md:pt-8 lg:pt-10">

        <div className="flex flex-cols overflow-x-auto rounded-lg py-2  justify-center items-center sm:py-2 md:py-4 lg:py-8">
          <table className="min-w-full md:min-w-full lg:min-w-full divide-y divide-gray-200 text-sm px-2 sm:px-2 md:px-4 lg:px-8">
            <thead className='bg-blue-500 text-white'>
              <tr>
                <th className="px-1 py-1 font-semibold ">Status</th>
                <th className="px-1 py-1 font-semibold ">Payment</th>
                <th className="px-1 py-1 font-semibold ">Address</th>
                <th className="px-1 py-1 font-semibold">Product</th>
                <th className="px-1 py-1 font-semibold">Quantity</th>
                <th className="px-1 py-1 font-semibold">Price (₱)</th>
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
                    <tr key={`${order._id}-${index}`} className="hover:bg-gray-50 text-center">
                      
                      <td className="px-1 py-1">{order.status || "N/A"}</td>
                      <td className="px-1 py-1">{order.paymentMethod || "N/A"}</td>
                      <td className="px-1 py-1">{order.address || "N/A"}</td>
                      <td className="px-1 py-1">
  <div className="flex items-center justify-center gap-2">
    {p.productId?.photo ? (
      <img
        src={p.productId.photo}
        alt={p.productId?.name || "Product"}
        className="h-10 w-10 object-cover rounded"
      />
    ) : (
      <span>{p.productId?.name || "Unknown Product"}</span>
    )}
  </div>
</td>


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
