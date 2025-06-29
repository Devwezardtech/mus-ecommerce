import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContect';
import Message from '../pages/message';

const HeaderAdmin = () => {
  const { logout } = useAuth();
  const [showLogout, setShowLogout] = useState(false);
  const [message, setMessage] = useState({ message: "", type: "" });
  const [menuOpen, setMenuOpen] = useState(false); // for mobile menu toggle

  const showMessage = (message, type) => {
    setMessage({ message, type });
    setTimeout(() => {
      setMessage({ message: "", type: "" });
    }, 2000);
  };

  const handleLogout = () => setShowLogout(true);
  const confirmLogout = () => {
    setShowLogout(false);
    showMessage("Loading...", "loading");
    setTimeout(() => logout(), 1000);
  };
  const cancelLogout = () => {
    setShowLogout(false);
    showMessage("Canceled", "failed");
  };

  return (
    <nav className="bg-gray-200 p-2 shadow-lg px-4 lg:px-16">
      {/* Top section with logo and logout/menu icon */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>

        {/* Mobile Menu Icon */}
        <button 
                  onClick={() => setMenuOpen(!menuOpen)} 
                  className="md:hidden rounded"
                >
                  {menuOpen ? <h4 className='text-2xl p-1 '>X</h4> : <h3 className='text-4xl'>≡</h3>}
                </button>

        <div className="hidden md:flex justify-center gap-8 mt-4">
        <Link className='font-bold bg-gray-300 p-2 rounded shadow-md' to="/Admin">Home</Link>
        <Link className='font-bold bg-gray-300 p-2 rounded shadow-md' to="/admin/orders">Orders</Link>
       {
        /*
       <Link className='font-bold bg-gray-300 p-2 rounded shadow-md' to="/chat">Chat</Link>
        */
        }
      </div>

        {/* Desktop Logout Button */}
        <button 
          onClick={handleLogout} 
          className="hidden md:block bg-gray-300 p-2 rounded shadow-md"
        >
          Logout
        </button>
      </div>

      {/* Desktop Navigation */}
      

      {/* Mobile Dropdown Menu */}
      {menuOpen && (
        <div className="flex px-6 right-0 absolute bg-gray-100 border border-gray-100 bg-white-1000 rounded-md shadow-lg  w-40">
       <div className="md:hidden top-1 h-80 mt-4 flex  flex-col gap-2 inset-0 bg-copacity-40 z-50 ">
          <Link onClick={() => setMenuOpen(false)} className='bg-gray-300 p-2 rounded hover:text-white hover:bg-gray-400 w-20 shadow-md' to="/Admin">Home</Link>
          <Link onClick={() => setMenuOpen(false)} className='bg-gray-300 p-2 rounded hover:text-white hover:bg-gray-400 w-20 shadow-md' to="/admin/orders">Orders</Link>
          <button onClick={() => { setMenuOpen(false); handleLogout(); }} className="bg-gray-400 p-2 w-20 rounded shadow-md text-white hover:bg-gray-300 hover:text-black">Logout</button>
        </div>
        </div>
      )}

      {/* Logout Modal */}
      {showLogout && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <p className="mb-4">Are you sure you want to logout?</p>
            <div className="flex justify-end gap-2">
              <button onClick={cancelLogout} className="px-3 py-2 bg-gray-300 text-black hover:bg-gray-400 hover:text-white rounded-lg">Cancel</button>
              <button onClick={confirmLogout} className="px-3 py-2 bg-gray-300 text-black hover:bg-gray-400 hover:text-white rounded-lg">Ok</button>
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

export default HeaderAdmin;
