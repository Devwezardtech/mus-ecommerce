import { useEffect, useState } from "react";
import api from "../../api/axios";
import { useAuth } from "../../contexts/AuthContect";
import HeaderAffiliate from "./HeaderAffiliate";
import Message from "../message";
import { useNavigate } from "react-router-dom";

const AffiliateOrders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [message, setMessage] = useState({ message: "", type: "" });

  const navigate = useNavigate();

  const showMessage = (msg, type) => {
    setMessage({ message: msg, type });
    setTimeout(() => setMessage({ message: "", type: "" }), 2000);
  };

  const fetchAffiliateOrders = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await api.get("/affiliate/orders", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(res.data);
    } catch (err) {
      console.error("Failed to fetch affiliate orders:", err);
      showMessage("Failed to load affiliate orders", "failed");
    }
  };

  useEffect(() => {
    if (user?.role === "affiliate") fetchAffiliateOrders();
  }, [user]);

  // Total commission (all)
  const calculateTotalCommission = () => {
    let total = 0;
    orders.forEach(order => {
      order.products.forEach(item => {
        const { price, commission } = item.productId;
        total += price * commission * item.quantity;
      });
    });
    return total.toFixed(2);
  };

  // Withdrawable commission (only for delivered)
  const calculateWithdrawableCommission = () => {
    let withdrawable = 0;
    orders.forEach(order => {
      if (order.status?.toLowerCase() === "delivered") {
        order.products.forEach(item => {
          const { price, commission } = item.productId;
          withdrawable += price * commission * item.quantity;
        });
      }
    });
    return withdrawable.toFixed(2);
  };

  const handleWithdraw = () => {
    const withdrawable = calculateWithdrawableCommission();
    if (parseFloat(withdrawable) === 0) {
      showMessage("No commission eligible for withdrawal", "failed");
    } else {
      // TODO: call backend API to request payout
      showMessage("Withdrawal request submitted!", "success");
      navigate("/affiliate/withdraw")

    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="fixed w-full z-50">
        <HeaderAffiliate />
      </div>

      <div className="pt-20 p-6 max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold mb-4">Your Referred Orders</h2>

        {orders.length === 0 ? (
          <p className="text-gray-600">No referred orders yet.</p>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order._id}
                className="bg-white p-4 rounded shadow-sm border"
              >
                <p className="text-sm text-gray-600">
                  Buyer: <strong>{order.userId?.email}</strong>
                </p>
                <p className="text-sm text-gray-600">
                  Payment: {order.paymentMethod} | Status:{" "}
                  <span
                    className={`font-semibold ${
                      order.status === "Delivered"
                        ? "text-green-600"
                        : "text-yellow-600"
                    }`}
                  >
                    {order.status}
                  </span>
                </p>
                <p className="text-sm text-gray-600 mb-2">
                  Date: {new Date(order.createdAt).toLocaleString()}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {order.products.map((item, idx) => {
                    const { name, photo, price, commission } = item.productId;
                    const earnings = (price * commission * item.quantity).toFixed(2);

                    return (
                      <div key={idx} className="flex gap-4 border rounded p-2">
                        <img
                          src={`${api.defaults.baseURL}/products/${item.productId._id}/photo`}
                          alt={name}
                          className="w-20 h-20 object-cover rounded"
                        />
                        <div>
                          <h4 className="font-semibold">{name}</h4>
                          <p>Qty: {item.quantity}</p>
                          <p>Price: ₱{price}</p>
                          <p className="text-green-600">
                            Commission Earned: ₱{earnings}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}

            {/* Summary and withdraw */}
            <div className="mt-4 bg-green-100 p-4 rounded shadow">
              <p className="text-sm text-gray-600 mb-1">
                💡 Only delivered orders are eligible for withdrawal.
              </p>
              <h3 className="text-lg font-bold text-green-800">
                Total Commission Earned: ₱{calculateTotalCommission()}
              </h3>
              <h4 className="text-md font-semibold text-blue-700 mt-1">
                Withdrawable: ₱{calculateWithdrawableCommission()}
              </h4>

              <button
                onClick={handleWithdraw}
                className="mt-3 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Withdraw Commission
              </button>
            </div>
          </div>
        )}

        {message.message && (
          <div className="mt-4">
            <Message message={message.message} type={message.type} />
          </div>
        )}
      </div>
    </div>
  );
};

export default AffiliateOrders;
