// 📁 pages/SellerProfile.jsx
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api/axios";

const SellerProfile = () => {
  const { id } = useParams(); // seller ID from URL
  const navigate = useNavigate();
  const [seller, setSeller] = useState(null);
  const [products, setProducts] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchSellerData = async () => {
      try {
        // 1️⃣ Fetch seller profile (public)
        const sellerRes = await api.get(`/auth/${id}`);  setSeller(sellerRes.data);

        // Fetch seller's products (public)
        const productsRes = await api.get(`/products?seller=${id}`);
        setProducts(productsRes.data);
      } catch (err) {
        console.error("Error fetching seller profile:", err);
        setError("Failed to load seller or products.");
      }
    };

    fetchSellerData();
  }, [id]);

  if (error) return <div className="text-center mt-32 text-red-500">{error}</div>;
  if (!seller) return <div className="text-center mt-32">Loading seller info...</div>;

  return (
    <div className="min-h-screen bg-gray-100 pt-20 px-4 pb-10">
      {/* 🔹 Seller Info */}
      <div className="max-w-3xl mx-auto bg-white p-6 rounded shadow-md mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-1">{seller.name}</h2>
        <p className="text-gray-600">Seller Profile</p>
        <p className="text-sm text-gray-500">Email: {seller.email}</p>
      </div>

      {/* 🔹 Seller Products */}
      <div className="max-w-5xl mx-auto">
        <h3 className="text-xl font-semibold mb-4">Products by {seller.name}</h3>

        {products.length === 0 ? (
          <p className="text-gray-500">No products found for this seller.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map((product) => (
              <div key={product._id} className="bg-white p-4 rounded shadow">
                <img
                  src={product.photo}
                  alt={product.name}
                  className="w-full h-40 object-cover rounded mb-2"
                />
                <h4 className="font-semibold text-gray-800 truncate">{product.name}</h4>
                <p className="text-sm text-gray-600 truncate">{product.description}</p>
                <p className="text-sm font-bold text-gray-700">₱{product.price}</p>
                <button
                  onClick={() => navigate(`/product/public/${product._id}`)}
                  className="mt-2 text-sm text-blue-600 hover:underline"
                >
                  View Product
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SellerProfile;
