import React, { useState } from 'react';
import api from '../api/axios';
import { useLocation, useNavigate } from 'react-router-dom';
import Message from './message';
import HeaderUser from '../layouts/headeruser';



const CheckoutPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { products, total } = location.state || {};

  const [form, setForm] = useState({
    name: '',
    phone: '',
    address: '',
    paymentMethod: 'cod',
  });

  const [showModal, setShowModal] = useState(false);
  const [message, setMessage] = useState({ message: "", type: "" });

  const showMessage = (msg, type) => {
    setMessage({ message: msg, type });
    setTimeout(() => setMessage({ message: "", type: "" }), 2000);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCancel = () => {
    showMessage("Canceled Order");
    setTimeout(() => {
      navigate('/user');
    }, 1000);
  };

  const placeOrder = async () => {
    const token = localStorage.getItem("token");
    const referralBy = localStorage.getItem("referralBy");

    const method = form.paymentMethod.toLowerCase();

    if (method === 'cod') {
      try {
         await api.post(
          '/api/orders',
          {
            products,
            totalAmount: total,
            customerInfo: form,
            paymentMethod: method,
            referralBy,
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        showMessage("Order placed!", "success");
        setTimeout(() => navigate('/chat/:orderId/:itemId'), 1000);
      } catch(err){
        showMessage("Please complete details", "failed", err);
      }
    }

     else if (method === 'card') {
      try {
        const res = await api.post(
          "/api/stripe/create-checkout-session",
          { products, totalAmount: total },
          { headers: { Authorization: `Bearer ${token}` } }
        );
       
           // Redirect to the Stripe-hosted checkout page
    window.location.href = res.data.url;
      } catch (err) {
         console.error("Stripe Checkout Error:", err?.response?.data || err.message || err);
        showMessage("Stripe Checkout Failed", "failed");
      }
    }

    else {
      // GCash, GrabPay, PayMaya
      try {
        const res = await api.post(
          '/api/payments/create-payment',
          {
            amount: total,
            name: form.name || 'Customer',
            paymentMethod: method,
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        window.location.href = res.data.url;
      } catch (err) {
        showMessage("₱2000 minimum required for online payment. Please use COD.", "failed", err);
      }
    }
  };

  return (
    <div>
      <div className="fixed w-full z-50">
        <HeaderUser />
      </div>

      <div className="max-w-2xl mx-auto p-6 ">
        <h2 className="text-2xl font-bold mb-6 text-center mt-16">Checkout</h2>

        <div className="space-y-4">
          <input
            name="name"
            placeholder="Full Name"
            className="w-full px-4 py-2 border rounded"
            onChange={handleChange}
          />
          <input
            name="address"
            placeholder="Blk, Lot, Subdivition/Village, Brgy, City, Province"
            className="w-full px-4 py-2 border rounded"
            onChange={handleChange}
          />
          <div className='flex gap-2'>
             <input
            name="phone"
            placeholder="+(956) XXXX-XXXX"
            className="w-full px-4 py-2 border rounded"
            onChange={handleChange}
          />
          <select
            name="paymentMethod"
            className="w-full px-3 py-3 border rounded bg-white text-gray-700 focus:ring-2 focus:ring-blue-500 appearance-none"
            onChange={handleChange}
          >
            <option value="cod">Cash on Delivery</option>
            <option value="card" disabled >Credit/Debit Card (Stripe)</option>
            <option value="gcash" disabled >GCash</option>
            <option value="grab_pay" disabled >Grab Pay</option>
            <option value="paymaya" disabled>PayMaya</option>
          </select>
          </div>
        </div>

        <h3 className="text-lg font-semibold mt-6 text-center">Total: ₱{total}</h3>

        <div className="flex justify-between mt-6 space-x-3">
          <button
            onClick={handleCancel}
            className="w-full py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Cancel
          </button>
          <button
            onClick={() => setShowModal(true)}
            className="w-full py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Buy Now
          </button>
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50 ">
            <div className="bg-white p-5 rounded-lg shadow-xl ">
              <h3 className="text-xl font-bold mb-4">Confirm Your Order</h3>
              <p className="mb-4">Are you sure you want to place this order?</p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-red-500 rounded hover:bg-red-600 text-white"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setShowModal(false);
                    placeOrder();
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Message */}
        <div className="flex justify-center item-center">
          {message.message && <Message message={message.message} type={message.type} />}
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;