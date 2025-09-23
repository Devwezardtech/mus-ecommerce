import { useAuth } from "../contexts/AuthContect";
import { useEffect, useState } from "react";
import api from "../api/axios";
import Message from "./message";
import HeaderAffiliate from "./affiliate/HeaderAffiliate";

const AffiliateDashboard = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [refCode, setRefCode] = useState("");
  const [modalProduct, setModalProduct] = useState(null);
  const [message, setMessage] = useState({ message: "", type: "" });


  const showMessage = (msg, type) => {
    setMessage({ message: msg, type });
    setTimeout(() => setMessage({ message: "", type: "" }), 2000);
  };

  // Add to showcase
  const addToShowcase = async (product) => {
    if (!refCode) return showMessage("Referral code not ready", "failed");
    try {
      const token = localStorage.getItem("token");
      await api.post(
        "/api/affiliate/showcase",
        { productId: product._id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      showMessage("Added to showcase", "success");
    } catch (error) {
      showMessage(error.response?.data?.error || "Failed to add", "failed");
    }
  };

  // Load products, showcase, and refCode
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const token = localStorage.getItem("token");

        // Products
        const res = await api.get("/api/products");
        setProducts(res.data);

        // Referral Code: Check if already exists, else auto-generate
        const profileRes = await api
        .get("/api/affiliate/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (profileRes.data?.refCode) {
          setRefCode(profileRes.data.refCode);
        } else {
          const gen = await api.post(
            "/api/affiliate/generate",
            {},
            { headers: { Authorization: `Bearer ${token}` } }
          );
          setRefCode(gen.data.refCode);
        }
      } catch (err) {
        console.error("Dashboard load error:", err);
        showMessage("Failed to load dashboard", "failed");
      }
    };

    if (user) fetchInitialData();
  }, [user]);

  return (
    <div>
    <div className="fixed w-full z-50">
      <HeaderAffiliate />
    </div >
    <div className="p-4 bg-gray-100 min-h-screen">
      
      {/* Products List */}

      {products.length === 0 ? (
          <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 mt-5 gap-4 py-8 lg:mt-16">
            {Array.from({ length: 32 }).map((_, index) => (
              <div
                key={index}
                className="bg-gray-200 rounded shadow-sm animate-pulse p-1 space-y-1 hover:shadow-lg lg:space-y-4 lg:p-4"
              >
                <div className="h-28 bg-gray-300 rounded lg:h-48"></div>
                <div className="flex flex-col justify-center items-center gap-2">
                <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                <div className="h-4 bg-gray-300 rounded w-5/6"></div>
                <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                
                   <div className="flex justify-between mx-1 gap-1 lg:mt-2 h-5 w-20 bg-gray-300 lg:h-8 rounded">
                </div>
                </div>
               
              </div>
            ))}
          </div>
        ) : (
          <div className="pt-10 sm:pt-14 md:pt-16 lg:pt-18">

      <div className="grid gap-4 px-1 py-4 grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {products.map((product) => (
          <div key={product._id}>
            <div className="bg-gray-250 mb-4 pb-2 flex flex-col rounded shadow-md hover:shadow-lg transition-shadow duration-300 gap-2 w-auto h-auto">
            <button onClick={() => setModalProduct(product)}>
              <div className="flex flex-col items-center justify-center">
             <img
  src={product.photo}
  alt={product.name}
  className="h-28 w-28 object-cover rounded shadow sm:h-32 sm:w-32 md:h-40 md:w-40 lg:h-60 lg:w-60 "
/>
<div>
                          <strong className="text-gray-800 text-sm font-semibold sm:text-base md:text-md lg:text-lg">{product.name}</strong>
                          <p className="text-xs">{product.description}</p>
                          <p>
                            <strong className="text-sm font-semibold sm:text-base md:text-md lg:text-lg">₱{product.price}</strong>
                          </p>
                          <p className="text-sx text-sm text-gray-500 sm:text-sm md:text-sm lg:text-md">
                            Stock: {product.stock}
                          </p>
                          <p className="text-sm text-blue-600">
                Earn: ₱{(product.price * product.commission).toFixed(2)} ({Math.round(product.commission * 100)}%)
              </p>
                        </div>
              </div>
            </button>
            <div  className="w-full flex items-center justify-center">
               <button
              onClick={() => addToShowcase(product)}
              className="py-1  bg-green-500 text-white text-sm rounded hover:bg-blue-500 sm:text-base md:text-base lg:text-md mx-2 sm:mx-2 md:mx-3 px-7 "
            >
              Add
            </button>

            </div>
           
          </div>
          </div>
        ))}
      </div>
      </div>
        )};

      {/* Modal */}
      {modalProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full relative">
            <button
              onClick={() => setModalProduct(null)}
              className="absolute top-2 right-2 text-xl font-bold text-gray-500 hover:text-red-500"
            >
              ✕
            </button>
            <img
  src={modalProduct.photo}
  alt={modalProduct.name}
  className="w-full h-64 object-cover rounded mb-4"
/>

            <h2 className="text-xl font-bold text-gray-700 mb-2">{modalProduct.name}</h2>
            <p className="text-gray-600">{modalProduct.description}</p>
            <p className="text-gray-800 font-bold mt-2">₱{modalProduct.price}</p>
            <p className="text-sm text-blue-500 font-semibold">
              Commission: ₱{(modalProduct.price * modalProduct.commission).toFixed(2)} ({Math.round(modalProduct.commission * 100)}%)
            </p>
            {refCode && (
              <div className="mt-4">
                <p className="font-semibold text-sm mb-1">Referral Link:</p>
                <input
                  type="text"
                  className="w-full px-3 py-1 border rounded"
                  readOnly
                  value={`${window.location.origin}/product/public/${modalProduct._id}?ref=${refCode}`}
                />
              </div>
            )}
          </div>
        </div>
      )}

      {/* Message */}
      <div className="flex justify-center mt-6">
        {message.message && <Message message={message.message} type={message.type} />}
      </div>

    </div>
      
    </div>
  );
};

export default AffiliateDashboard;
