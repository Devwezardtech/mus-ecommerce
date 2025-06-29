import { useState } from "react";
import { useAuth } from "../contexts/AuthContect";
import { useNavigate } from "react-router-dom";
import Message from "./message";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const { signup, isAdminExists } = useAuth();
  const navigate = useNavigate();

  const [message, setMessage] = useState({message: "", type: ""})

  const handleBack = () => {
    navigate("/login"); // Redirect to the login page
  };

  const showMessage = (msg, type) => {
    setMessage({ message: msg, type });
    setTimeout(() => {
      setMessage({ message: "", type: "" });
    }, 1000);
  };
/*
  const handleSubmit = async (e) => {
    e.preventDefault();
    try{
      await signup(name, email, password, role);
      showMessage("Signup successful! please log in.", "success")
      setTimeout(()=>{
        navigate("/");
      }, 1000)
    }
    catch {
      showMessage("Signup failed", "failed");
    }
    
  };

  */

 const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      showMessage("Loading...", "success")
      const result = await signup(name, email, password, role);
      showMessage("Signup successful! OTP sent.", "success");
      setTimeout(() => {
        navigate("/verify-otp", { state: { email: result.email } });
      }, 1500);
    } catch (err) {
      showMessage(err.message, "failed");
    }
  };

   
  return (
     <div>
      <div className="bg-gray-100 flex items-center justify-center">
        <h1 className="text-3xl mt-16">LOGO</h1>
      </div>
     <div className="bg-gray-100 min-h-screen flex items-center justify-center">
    <div className="bg-gray-200 flex flex-col items-center p-6 rounded border border-gray-300 shadow-md w-96">
      <h2 className="text-2xl py-8 text-black-600 ">Signup</h2>
      <form className="flex flex-col space-y-4 w-full rounded text-black-200 justify-center items-center" onSubmit={handleSubmit}>

        <input className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-300" 
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-300"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-300" 
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        
        <button className="w-20 py-1 bg-gray-400 text-gray-200 rounded hover:text-black hover:bg-gray-300" type="submit">Signup</button>
        
      {/* show this modals if no exists admin 
        {!isAdminExists && (
  <select
    className="text-sm bg-gray-100"
    value={role}
    onChange={(e) => setRole(e.target.value)}
  >
    <option value="user">User</option>
    <option value="admin">Admin</option>
  </select>
)}
  */}

  <select
  className="text-sm bg-gray-100"
  value={role}
  onChange={(e) => setRole(e.target.value)}
>
  <option value="user">User</option>
  {!isAdminExists && <option value="admin">Admin</option>}
  <option value="seller">Seller</option>
  <option value="affiliate">Affiliate</option>
</select>


        
      </form>
      <div className="flex items-center">
        <h5>If you already have an account?</h5>
        <button className="w-20 m-1 py-1 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 hover:text-white" onClick={handleBack} >login</button>

      </div>
      
    </div>
    </div>
    <div className="flex justify-center item-center"> 
    {message.message && <Message message={message.message} type={message.type} />}
</div>
    </div>
  );
};

export default Signup;