// 📁 components/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContect";

const ProtectedRoute = ({ children, role }) => {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>; // Wait for auth to restore

  if (!user) return <Navigate to="/" replace />;
  
   // Check if role is required and valid
  const allowedRoles = Array.isArray(role) ? role : [role];
  if (role && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }
 
 

  return children;
};

export default ProtectedRoute;