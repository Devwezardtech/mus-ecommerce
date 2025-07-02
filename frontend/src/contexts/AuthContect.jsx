import { createContext, useContext, useState, useEffect } from "react";
import api from "../api/axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [isAdminExists, setIsAdminExists] = useState(false); //for storing of admin account

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");

    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      axios.defaults.headers.common["Authorization"] = `Bearer ${storedToken}`;
    }
    setLoading(false);
    checkIfAdminExists();
  }, []);

  // New function to check admin status
  const checkIfAdminExists = async () => {
  try {
    const res = await api.get("/auth/admin-exists");
    setIsAdminExists(res.data.exists); // true or false
  } catch (error) {
    console.error("Error checking admin existence:", error);
  }
}; 


   // Regular login (fallback, not using OTP)
  const login = async (email, password) => {
    try {
      const res = await api.post("/api/auth/login", {
        email,
        password,
      });
      setUser(res.data.user);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      axios.defaults.headers.common["Authorization"] = `Bearer ${res.data.token}`;
      return res.data.user;
    } catch (error) {
      throw new Error(error.response?.data?.error || "Login failed");
    }
  };

  // Request OTP after valid email & password
  const requestLoginOtp = async (email, password) => {
    try {
      const res = await api.post("/auth/login-request-otp", {
        email,
        password,
      });
      return res.data; // { message: 'OTP sent to your email' }
    } catch (error) {
      const msg = error.response?.data?.error || "OTP request failed.";
      throw new Error(msg);
    }
  };

  // Verify OTP and login (called after OTP is entered)
  const verifyLoginOtp = async (email, otp) => {
    try {
      const res = await api.post("/auth/login-otp-verify", {
        email,
        otp,
      });

      setUser(res.data.user);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      axios.defaults.headers.common["Authorization"] = `Bearer ${res.data.token}`;
      return res.data.user;
    } catch (error) {
      const msg = error.response?.data?.error || "OTP verification failed.";
      throw new Error(msg);
    }
  };
  
  // SignUp
  const signup = async (name, email, password, role) => {
    try {
      const res = await api.post("/auth/signup", {
        name,
        email,
        password,
        role,
      });
      return res.data;
    } catch (error) {
      const msg = error.response?.data?.error || "Signup failed. Please try again.";
      throw new Error(msg);
    }
  };

  // Logout
  const logout = () => {
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    delete axios.defaults.headers.common["Authorization"];
    
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, loading, requestLoginOtp, verifyLoginOtp, isAdminExists, checkIfAdminExists }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

