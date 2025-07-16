import { useState } from "react";
import { useAuth } from "../contexts/AuthContect";
import Message from "./message";

const Signup = ({ onClose, onSwitchToLogin, onOtpSuccess, showMessage }) => {
  const { signup, isAdminExists } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const [message, setMessage] = useState({ message: "", type: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      showMessage("Sending OTP...", "loading");
      const result = await signup(name, email, password, role);
      showMessage("OTP sent to your email!", "success");
      onOtpSuccess(email); // pass email to parent
    } catch (err) {
      showMessage(err.message || "Signup failed", "failed");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-gray-200 p-6 rounded w-96 border shadow-md">
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="bg-gray-200 px-2 rounded hover:bg-gray-300 m-2 hover:text-white"
          >
            X
          </button>
        </div>
        <h2 className="text-2xl text-black-600 py-4">Signup</h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <input
            type="text"
            className="w-full px-4 py-2 border rounded"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            type="email"
            className="w-full px-4 py-2 border rounded"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            className="w-full px-4 py-2 border rounded"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <select
            className="w-full px-4 py-2 border rounded"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="user">User</option>
            {!isAdminExists && <option value="admin">Admin</option>}
            <option value="seller">Seller</option>
            <option value="affiliate">Affiliate</option>
          </select>
          <button
            type="submit"
            className="w-full py-2 bg-gray-400 text-white rounded hover:bg-gray-300"
          >
            Sign Up
          </button>
        </form>
        <div className="flex justify-between items-center mt-4">
          <span>Already have an account?</span>
          <button
            className="text-blue-600 hover:underline"
            onClick={onSwitchToLogin}
          >
            Login
          </button>
        </div>
        <div className="mt-2">
          {message.message && <Message {...message} />}
        </div>
      </div>
    </div>
  );
};

export default Signup;
