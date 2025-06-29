// 📁 src/pages/affiliate/AffiliateShowcase.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../contexts/AuthContect";
import Message from "../message";
import HeaderAffiliate from "./HeaderAffiliate";

const AffiliateShowcase = () => {
  const { user } = useAuth();
  const [showcase, setShowcase] = useState([]);
  const [refCode, setRefCode] = useState("");
  const [message, setMessage] = useState({ message: "", type: "" });

  const showMessage = (msg, type) => {
    setMessage({ message: msg, type });
    setTimeout(() => setMessage({ message: "", type: "" }), 2000);
  };

  const removeFromShowcase = async (productId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/affiliate/showcase/${productId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setShowcase((prev) => prev.filter((p) => p._id !== productId));
      showMessage("Removed from showcase", "success");
    } catch {
      showMessage("Failed to remove", "failed");
    }
  };

  const handleCopy = (url) => {
    navigator.clipboard.writeText(url);
    showMessage("Link copied!", "success");
  };

  useEffect(() => {
    const fetchShowcase = async () => {
      try {
        const token = localStorage.getItem("token");

        // Get showcase
        const showcaseRes = await axios.get("http://localhost:5000/api/affiliate/showcase", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setShowcase(showcaseRes.data);

        // Get or generate ref code
        const profileRes = await axios.get("http://localhost:5000/api/affiliate/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (profileRes.data?.refCode) {
          setRefCode(profileRes.data.refCode);
        } else {
          const gen = await axios.post(
            "http://localhost:5000/api/affiliate/generate",
            {},
            { headers: { Authorization: `Bearer ${token}` } }
          );
          setRefCode(gen.data.refCode);
        }
      } catch (err) {
        console.error("Showcase load error:", err);
        showMessage("Failed to load showcase", "failed");
      }
    };

    if (user) fetchShowcase();
  }, [user]);

  return (
    <div>
      <div className="fixed w-full z-50">
        <HeaderAffiliate />
      </div>
      <div className="pt-20 px-4 bg-gray-100 min-h-screen">
        <h2 className="text-2xl font-bold mb-6">My Showcase</h2>

        {showcase.length === 0 ? (
          <p className="text-gray-600">You haven’t shared any products yet.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {showcase.map((product) => {
              const referralLink = `${window.location.origin}/product/public/${product._id}?ref=${refCode}`;
              const commissionAmount = (product.price * product.commission).toFixed(2);

              return (
                <div
                  key={product._id}
                  className="bg-white p-4 rounded shadow hover:shadow-md transition"
                >
                  <img
                    src={`http://localhost:5000/api/products/${product._id}/photo`}
                    alt={product.name}
                    className="h-48 w-full object-cover rounded mb-2"
                  />
                  <h3 className="font-semibold text-gray-800">{product.name}</h3>
                  <p className="text-sm text-gray-600">{product.description}</p>
                  <p className="text-lg font-bold text-gray-700">₱{product.price}</p>
                  <p className="text-sm text-blue-600">
                    Commission: ₱{commissionAmount} ({Math.round(product.commission * 100)}%)
                  </p>
                  <div className="flex justify-between mt-2">
                    <button
                      onClick={() => handleCopy(referralLink)}
                      className="px-2 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                      Share
                    </button>
                    <button
                      onClick={() => removeFromShowcase(product._id)}
                      className="px-2 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {message.message && (
          <div className="flex justify-center mt-6">
            <Message message={message.message} type={message.type} />
          </div>
        )}
      </div>
    </div>
  );
};

export default AffiliateShowcase;
