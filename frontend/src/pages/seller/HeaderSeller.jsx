import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContect'
import Message from '../message';

const HeaderSeller = () => {
  const { logout } = useAuth();
  const [showLogout, setShowLogout] = useState(false);
  const [message, setMessage] = useState({ message: "", type: "" });
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  // Navigation handlers
  const handleSeller = () => {
    setMenuOpen(false);
    navigate("/seller");
  };

  const handleProfile = () => {
    setMenuOpen(false);
    navigate("/seller/profile");
  };

  const handleOrders = () => {
    setMenuOpen(false);
    navigate("/seller/orders");
  };

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

  const showMessage = (msg, type) => {
    setMessage({ message: msg, type });
    setTimeout(() => setMessage({ message: "", type: "" }), 2000);
  };

  return (
    <nav className="bg-gray-200 p-2 shadow-lg px-4 lg:px-16">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Seller Dashboard</h1>

        {/* Mobile toggle */}
        <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden bg-gray-300 p-2 rounded">
          {menuOpen ? <h3>X</h3> : <h3>≡</h3>}
        </button>

        {/* Desktop Menu */}
        <div className="hidden md:flex gap-8">
          <button className="font-bold bg-gray-300 p-2 rounded shadow-md" onClick={handleSeller}>Home</button>
          <button className="font-bold bg-gray-300 p-2 rounded shadow-md" onClick={handleProfile}>Profile</button>
          <button className="font-bold bg-gray-300 p-2 rounded shadow-md" onClick={handleOrders}>Orders</button>
        </div>

        <button onClick={handleLogout} className="hidden md:block bg-gray-300 p-2 rounded shadow-md">
          Logout
        </button>
      </div>

      {/* Mobile Dropdown */}
      {menuOpen && (
        <div className="fixed right-2 ">
        <div className="md:hidden mt-4 flex flex-col gap-2 bg-gray-100 p-4 rounded shadow-lg">
          <button onClick={handleSeller} className="bg-gray-300 p-2 rounded shadow-md">Home</button>
          <button onClick={handleProfile} className="bg-gray-300 p-2 rounded shadow-md">Profile</button>
          <button onClick={handleOrders} className="bg-gray-300 p-2 rounded shadow-md">Orders</button>
          <button onClick={() => { setMenuOpen(false); handleLogout(); }} className="bg-gray-400 p-2 text-white rounded shadow-md">Logout</button>
        </div>
        </div>
      )}

      {/* Logout Confirmation */}
      {showLogout && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded shadow-md">
            <p>Are you sure you want to logout?</p>
            <div className="flex justify-end gap-2 mt-4">
              <button onClick={cancelLogout} className="bg-gray-300 px-4 py-2 rounded">Cancel</button>
              <button onClick={confirmLogout} className="bg-gray-300 px-4 py-2 rounded">Ok</button>
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

export default HeaderSeller;
