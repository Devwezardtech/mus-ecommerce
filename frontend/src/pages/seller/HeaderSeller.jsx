import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContect'
import Message from '../message';

const HeaderSeller = ({ onAddProduct }) => {
  const { logout } = useAuth();
  const [showLogout, setShowLogout] = useState(false);
  const [message, setMessage] = useState({ message: "", type: "" });
  const [menuOpen, setMenuOpen] = useState(false);

  const navigate = useNavigate

  const handleLogout = () => setShowLogout(true);

  const confirmLogout = () => {
    setShowLogout(false);
    showMessage("Logging out...", "loading");
    setTimeout(() => logout(), 1000);
    navigate("/")
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
  <nav 
    className="bg-gray-200 py-2 px-4 shadow-lg relative z-50 sm:p-3 sm:px-8 md:p-4 md:px-16">
      <div className="flex justify-between items-center font-bold">
        <h1 className="text-xl sm:text-2xl font-bold">Seller Dashboard</h1>

        {/* Destop Menu */}
        <div className="hidden md:flex justify-end gap-8">
        <Link className="hover:text-blue-500" to="/seller/profile">Profile</Link>
        <Link className="hover:text-blue-500" to="/seller">Home</Link>
        <Link className="hover:text-blue-500" to="/seller">Product</Link>
        <Link className="hover:text-blue-500" to="/seller/orders">Orders</Link>
        
       {
        /*
       <Link className="hover:text-blue-500" to="/chat">Chat</Link>
        */
        }
        <button 
            onClick={onAddProduct} className="hover:text-blue-500">
            Add Product
          </button>
         <button 
          onClick={handleLogout} 
          className="hover:text-blue-500"
        >
          Logout
        </button>
      </div>
      {/* Mobile Menu Toggle */}
        <button onClick={() => setMenuOpen(true)} className="md:hidden rounded">
          <h3 className="text-2xl ">≡</h3>
        </button>
       
      </div>

      
      

      {/* Mobile Dropdown Menu */}
      {menuOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex justify-end">
       <div className="bg-white w-1/2 h-full p-4 shadow-lg flex flex-col justify-between">
       <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold">Menu</h2>
          <button onClick={() => setMenuOpen(false)} className="text-xl hover:text-blue-500">✕</button>
        </div>
        <div className="flex flex-col text-lg gap-2">
         <Link className="hover:text-blue-500" to="/seller/profile">Profile</Link>
          <Link onClick={() => setMenuOpen(false)} className="hover:text-blue-500 hover:text-xl" to="/seller">Home</Link>
           <Link className="hover:text-blue-500 hover:text-xl" to="/seller">Product</Link>
         <Link onClick={() => setMenuOpen(false)} className="hover:text-blue-500 hover:text-xl" to="/seller/orders">Orders</Link>
         <button 
            onClick={onAddProduct} className="hover:text-blue-500 hover:text-xl text-left">
            Add Product
          </button>
          <button onClick={() => { setMenuOpen(false); handleLogout(); }} className="hover:text-blue-500 hover:text-xl text-left">Logout</button>
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

      {/* Message Alert */}
      <div className="flex justify-center items-center mt-2">
        {message.message && <Message message={message.message} type={message.type} />}
      </div>
    </nav>
    
  );
};

export default HeaderSeller;
