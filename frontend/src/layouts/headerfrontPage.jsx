import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // added useNavigate
import Message from '../pages/message';

const HeaderFrontPage = () => {
  const [message, setMessage] = useState({ message: "", type: "" });
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate(); // hook for redirection

  const showMessage = (message, type) => {
    setMessage({ message, type });
    setTimeout(() => {
      setMessage({ message: "", type: "" });
    }, 2000);
  };

  //  Add handleLogout function
  const handleLogin = () => {
    localStorage.removeItem("token");
    showMessage("loading...", "success")
    setTimeout(() => {
      navigate("/login");
    }, 1000);
  };

  const handleOrder = () => {
   setMenuOpen(false);
   showMessage("You can login first");
   setTimeout(()=>{
      navigate("/login");
   }, 2000)
  }

  return (
    <nav className="bg-gray-200 p-4 shadow-lg">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Ecommerce Website</h1>
       

      <div className="hidden md:flex justify-center gap-8 mt-4">
        <Link className='font-bold bg-gray-300 p-2 rounded shadow-md'>Home</Link>
        <Link className='font-bold bg-gray-300 p-2 rounded shadow-md' onClick={handleOrder}>Orders</Link>
      </div>

       <button 
          onClick={handleLogin} 
          className="hidden md:block bg-gray-300 p-2 mx-20 rounded shadow-md"
        >
          Login
        </button>

        <button 
                  onClick={() => setMenuOpen(!menuOpen)} 
                  className="md:hidden rounded"
                >
                  {menuOpen ? <h4 className='text-2xl p-1 '>X</h4> : <h3 className='text-4xl'>≡</h3>}
                </button>
        </div>

         

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="flex px-6 right-2 absolute bg-gray-100 border border-gray-300 rounded-md shadow-lg  w-40">
          <div className="md:hidden top-1 h-80 mt-4 flex  flex-col gap-2 inset-0 bg-opacity-40 z-50">
            <Link className='bg-gray-300 p-2 rounded hover:text-white hover:bg-gray-400 w-20 shadow-md' >Home</Link>
            <Link onClick={handleOrder} className='bg-gray-300 p-2 rounded hover:text-white hover:bg-gray-400 w-20 shadow-md'>Orders</Link>
            <button 
              onClick={() => { setMenuOpen(false); handleLogin(); }} 
              className="bg-gray-400 p-2 w-20 rounded shadow-md text-white hover:bg-gray-300 hover:text-black">
              Login
            </button>
          </div>
        </div>
      )}

      {/* Message */}
      <div className="flex justify-center items-center mt-2">
        {message.message && <Message message={message.message} type={message.type} />}
      </div>
    </nav>
  );
};

export default HeaderFrontPage;
