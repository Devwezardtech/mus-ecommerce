import { useState, useEffect } from "react";
import api from "../api/axios";
import HeaderFrontPage from "../layouts/headerfrontPage";
import Message from "./message";
import VerifyOtpModal from "./verifyOtpModal";
import Login from "./Login";
import Signup from "./Signup";  
import DeliverysignUp from "./DeliveryAcc/DeliverySignup";
import DeliveryLogin from "./DeliveryAcc/deliverlogin";
import { useNavigate } from "react-router-dom";
import FrontDisplay from "./Product_category/front_product";



const FrontPage = () => {
  const [products, setProducts] = useState([]);
  const [modalProduct, setModalProduct] = useState(null);
  const [message, setMessage] = useState({ message: "", type: "" });
  //otp for signup
  const [showOtpModal, setOtpModal] = useState(false);

  const [showLoginpModal, setModelLogin] = useState(false);
  const [showSignupModal, setModalSignup] = useState(false);
  const [showSignupModalDeliver, setModalSignupDeliver] = useState(false);
  const [showLoginModalDeliver, setModalLoginDeliver] = useState(false);

  const navigate = useNavigate();
  

  const [email, setEmail] = useState("");

  const showMessage = (msg, type) => {
    setMessage({ message: msg, type });
    setTimeout(() => setMessage({ message: "", type: "" }), 2000);
  };


  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {

    try {
      // Use timestamp to prevent caching
      const timestamp = Date.now();
      const res = await api.get(`/api/products?random=true&limit=40&_=${timestamp}`, {
        headers: { "Cache-Control": "no-cache" },
      });

      if (Array.isArray(res.data)) {
        setProducts(res.data); // replace products with new random set
      } else {
        console.error("Expected array but received:", res.data);
      }
    } catch (error) {
      console.error("Failed to fetch products:", error.message);
    }
  };


  const handleAddToCart = () => {
    setModalProduct(null)
    showMessage("You can login first");
    setTimeout(() => setModelLogin(true), 2000);
  };

  const handleBuy = () => {
    setModalProduct(null)
    showMessage("You can login first");
    setTimeout(() => setModelLogin(true), 2000);
  };

  return (
    <div>
      <div className="fixed w-full z-50">
        <HeaderFrontPage
          openLoginModal={() => setModelLogin(true)}
          openSignupModal={() => setModalSignup(true)}
          deliverySignUp={() => setModalSignupDeliver(true)}
          deliveryLogin={() => setModalLoginDeliver(true)}
        />
      </div>

       <div className="p-4">
             {products.length === 0 ? (
              
               <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 mt-5 gap-4 py-8 lg:mt-16">
                 {Array.from({ length: 32 }).map((_, index) => (
                   <div key={index} className="bg-gray-200 rounded shadow animate-pulse p-1 space-y-1 lg:space-y-4 lg:p-4">
                     <div className="h-28 bg-gray-300 rounded lg:h-48"></div>
                     <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                     <div className="h-4 bg-gray-300 rounded w-5/6"></div>
                     <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                     <div className="flex justify-between mx-1 gap-1 lg:mt-2 ">
                       <div className="h-5 w-20 bg-gray-300 lg:h-8 rounded"></div>
                       <div className="h-5 w-20 bg-gray-300 lg:h-8 rounded"></div>
                     </div>
                   </div>
                 ))}
               </div>
             ) : (
               <div>   
                 <div className="w-full pt-8">
                   <FrontDisplay />
                 </div>
     
                 <div className="pt-10 sm:pt-14 md:pt-16 lg:pt-18">
                   <h2 className="font-semibold">All Products</h2>
                   <div className="grid gap-4 px-1 py-4 grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                     {products.map((product) => (
                       <div key={product._id}>
                         <div className="bg-gray-250 mb-4 pb-2 flex flex-col rounded shadow-md hover:shadow-lg transition-shadow duration-300 gap-2 w-auto h-auto">
                    <button onClick={() => navigate(`/products/${product._id}`)}>
                        <div className="flex flex-col items-center justify-center">
                          <img
                            src={Array.isArray(product.photo) ? product.photo[0] : product.photo}
                            alt={product.name}
                            className="h-28 w-28 object-cover rounded shadow sm:h-32 sm:w-32 md:h-40 md:w-40 lg:h-60 lg:w-60"
                          />
                          <div>
                            <strong className="text-gray-800 text-sm font-semibold sm:text-base md:text-md lg:text-lg">{product.name}</strong>
                            <p className="text-xs">{product.description}</p>
                            <p>
                              <strong className="text-sm font-semibold sm:text-base md:text-md lg:text-lg">${product.price}</strong>
                            </p>
                            <p className="text-sx text-sm text-gray-500 sm:text-sm md:text-sm lg:text-md">
                              Stock: {product.stock}
                            </p>
                          </div>
                        </div>
                      </button>

                    <div className="flex items-center justify-center gap-1">
                      <button
                        onClick={() => handleAddToCart(product._id)}
                        className=" bg-blue-500 text-white text-sm rounded hover:bg-blue-600 sm:text-base md:text-base lg:text-md"
                      >
                         <span className="block sm:hidden md:hidden px-1">CART</span>
                         <span className="hidden sm:block px-1">ADD TO CART</span>
                      </button>
                      <button
                        onClick={() => handleBuy(product)}
                        className="px-2 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 sm:text-base md:text-base lg:text-md"
                      >
                        BUY
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          </div>
        )}
      </div>

     

      {modalProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-gray-200 p-6 rounded shadow-lg max-w-sm sm:max-w-sm lg:max-w-md w-full relative">
            <button
              onClick={() => setModalProduct(null)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-200 text-xl bg-gray-200 hover:bg-gray-400 rounded w-10"
            >
              ✕
            </button>
            <img
        src={modalProduct.photo}
        alt={modalProduct.name}
              className="w-full h-74 object-cover rounded-lg mb-4 py-8"
            />
            <h2 className="text-xl font-bold text-gray-700 mb-2">
              {modalProduct.name}
            </h2>
            <p className="text-gray-600">{modalProduct.description}</p>
            <p className="text-gray-800 font-bold mt-2">₱ {modalProduct.price}</p>
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => handleAddToCart(modalProduct._id)}
                className="bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-600"
              >
                Add to Cart
              </button>
              <button
                onClick={() => handleBuy(modalProduct)}
                className="bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-600"
              >
                Buy
              </button>
            </div>
          </div>
        </div>
      )}

     {showLoginpModal && (
  <Login
    onClose={() => setModelLogin(false)}
    onSwitchToSignup={() => {
      setModelLogin(false);
      setModalSignup(true);
    }}
    showMessage={showMessage}
  />
)}


{showSignupModal && (
  <Signup
    onClose={() => setModalSignup(false)}
    onSwitchToLogin={() => {
      setModalSignup(false);
      setModelLogin(true);
    }}
    onOtpSuccess={(email) => {
      setModalSignup(false);
      setOtpModal(true);
      setEmail(email); // store email for VerifyOtpModal
    }}
    showMessage={showMessage}
  />
)}




{showOtpModal && (
  <VerifyOtpModal
    email={email}
    onClose={() => setOtpModal(false)}
    onSuccess={() => {
      setOtpModal(false);
      setTimeout(() => {
        setModelLogin(true);
      }, 1000);
    }}
    showMessage={showMessage}
  />
)}

{/* this is for delivey sign up and login */}
{showSignupModalDeliver && (
  <DeliverysignUp
    onClose={() => setModalSignupDeliver(false)}
    ondeliveryLogin={() => {
      setModalSignupDeliver(false);
      setModalLoginDeliver(true);
    }}
    onOtpSuccess={(email) => {
      setModalSignupDeliver(false);
      setOtpModal(true);
      setEmail(email); // store email for VerifyOtpModal
    }}
    showMessage={showMessage}
  />
)}

 {showLoginModalDeliver && (
  <DeliveryLogin
    onClose={() => setModalLoginDeliver(false)}
    ondeliverySignUp={() => {
      setModalLoginDeliver(false);
      setModalSignupDeliver(true);
    }}
    showMessage={showMessage}
  />
)}



      <div className="flex justify-center item-center">
        {message.message && <Message message={message.message} type={message.type} />}
      </div>
    </div>
  );
};

export default FrontPage;
