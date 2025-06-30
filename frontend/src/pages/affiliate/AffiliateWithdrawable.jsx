// 📁 src/pages/affiliate/AffiliateWithdrawable.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../contexts/AuthContect";
import HeaderAffiliate from "./HeaderAffiliate";
import Message from "../message";

const AffiliateWithdrawable = () => {
  const { user } = useAuth();
  const [withdrawData, setWithdrawData] = useState(null);
  const [accountInfo, setAccountInfo] = useState({
    bankName: "",
    accountNumber: "",
    accountName: "",
  });
  const [message, setMessage] = useState({ message: "", type: "" });

  const showMessage = (msg, type) => {
    setMessage({ message: msg, type });
    setTimeout(() => setMessage({ message: "", type: "" }), 2000);
  };

  const fetchWithdrawable = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/affiliate/withdrawable", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setWithdrawData(res.data);
    } catch (err) {
      console.error("Fetch withdrawable error:", err);
      showMessage("Failed to load data", "failed");
    }
  };

  const handleWithdraw = async () => {
    if (!accountInfo.bankName || !accountInfo.accountNumber || !accountInfo.accountName) {
      return showMessage("Please complete your account information.", "failed");
    }

    try {
      const token = localStorage.getItem("token");
      const res = await axios.post("http://localhost:5000/api/affiliate/withdraw", accountInfo, {
        headers: { Authorization: `Bearer ${token}` },
      });

      showMessage(res.data.message, "success");
      fetchWithdrawable(); // refresh amount
    } catch (err) {
      showMessage(err.response?.data?.error || "Withdraw failed", "failed");
    }
  };

  const handleStripeConnect = async () => {
  const token = localStorage.getItem("token");
  try {
    const res = await axios.post("http://localhost:5000/api/stripe/connect", {}, {
      headers: { Authorization: `Bearer ${token}` }
    });
    window.location.href = res.data.url;
  } catch (err) {
    console.error("Connect Error:", err);
    showMessage("Failed to start Stripe onboarding", "failed");
  }
};



  useEffect(() => {
    if (user?.role === "affiliate") fetchWithdrawable();
  }, [user]);

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="fixed w-full z-50">
        <HeaderAffiliate />
      </div>

      <div className="pt-20 p-6 max-w-xl mx-auto">
        <h2 className="text-2xl font-bold mb-4">Withdraw Commission</h2>

        {withdrawData ? (
          <div className="bg-white shadow rounded p-4 space-y-4">
            <p className="text-gray-700">
              Eligible Amount: <strong className="text-green-700">₱{withdrawData.amount}</strong>
            </p>

            <div className="space-y-2">
              <input
                type="text"
                placeholder="Bank / E-wallet (e.g., GCash, Instapay)"
                className="w-full px-3 py-2 border rounded"
                value={accountInfo.bankName}
                onChange={(e) => setAccountInfo({ ...accountInfo, bankName: e.target.value })}
              />
              <input
                type="text"
                placeholder="Account Number"
                className="w-full px-3 py-2 border rounded"
                value={accountInfo.accountNumber}
                onChange={(e) => setAccountInfo({ ...accountInfo, accountNumber: e.target.value })}
              />
              <input
                type="text"
                placeholder="Account Holder Name"
                className="w-full px-3 py-2 border rounded"
                value={accountInfo.accountName}
                onChange={(e) => setAccountInfo({ ...accountInfo, accountName: e.target.value })}
              />
            </div>
            
            <div className="flex flex-col justify-center item-center px-28">

               <button
              onClick={handleWithdraw}
              disabled={parseFloat(withdrawData.amount) === 0}
              className="w-full mt-3 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
            >
              Submit Withdrawal
            </button>

           <button onClick={handleStripeConnect} className="mt-4 bg-purple-600 text-white px-4 py-2 rounded">
  Connect Stripe Account
</button>

            </div>

           

          </div>
        ) : (
          <p className="text-gray-600">Loading...</p>
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

export default AffiliateWithdrawable;
