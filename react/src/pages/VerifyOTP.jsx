import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const VerifyOTP = () => {
  const { state } = useLocation();
  const email = state?.email || "";
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleVerify = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage("Email verified! Please login.");
        navigate("/login");
      } else {
        setMessage(data.error || "OTP verification failed");
      }
    } catch (err) {
      console.error(err);
      setMessage("OTP verification failed");
    }
  };

  const handleBack = () => {
    navigate("/signup")
  }

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
      <div className="p-6 bg-white shadow-lg rounded-lg border w-80">
        <div className="flex justify-end">
          <button onClick={handleBack}>X</button>
        </div>
        <h2 className="text-xl font-bold mb-4">Verify Your Email</h2>
        <p className="mb-2 text-sm">We sent a 6-digit OTP to: <b>{email}</b></p>
        <input
          type="text"
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          className="w-full px-4 py-2 border rounded-md mb-3"
        />
        {message && <p className="text-red-500 text-sm mb-2">{message}</p>}
        <div className="flex justify-center item-center">
           <button
          onClick={handleVerify}
          className="w-20 bg-gray-500 text-white py-1 rounded hover:bg-gray-400"
        >
          Verify
        </button>
        </div>
       
      </div>
    </div>
  );
};

export default VerifyOTP;
