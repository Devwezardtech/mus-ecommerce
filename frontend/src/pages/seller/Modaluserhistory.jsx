/**
 * 
 * 
 * 
 * import { useEffect, useState } from 'react';
import api from '../../api/axios';

const ModalsOrderHistory = () => {
   const [orders, setOrders] = useState([]);
  const token = localStorage.getItem('token');
  //const navigate = useNavigate();


  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await api.get('/api/orders/my', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(res.data);
      console.log('Fetched orders:', res.data);
    } catch (err) {
      console.error('Failed to fetch orders:', err);
  };

//  const goto = () => {
 //   navigate("/user/orders")
 // }





   return(
      <div>
          <div className="space-y-6">
              <div
                key={orders._id}
                className="bg-white rounded-md shadow-md p-6 border border-gray-200 hover:bg-gray-50"
              >
                <div className="mb-4 text-start">
                  <p><span className="font-medium text-gray-700">Order ID:</span> {orders._id}</p>
                  <p><span className="font-medium text-gray-700">Status:</span> {orders.status}</p>
                  <p><span className="font-medium text-gray-700">Total:</span> ₱{orders.totalAmount}</p>
                  <p><span className="font-medium text-gray-700">Payment Method:</span> {orders.paymentMethod}</p>
                  <p><span className="font-medium text-gray-700">Shipping Address:</span> {orders.address}</p>
                  <p><span className="font-medium text-gray-700">Phone:</span> {orders.phone}</p>
                </div>

                <div className='text-start'>
                  <h4 className="text-lg font-semibold text-gray-800 mb-2">Items:</h4>
                  <ul className=" space-y-1 text-gray-700">
                    {(orders.products || []).map((item, idx) => (
                      <li key={idx}>
                        <p>Product: {item.productId?.name || 'Unknown Product'}</p>
                         <p>Quantity: {item.quantity}
                         </p> 
                         <p>Price: ₱{item.price} </p> 
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
          </div>
      </div>
   )
}
}

export default ModalsOrderHistory;


*/