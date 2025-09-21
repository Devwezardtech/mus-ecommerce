// 📁 src/pages/affiliate/AffiliateShowcase.jsx
import { useEffect, useState } from "react";
import api from "../../api/axios";
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
      await api.delete(`/api/affiliate/showcase/${productId}`, {
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
        const showcaseRes = await api.get("/api/affiliate/showcase", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setShowcase(showcaseRes.data);

        // Get or generate ref code
        const profileRes = await api.get("/api/affiliate/profile", {
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
      <div className="pt-14 px-4 bg-gray-100 min-h-screen">
        {showcase.length === 0 ? (
          <p className="text-gray-600 pt-4 ">You haven’t shared any products yet.</p>
        ) : (
          <div className="pt-2 sm:pt-2 md:pt-6 lg:pt-10">
  <div className="grid gap-4 px-1 py-4 grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 justify-items-center">
    {showcase.map((product) => {
      const referralLink = `${window.location.origin}#${`/product/public/${product._id}?ref=${refCode}`}`;
      const commissionAmount = (product.price * product.commission).toFixed(2);

      return (
        <div
          key={product._id}
          className="bg-gray-250 mb-4 pb-2 flex flex-col rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-300 gap-2 w-auto h-auto"
        >
          <img
            src={product.photo}
            alt={product.name}
            className="h-28 w-28 object-cover rounded shadow-sm sm:h-32 sm:w-32 md:h-40 md:w-40 lg:h-60 lg:w-60 mx-auto"
          />
          <div className="px-2 text-center">
            <strong className="text-gray-800 text-sm font-semibold sm:text-base md:text-md lg:text-lg">
              {product.name}
            </strong>
            <p className="text-xs">{product.description}</p>
            <p>
              <strong className="text-sm font-semibold sm:text-base md:text-md lg:text-lg">
                ₱{product.price}
              </strong>
            </p>
            <p className="text-xs text-gray-500 sm:text-sm md:text-sm lg:text-md">
              Stock: {product.stock}
            </p>
            <p className="text-sm text-blue-600">
              Earn: ₱{commissionAmount} ({Math.round(product.commission * 100)}%)
            </p>
          </div>
          <div className="flex items-center justify-center gap-1">
            <button
              onClick={() => handleCopy(referralLink)}
              className="p-1 bg-green-500 text-white text-sm rounded hover:bg-green-400 sm:text-base md:text-base lg:text-md"
            >
              Share
            </button>
            <button
              onClick={() => removeFromShowcase(product._id)}
              className="p-1 bg-red-500 text-white text-sm rounded hover:bg-red-400 sm:text-base md:text-base lg:text-md"
            >
              Remove
            </button>
          </div>
        </div>
      );
    })}
  </div>
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
