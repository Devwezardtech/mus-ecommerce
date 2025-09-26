import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Message from '../pages/message';

const HeaderFrontPage = ({ openLoginModal, openSignupModal }) => {
  const [message, setMessage] = useState({ message: "", type: "" });
  const [menuOpen, setMenuOpen] = useState(false);
  

  const navigate = useNavigate();


  const showMessage = (msg, type) => {
    setMessage({ message: msg, type });
    setTimeout(() => setMessage({ message: "", type: "" }), 2000);
  };

  const handleOrder = () => {
    setMenuOpen(false);
    showMessage("You can login first");
    setTimeout(() => openLoginModal(true), 2000);
  };

  const delivery = () => {
    navigate("/deliveryacc");
    setMenuOpen(false)
  }

  return (
    <nav 
    className="
    bg-gray-200 py-2 px-4 shadow relative z-50 
    sm:p-3 sm:px-8
    md:p-4 md:px-16
    ">
      <div className="flex justify-between items-center font-bold">
        <h1 className="text-xl sm:text-2xl font-bold">Ecommerce Website</h1>

        {/* Desktop Menu */}
        <div className="hidden md:flex justify-end gap-8">
          <Link className="hover:text-blue-500">Home</Link>
          <Link className="hover:text-blue-500" onClick={handleOrder}>
            Orders
          </Link>
          <button onClick={openLoginModal} className="hover:text-blue-500">
            Login
          </button>
          <button onClick={openSignupModal} className="hover:text-blue-500">
            Signup
          </button>
        </div>

        {/* Mobile Menu Toggle */}
        <button onClick={() => setMenuOpen(true)} className="md:hidden rounded">
          <h3 className="text-2xl ">≡</h3>
        </button>
      </div>

      {/* Slide-in Mobile Menu */}
     {menuOpen && (
  <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex justify-end">
    <div className="bg-white w-1/2 h-full p-4 shadow-lg flex flex-col justify-between">
      {/* Top Section */}
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold">Menu</h2>
          <button onClick={() => setMenuOpen(false)} className="text-xl hover:text-blue-500 hover:font-semibold">✕</button>
        </div>

        <div className="flex flex-col text-lg gap-2">
          <Link onClick={() => setMenuOpen(false)} className="hover:text-blue-500">Home</Link>
          <Link onClick={handleOrder} className="hover:text-blue-500">Orders</Link>
          <button
            onClick={() => {
              setMenuOpen(false);
              openLoginModal(true);
            }}
            className="hover:text-blue-500 text-left"
          >
            Login
          </button>
          <button
            onClick={() => {
              setMenuOpen(false);
              openSignupModal(true);
            }}
            className="hover:text-blue-500 text-left"
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
          <button className="hover:underline text-gray-600 text-start" onClick={delivery}>Delivery</button>
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
