import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from '../../contexts/AuthContect'
import Message from "../message";

const HeaderAffiliate = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);
  const [showLogout, setShowLogout] = useState(false);
  const [message, setMessage] = useState({ message: "", type: "" });

  // Toast
  const showMessage = (msg, type = "success") => {
    setMessage({ message: msg, type });
    setTimeout(() => setMessage({ message: "", type: "" }), 2000);
  };

  // Navigation handlers
  const goHome = () => {
    setMenuOpen(false);
    navigate("/affiliate");
  };

  const goProfile = () => {
    setMenuOpen(false);
    navigate("/profile");
  };

  const goShowcase = () => {
    setMenuOpen(false);
    navigate("/affiliate/showcase");
  };

  const goAffiliateOrder = () => {
   setMenuOpen(false);
   navigate("/affiliate/orders")
  }

  const handleLogout = () => setShowLogout(true);

  const confirmLogout = () => {
    setShowLogout(false);
    showMessage("Logging out...", "loading");
    setTimeout(() => logout(), 1000);
    navigate("/");
  };

  const cancelLogout = () => {
    setShowLogout(false);
    showMessage("Cancelled", "failed");
  };

  return (
    <nav className="bg-blue-600 text-white p-2 shadow px-4 lg:px-16">
      {/* Top Bar */}
             <div className="flex justify-between items-center font-bold">
        <h1 className="text-xl sm:text-2xl font-bold">Affiliate Dashboard</h1>

        {/* Desktop Menu */}
        <div className="hidden md:flex justify-end gap-8">
          <button className="hover:text-green-500" onClick={goHome}>
            Home</button>
          <button className="hover:text-green-500" onClick={goProfile}>
            Profile
          </button>
          <button  className="hover:text-green-500" onClick={goShowcase}>
            Showcase
          </button>
          <button  className="hover:text-green-500" onClick={goAffiliateOrder}>
            Order
          </button>
          <button  className="hover:text-green-500" onClick={handleLogout}>
            Logout
          </button>
        </div>

        {/* Mobile Menu Toggle */}
        <button onClick={() => setMenuOpen(true)} className="md:hidden rounded">
          <h3 className="text-2xl ">≡</h3>
        </button>
      </div>

      {/* Slide-in Mobile Menu */}

      {menuOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex justify-end text-black">
       <div className="bg-white w-1/2 h-full p-4 shadow-lg flex flex-col justify-between">
       <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold">Menu</h2>
          <button onClick={() => setMenuOpen(false)} className="text-xl hover:text-blue-500">✕</button>
        </div>
        <div className="flex flex-col text-lg gap-2">
         <button className="hover:text-blue-500 text-left" onClick={goHome}>Home</button>
          <button onClick={goProfile} className="hover:text-blue-500 text-left" >Profile</button>
           <button className="hover:text-blue-500 text-left" onClick={goShowcase}>Showcase</button>
         <button onClick={goAffiliateOrder} className="hover:text-blue-500 text-left" >Orders</button>
          <button onClick={() => {
              setMenuOpen(false);
              handleLogout();
            }} className="hover:text-blue-500 text-left">Logout</button>
        </div>
        </div>

         {/* Footer Section */}
              <div className="border-t pt-4 text-xs text-gray-500">
                <div className="flex flex-col gap-2">
                  <Link className="hover:underline text-gray-600" onClick={() => setMenuOpen(false)}>About</Link>
                  <Link className="hover:underline text-gray-600" onClick={() => setMenuOpen(false)}>Help & Support</Link>
                  <Link className="hover:underline text-gray-600" onClick={() => setMenuOpen(false)}>Terms of Service</Link>
                  <Link className="hover:underline text-gray-600" onClick={() => setMenuOpen(false)}>Privacy Policy</Link>
                </div>
                <p className="mt-4 text-center">© 2025 Ecommerce</p>
              </div>

        </div>
        </div>
      )}





      

      {/* Logout Modal */}
      {showLogout && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <p className="mb-4 text-lg">Are you sure you want to logout?</p>
            <div className="flex justify-end gap-2">
              <button onClick={cancelLogout} className="px-3 py-2 bg-blue-500 text-white hover:bg-blue-400 rounded-lg">Cancel</button>
              <button onClick={confirmLogout} className="px-6 py-2 bg-red-500 hover:bg-red-400 text-white rounded-lg">Ok</button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Message */}
      {message.message && (
        <div className="flex justify-center mt-2">
          <Message message={message.message} type={message.type} />
        </div>
      )}
    </nav>
  );
};

export default HeaderAffiliate;
