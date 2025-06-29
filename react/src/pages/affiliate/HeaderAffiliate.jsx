import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from '../../contexts/AuthContect'
import Message from "../message";

const HeaderAffiliate = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);
  const [showLogout, setShowLogout] = useState(false);
  const [message, setMessage] = useState({ message: "", type: "" });

  // ✅ Toast
  const showMessage = (msg, type = "success") => {
    setMessage({ message: msg, type });
    setTimeout(() => setMessage({ message: "", type: "" }), 2000);
  };

  // ✅ Navigation handlers
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
  };

  const cancelLogout = () => {
    setShowLogout(false);
    showMessage("Cancelled", "failed");
  };

  return (
    <nav className="bg-gray-200 p-2 shadow-lg px-4 lg:px-16">
      {/* Top Bar */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Affiliate Dashboard</h1>

        {/* Mobile menu toggle */}
        <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden bg-gray-300 p-2 rounded">
          {menuOpen ? <span>X</span> : <span>≡</span>}
        </button>

        {/* Desktop Nav */}
        <div className="hidden md:flex gap-8">
          <button className="bg-gray-300 p-2 rounded shadow-md font-bold" onClick={goHome}>
            Home
          </button>
          <button className="bg-gray-300 p-2 rounded shadow-md font-bold" onClick={goProfile}>
            Profile
          </button>
          <button className="bg-gray-300 p-2 rounded shadow-md font-bold" onClick={goShowcase}>
            Showcase
          </button>
          <button className="bg-gray-300 p-2 rounded shadow-md font-bold" onClick={goAffiliateOrder}>
            Order
          </button>
        </div>

        {/* Desktop Logout */}
        <button onClick={handleLogout} className="hidden md:block bg-gray-300 p-2 rounded shadow-md">
          Logout
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="fixed right-2 ">
        <div className="md:hidden mt-4 flex flex-col gap-2 bg-gray-100 p-4 rounded shadow-md">
          <button onClick={goHome} className="bg-gray-300 p-2 rounded shadow-md">
            Home
          </button>
          <button onClick={goProfile} className="bg-gray-300 p-2 rounded shadow-md">
            Profile
          </button>
          <button onClick={goShowcase} className="bg-gray-300 p-2 rounded shadow-md">
            Showcase
          </button>
          <button onClick={goAffiliateOrder} className="bg-gray-300 p-2 rounded shadow-md">
            Order
          </button>
          <button
            onClick={() => {
              setMenuOpen(false);
              handleLogout();
            }}
            className="bg-gray-400 p-2 text-white rounded shadow-md"
          >
            Logout
          </button>
        </div>
        </div>
      )}

      {/* Logout Confirmation */}
      {showLogout && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded shadow-lg">
            <p className="mb-4">Are you sure you want to logout?</p>
            <div className="flex justify-end gap-2">
              <button onClick={cancelLogout} className="px-3 py-2 bg-gray-300 rounded">
                Cancel
              </button>
              <button onClick={confirmLogout} className="px-3 py-2 bg-gray-300 rounded">
                Ok
              </button>
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
