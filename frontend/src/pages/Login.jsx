import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContect";
import Message from "./message";

const Login = () => {
  const [step, setStep] = useState(1); // Step 1: credentials, Step 2: OTP
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState({ message: "", type: "" });

  const { requestLoginOtp, verifyLoginOtp } = useAuth();
  const navigate = useNavigate();

  const showMessage = (msg, type) => {
    setMessage({ message: msg, type });
    setTimeout(() => setMessage({ message: "", type: "" }), 2000);
  };

  const handleExit = () => {
    showMessage("loading...", "loading");
    setTimeout(() => navigate("/"), 1000);
  };

  const handleBack = () => {
    navigate("/signup");
  };

  // Step 1: Submit email + password
  const handleRequestOtp = async (e) => {
    e.preventDefault();
    try {
      showMessage("Loading...", "success")
      await requestLoginOtp(email, password);
      showMessage("OTP sent to your email", "success");
      setStep(2);
    } catch (error) {
      showMessage(error.message, "failed");
    }
  };

  // Step 2: Submit OTP
  const handleVerifyOtp = async (e) => {
  e.preventDefault();
  try {
    showMessage("Verifying OTP...", "loading");
    const user = await verifyLoginOtp(email, otp);

    setTimeout(() => {
      if (user.role === "admin") navigate("/admin");
      else if (user.role === "user") navigate("/user");
      else if (user.role === "seller") navigate("/seller");
      else if (user.role === "affiliate") navigate("/affiliate");
      else showMessage("Unknown role", "failed");
    }, 1000);
  } catch (error) {
    showMessage(error.message, "failed");
  }
};


  return (
    <div>
      <div className="flex justify-end item-end p-8 bg-gray-100">
        <button onClick={handleExit}>X</button>
      </div>

      <div className="bg-gray-100 flex items-center justify-center ">
        <h1 className="text-3xl mt-2">LOGO</h1>
      </div>

      <div className="bg-gray-100 min-h-screen flex items-center justify-center">
        <div className="bg-gray-200 flex flex-col items-center p-6 rounded-lg border border-gray-300 shadow-md w-96">
          <h2 className="text-2xl py-8 text-black-600 ">
            {step === 1 ? "Login" : "Enter OTP"}
          </h2>

          {step === 1 ? (
            <form
              className="flex flex-col space-y-4 w-full justify-center items-center"
              onSubmit={handleRequestOtp}
            >
              <input
                className="w-full px-4 py-2 border rounded"
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <input
                className="w-full px-4 py-2 border rounded"
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                className="w-20 py-1 bg-gray-400 text-white rounded hover:bg-gray-300"
                type="submit"
              >
                Next
              </button>
              <div className="flex items-center mt-2">
                <h5>You don’t have an account?</h5>
                <button
                  onClick={handleBack}
                  className="w-20 m-1 py-1 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 hover:text-white"
                >
                  SignUp
                </button>
              </div>
            </form>
          ) : (
            <form
  className="flex flex-col space-y-4 w-full justify-center items-center"
  onSubmit={handleVerifyOtp}
>
  <input
    className="w-full px-4 py-2 border rounded"
    type="text"
    placeholder="Enter OTP"
    value={otp}
    onChange={(e) => setOtp(e.target.value)}
    required
  />

  <button
    className="w-20 py-1 bg-green-500 text-white rounded hover:bg-green-600"
    type="submit"
  >
    Verify
  </button>

  {/* Resend OTP Button */}
  <button
    type="button"
    className="text-sm text-blue-500 hover:underline"
    onClick={async () => {
      try {
        showMessage("Resending OTP...", "loading");
        await requestLoginOtp(email, password);
        showMessage("OTP resent to your email", "success");
      } catch (err) {
        showMessage(err.message, "failed");
      }
    }}
  >
    Resend OTP
  </button>

  <button
    type="button"
    onClick={() => setStep(1)}
    className="text-sm text-gray-500 hover:underline"
  >
    Back to Login
  </button>
</form>

          )}
        </div>
      </div>

      {/* Message Box */}
      <div className="flex justify-center items-center">
        {message.message && (
          <Message message={message.message} type={message.type} />
        )}
      </div>
    </div>
  );
};

export default Login;
