import { useState } from "react";
import { useAuth } from "../contexts/AuthContect";
import Message from "./message";

const Signup = ({ onClose, onSwitchToLogin, onOtpSuccess }) => {
  const { signup, isAdminExists } = useAuth();

  const [name, setName] = useState("");
  const [message, setMessage] = useState({ message: "", type: "" });
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");

  const showMessage = (msg, type) => {
    setMessage({ message: msg, type });
    setTimeout(() => setMessage({ message: '', type: '' }), 2000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      showMessage("Sending OTP...", "loading");
      await signup(name, email, password, role);
      showMessage("OTP sent to your email!", "success");
      onOtpSuccess(email); // pass email to parent
    } catch (err) {
      // since AuthContext throws Error(msg), just use err.message
      showMessage(err.message || "Signup failed", "failed");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
      <div className="bg-white/20 backdrop-blur-md p-6 rounded-2xl w-full max-w-sm mx-14 border border-white/30 shadow-lg">
        {/* Close button */}
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-2 rounded hover:bg-white/20 text-white hover:text-black text-xl"
          >
            X
          </button>
        </div>
        <div className="flex justify-center">
          <h2 className="text-2xl text-white py-4">Signup</h2>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <input
            type="text"
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-white/20 bg-white/5 text-white placeholder:text-white"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            type="email"
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-white/20 bg-white/5 text-white placeholder:text-white"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-white/20 bg-white/5 text-white placeholder:text-white"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {/* Role dropdown */}
          <div className="flex justify-start items-center gap-3 w-full">
            <div>
              <label htmlFor="role" className="block text-sm font-medium text-white"> Role:
          </label>

            </div>
            <div className="w-full">
               <select
            id="role"
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-white/20 bg-white/5 text-white"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="user" className="bg-gray-400">User</option>
            {!isAdminExists && <option value="admin" className="bg-gray-400">Admin</option>}
            <option value="seller" className="bg-gray-400">Seller</option>
            {/*
            
            <option value="affiliate" className="bg-gray-400">Affiliate</option>

            */}
          </select>
            </div>
              
         
          </div>
        

          <div className="flex justify-center mt-4">
            <button
              type="submit"
              className="w-20 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Sign Up
            </button>
          </div>
        </form>

        <div className="w-full mt-4">
          <div className="flex justify-center gap-5 text-sm">
            <span className="text-white">Already have an account?</span>
          <button
            className="text-blue-600 hover:underline"
            onClick={onSwitchToLogin}
          >
            Login
          </button>
          </div>
          
        </div>

        {/* If parent handles messages, no need for local Message */}
        {message.message && (
                  <div className="mt-4">
                    <Message message={message.message} type={message.type} />
                  </div>
                )}
      </div>
    </div>
  );
};

export default Signup;
