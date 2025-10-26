import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContect";
import { useNavigate } from "react-router-dom";
import Message from "./message";

const Login = ({ onClose, onSwitchToSignup, showMessage }) => {
  const [step, setStep] = useState(1); // Step 1: credentials, Step 2: OTP
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState({ message: "", type: "" });

  const { requestLoginOtp, verifyLoginOtp } = useAuth();
  const navigate = useNavigate();

  const [cooldown, setCooldown] = useState(30);

useEffect(() => {
  if (step === 2 && cooldown > 0) {
    const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
    return () => clearTimeout(timer);
  }
}, [step, cooldown]);


  // Step 1: Email + Password → Send OTP
  const handleRequestOtp = async (e) => {
    e.preventDefault();
    try {
      showMessage("Sending OTP...", "loading");
      await requestLoginOtp(email, password);
      showMessage("OTP sent to your email", "success");
      setStep(2);
    } catch (err) {
      showMessage(err.message || "Login failed", "failed");
    }
  };

 

  // Step 2: Enter OTP → Verify
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    try {
      showMessage("Verifying OTP...", "loading");
      const user = await verifyLoginOtp(email, otp);
      showMessage("Login successful!", "success");

      setTimeout(() => {
  if (user.role === "admin") navigate("/admin");
  else if (user.role === "user") navigate("/user");
  else if (user.role === "seller") navigate("/seller");
  else if (user.role === "affiliate") navigate("/affiliate");
  else showMessage("Unknown role", "failed");
}, 1000);
    } catch (err) {
      showMessage(err.message, "failed");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 ">
      <div className="bg-white/20 backdrop-blur-md p-8 rounded-2xl w-full max-w-sm sm:mx-8 mx-8 md:mx-14 border border-white/30 shadow-lg">
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-2 rounded hover:bg-white/20 text-white hover:text-black text-xl"
          >
            X
          </button>
        </div>
        <div className="flex justify-center">
           <h2 className="text-2xl text-white py-4">
          {step === 1 ? "Login" : "Enter OTP"}
        </h2>
        </div>
       

        {step === 1 ? (
          <form onSubmit={handleRequestOtp} className="space-y-4">
            <input
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-white/20 bg-white/5 text-white placeholder:text-white"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-white/20 bg-white/5 text-white placeholder:text-white"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <div className="flex justify-center">
              <button
              type="submit"
              className="w-20 py-2 bg-blue-500 text-white rounded-lg"
            >
              Login
            </button>
            </div>
            
            <div className="flex justify-center gap-3 items-center text-sm">
              <span className="text-white">Don’t have an account?</span>
              <button
                onClick={onSwitchToSignup}
                className="text-blue-700 hover:underline"
              >
                Sign Up
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <input
              className="w-full px-4 py-2 border rounded bg-white/5 text-white backdrop-blur focus:outline-none focus:ring-2"
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
            />
            <div className="w-full flex justify-center items-center ">
              <button
              type="submit"
              className="w-24 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Verify
            </button>
            </div>
            <div className="w-full flex justify-center items-center">
            <div className="flex gap-6 items-start text-sm">
              <button
  type="button"
  disabled={cooldown > 0}
  className={`${
    cooldown > 0 ? "text-gray-400" : "text-blue-700 hover:underline"
  }`}
  onClick={async () => {
    try {
      setMessage("Resending OTP...", "loading");
      await requestLoginOtp(email, password);
      setMessage("OTP resent to your email", "success");
      setCooldown(30); // Restart cooldown
    } catch (err) {
      setMessage(err.message || "Failed to resend OTP", "failed");
    }
  }}
>
  {cooldown > 0 ? `Resend in ${cooldown}s` : "Resend OTP"}
</button>

              <button
                type="button"
                onClick={() => setStep(1)}
                className="text-white hover:underline"
              >
                Back to Login
              </button>
            </div>
            </div>
          </form>
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

export default Login;
