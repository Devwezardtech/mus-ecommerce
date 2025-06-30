import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContect';  // Import Link for navigation
import Message from '../pages/message';

const HeaderUser = () => {
   const { logout } = useAuth();
   const [showLogout, setShowLogout] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
   
      //message of alert
      const [message, setMessage] = useState({message: "", type: ""})
   
      //this alert message
       const showMessage = (message, type) => {
         setMessage({message, type});
   
         setTimeout(()=>{
           setMessage({message: "", type: ""});
         }, 2000)
       }
   
       //logout modals 
        const handleLogout = () => {
       setShowLogout(true); // show modal on button click
     };
   
     const confirmLogout = () => {
   
      setShowLogout(false); // close modal
       showMessage("Loading...", "loading")
        
       setTimeout(()=>{
         logout(); // call logout from context
       }, 1000)
      
     };
   
     const cancelLogout = () => {
       setShowLogout(false);
       showMessage("Canceled", "failed")
     };
   

   return (
      <nav className="bg-gray-200 p-3 shadow-lg px-4 lg:px-16">

         <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Ecommerce Website</h1>
               
        
              <div className="hidden md:flex justify-center gap-8 mt-4">
                <Link className='font-bold bg-gray-300 p-2 rounded shadow-md' to="/user">Home</Link>
                <Link className='font-bold bg-gray-300 p-2 rounded shadow-md' to="/user/orders">Orders</Link>
                <Link className='font-bold bg-gray-300 p-2 rounded shadow-md' to="/cart" >Cart</Link>
              </div>
        
               <button 
                  onClick={handleLogout} 
                  className="hidden md:block bg-gray-300 p-2 mx-20 rounded shadow-md"
                >
                  Logout
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
                        <div className="flex px-6 right-0 absolute bg-gray-100 border border-gray-100 bg-white-1000 rounded-md shadow-lg  w-40">
                          <div className="md:hidden top-1 h-80 mt-4 flex  flex-col gap-2 inset-0 bg-copacity-40 z-50 ">
                            <Link className='bg-gray-300 p-2 rounded hover:text-white hover:bg-gray-400 w-20 shadow-md' to="/user" >Home</Link>
                            <Link className='bg-gray-300 p-2 rounded hover:text-white hover:bg-gray-400 w-20 shadow-md' to="/user/orders">Orders</Link>
                             <Link className='bg-gray-300 p-2 rounded hover:text-white hover:bg-gray-400 w-20 shadow-md' to="/cart" >Cart</Link>
                            <button 

                              onClick={() => { setMenuOpen(false); handleLogout(); }} 
                              className="bg-gray-400 p-2 w-20 rounded shadow-md text-white hover:bg-gray-300 hover:text-black">
                              Logout
                            </button>
                          </div>
                        </div>
                      )}



         {/* this line for modals show confirmation for logout*/}
      {showLogout && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-gray-200 p-6 rounded-lg shadow-lg">
            <p>Are you sure you want to logout?</p>
            <div className="mt-4 flex justify-end gap-2">
              <button onClick={cancelLogout} className="px-4 py-2 bg-gray-300 hover:bg-gray-400 hover:text-white rounded">Cancel</button>
              <button onClick={confirmLogout} className="px-4 py-2 bg-gray-300 hover:bg-gray-400 hover:text-white rounded">Ok</button>
            </div>
          </div>
        </div>
      )}
         
         <div>
            {/*show message */}
            <div className="flex justify-center item-center"> 
    {message.message && <Message message={message.message} type={message.type} />}
</div>
            
         </div>
      </nav>
   );
}

export default HeaderUser;