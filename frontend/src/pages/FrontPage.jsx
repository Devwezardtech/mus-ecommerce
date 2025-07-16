import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios"; // Centralized Axios instance
import HeaderFrontPage from "../layouts/headerfrontPage";
import Message from "./message";
import VerifyOtpModal from "./verifyOtpModal";
import Login from "./Login";
import Signup from "./Signup";

const FrontPage = () => {
  const [products, setProducts] = useState([]);
  const [modalProduct, setModalProduct] = useState(null);
  const [message, setMessage] = useState({ message: "", type: "" });

  const [showOtpModal, setOtpModal] = useState(false);
  const [showLoginpModal, setModelLogin] = useState(false);
  const [showSignupModal, setModalSignup] = useState(false);
  const [email, setEmail] = useState("");

  const navigate = useNavigate();

  const showMessage = (msg, type = "info") => {
    setMessage({ message: msg, type });
    setTimeout(() => setMessage({ message: "", type: "" }), 2000);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await api.get("/products");
      setProducts(res.data);
    } catch (error) {
      const errMsg = error.response?.data?.message || "Failed to fetch products";
      console.error(errMsg);
      showMessage(errMsg, "failed");
    }
  };

  const handleAddToCart = () => {
    showMessage("You can login first");
    setTimeout(() => setModelLogin(true), 2000);
  };

  const handleBuy = () => {
    showMessage("You can login first");
    setTimeout(() => setModelLogin(true), 2000);
  };

 return (
    <div>
      {/* Header */}
      <div className="fixed w-full z-50">
        <HeaderFrontPage
          openLoginModal={() => setModelLogin(true)}
          openSignupModal={() => setModalSignup(true)}
        />
      </div>

      {/* Product Grid */}
      <div className="p-4 bg-gray-100">
        {products.length === 0 ? (
          // Skeleton loader
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-16 px-4 py-8">
            {Array.from({ length: 32 }).map((_, index) => (
              <div
                key={index}
                className="bg-gray-200 p-4 rounded shadow animate-pulse space-y-4"
              >
                <div className="h-48 bg-gray-300 rounded"></div>
                <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                <div className="h-4 bg-gray-300 rounded w-5/6"></div>
                <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                <div className="flex justify-between mt-2">
                  <div className="h-8 w-20 bg-gray-300 rounded"></div>
                  <div className="h-8 w-20 bg-gray-300 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="pt-20 lg:pt-10">
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 px-1 md:px-4 lg:px-16 py-4">
              {products.map((product) => (
                <div key={product._id}>
                  <div className="bg-gray-250 p-2 flex flex-col rounded shadow-md hover:shadow-lg transition-shadow duration-300 gap-2 w-70 lg:w-60">
                    <button onClick={() => setModalProduct(product)}>
                      <img
               src={product.photo}
               alt={product.name}
              className="h-60 w-60 object-cover rounded shadow"
                      />
                      <div className="p-2">
                        <strong className="text-gray-600">{product.name}</strong>
                        <p>{product.description}</p>
                        <p><strong>${product.price}</strong></p>
                        <p className="text-sm text-gray-600">Stock: {product.stock}</p>
                      </div>
                    </button>

                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => handleAddToCart(product._id)}
                        className="p-1 m-1 bg-gray-400 text-white rounded hover:bg-gray-300 hover:text-black"
                      >
                        ADD TO CART
                      </button>
                      <button
                        onClick={() => handleBuy(product)}
                        className="p-1 m-1 bg-gray-400 text-white rounded hover:bg-gray-300 hover:text-black"
                      >
                        BUY
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Product Modal */}
      {modalProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-gray-300 rounded-lg p-4 shadow-lg w-full max-w-sm relative">
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
            <h2 className="text-xl font-bold text-gray-700 mb-2">{modalProduct.name}</h2>
            <p className="text-gray-600">{modalProduct.description}</p>
            <p className="text-gray-800 font-bold mt-2">${modalProduct.price}</p>
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => handleAddToCart(modalProduct._id)}
                className="bg-gray-500 text-white px-3 py-1 rounded-lg hover:bg-gray-400 hover:text-black"
              >
                Add to Cart
              </button>
              <button
                onClick={() => handleBuy(modalProduct)}
                className="bg-gray-500 text-white px-3 py-1 rounded-lg hover:bg-gray-400 hover:text-black"
              >
                Buy
              </button>
            </div>
          </div>
        </div>
      )}

    {/* Login Modal */}
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

      {/* Signup Modal */}
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
            setEmail(email); // pass to verify
          }}
          showMessage={showMessage}
        />
      )}

      {/* OTP Modal */}
      {showOtpModal && (
        <VerifyOtpModal
          email={email}
          onClose={() => setOtpModal(false)}
          onSuccess={() => {
            setOtpModal(false);
            setTimeout(() => setModelLogin(true), 1000);
          }}
          showMessage={showMessage}
        />
      )}

      {/* Global message (bottom center) */}
      <div className="flex justify-center item-center">
        {message.message && <Message message={message.message} type={message.type} />}
      </div>
    </div>
  );
};

export default FrontPage;