import React, { useState } from 'react';
import { Link, } from 'react-router-dom';
import Message from '../pages/message';

const HeaderFrontPage = ({ openLoginModal, openSignupModal }) => {
  const [message, setMessage] = useState({ message: "", type: "" });
  const [menuOpen, setMenuOpen] = useState(false);


  const showMessage = (msg, type) => {
    setMessage({ message: msg, type });
    setTimeout(() => setMessage({ message: "", type: "" }), 2000);
  };

  const handleOrder = () => {
    setMenuOpen(false);
    showMessage("You can login first");
    setTimeout(() => openLoginModal(true), 2000);
  };

  return (
    <nav className="bg-gray-200 p-4 shadow-lg relative z-50">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Ecommerce Website</h1>

        {/* Desktop Menu */}
        <div className="hidden md:flex justify-center gap-8">
          <Link className="font-bold bg-gray-300 p-2 rounded shadow-md">Home</Link>
          <Link className="font-bold bg-gray-300 p-2 rounded shadow-md" onClick={handleOrder}>
            Orders
          </Link>
        </div>

        <div className="hidden md:flex gap-4">
          <button onClick={openLoginModal} className="bg-gray-300 p-2 rounded shadow-md hover:bg-gray-400">
            Login
          </button>
          <button onClick={openSignupModal} className="bg-gray-300 p-2 rounded shadow-md hover:bg-gray-400">
            Signup
          </button>
        </div>

        {/* Mobile Menu Toggle */}
        <button onClick={() => setMenuOpen(true)} className="md:hidden rounded">
          <h3 className="text-4xl">≡</h3>
        </button>
      </div>

      {/* Slide-in Mobile Menu */}
     {menuOpen && (
  <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex justify-end">
    <div className="bg-white w-1/2 h-full p-4 shadow-lg flex flex-col justify-between">
      {/* Top Section */}
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Menu</h2>
          <button onClick={() => setMenuOpen(false)} className="text-2xl">✕</button>
        </div>

        <div className="flex flex-col gap-4">
          <Link onClick={() => setMenuOpen(false)} className="text-gray-700 hover:underline">Home</Link>
          <Link onClick={handleOrder} className="text-gray-700 hover:underline">Orders</Link>
          <button
            onClick={() => {
              setMenuOpen(false);
              openLoginModal(true);
            }}
            className="text-gray-700 hover:underline text-left"
          >
            Login
          </button>
          <button
            onClick={() => {
              setMenuOpen(false);
              openSignupModal(true);
            }}
            className="text-gray-700 hover:underline text-left"
          >
            Signup
          </button>
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


      {/* Message Display */}
      <div className="flex justify-center items-center mt-2">
        {message.message && <Message message={message.message} type={message.type} />}
      </div>
    </nav>
  );
};

export default HeaderFrontPage;
