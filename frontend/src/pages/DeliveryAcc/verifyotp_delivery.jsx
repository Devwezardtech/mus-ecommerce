import { useState, useEffect } from "react";
import api from "../api/axios";

const VerifyOtpDelivery = ({ email, onClose, onSuccess, showMessage }) => {
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState(30);

  // Cooldown countdown effect
  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown((prev) => prev - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldown]);

  // Verify OTP API
  const handleVerify = async () => {
    setLoading(true);
    setMessage("");

    try {
     await api.post("/api/auth/verify-otp", { email, otp });

      showMessage?.("Email verified! Please login.", "success");
      setMessage("Verified successfully.");
      setTimeout(() => onSuccess(), 1000);
    } catch (err) {
      const errorMsg = err.response?.data?.error || "OTP verification failed";
      showMessage?.(errorMsg, "failed");
      setMessage(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP API
  const handleResend = async () => {
    try {
      setMessage("Resending OTP...");
     await api.post("/api/auth/resend-otp", { email });

      showMessage?.("OTP resent successfully!", "success");
      setMessage("OTP resent successfully!");
      setCooldown(30);
    } catch (err) {
      const errorMsg = err.response?.data?.error || "Failed to resend OTP";
      showMessage?.(errorMsg, "failed");
      setMessage(errorMsg);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded w-80 border shadow-md relative">
        <div className="flex justify-end">
          <button onClick={onClose} className="bg-gray-200 px-2 rounded hover:bg-gray-300">
            X
          </button>
        </div>
        <h2 className="text-xl font-bold mb-4 text-center">Verify Your Email</h2>
        <p className="mb-2 text-sm text-center">
          We sent a 6-digit OTP to: <b>{email}</b>
        </p>

        <input
          type="text"
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          className="w-full px-4 py-2 border rounded mb-3"
        />

        {message && <p className="text-sm text-center text-red-500">{message}</p>}

        <div className="flex justify-center">
          <button
            onClick={handleVerify}
            className={`w-24 py-1 mt-2 rounded text-white ${loading ? "bg-gray-300" : "bg-gray-500 hover:bg-gray-400"}`}
            disabled={loading}
          >
            {loading ? "Verifying..." : "Verify"}
          </button>
        </div>

        <div className="mt-3 text-center">
          <button
            onClick={handleResend}
            disabled={cooldown > 0}
            className={`text-sm ${cooldown > 0 ? "text-gray-400" : "text-blue-500 hover:underline"}`}
          >
            {cooldown > 0 ? `Resend in ${cooldown}s` : "Resend OTP"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default VerifyOtpDelivery;
