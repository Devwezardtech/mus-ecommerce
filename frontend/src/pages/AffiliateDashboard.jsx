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
        "/affiliate/showcase",
        { productId: product._id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setShowcase((prev) => [...prev, product]);
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
    <div className="pt-20 p-4 bg-gray-100 min-h-screen">
      {/* Products List */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {products.map((product) => (
          <div key={product._id} className="bg-white p-4 rounded shadow hover:shadow-md transition">
            <button onClick={() => setModalProduct(product)} className="w-full">
             <img
  src={product.photo}
  alt={product.name}
  className="h-48 w-full object-cover rounded mb-2"
/>

              <h3 className="font-semibold text-gray-800">{product.name}</h3>
              <p className="text-sm text-gray-600">{product.description}</p>
              <p className="text-lg font-bold text-gray-700">₱{product.price}</p>
              <p className="text-sm text-gray-600">Stock: {product.stock}</p>
              <p className="text-sm text-blue-600">
                Commission: ₱{(product.price * product.commission).toFixed(2)} ({Math.round(product.commission * 100)}%)
              </p>
            </button>
            <button
              onClick={() => addToShowcase(product)}
              className="mt-2 w-full bg-green-500 text-white rounded py-1 hover:bg-green-600"
            >
              Add to Showcase
            </button>
          </div>
        ))}
      </div>

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
