//AffiliateProducts.jsx
import { useEffect, useState } from "react";
import api from "../../api/axios";
import { useLocation, useNavigate } from "react-router-dom";
import Message from "../message";
import HeaderUser from "../../layouts/headeruser";

const AffiliateProducts = () => {
  const [products, setProducts] = useState([]);
  const [message, setMessage] = useState({ message: "", type: "" });
  const [referralBy, setReferralBy] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const ref = params.get("ref");
    if (ref) {
      localStorage.setItem("referralBy", ref);
      setReferralBy(ref);
    } else {
      setReferralBy(localStorage.getItem("referralBy"));
    }

    fetchProducts();
  }, [location]);

  const fetchProducts = async () => {
    try {
      const res = await api.get("/affiliate/showcase/all");
      setProducts(res.data);
    } catch (err) {
      console.error("Failed to fetch affiliate showcase:", err);
      showMessage("Failed to load products", "failed");
    }
  };

  const handleBuy = (product) => {
    const productItem = {
      productId: product._id,
      quantity: 1,
      price: product.price,
    };
    const total = product.price;
    navigate("/checkout", {
      state: { products: [productItem], total, referralBy },
    });
  };

  const showMessage = (msg, type) => {
    setMessage({ message: msg, type });
    setTimeout(() => setMessage({ message: "", type: "" }), 2000);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="fixed w-full z-50">
        <HeaderUser />
      </div>
      <div className="pt-20 px-4 max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold mb-4">Affiliate Products</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((product) => (
            <div
              key={product._id}
              className="bg-white rounded shadow p-4 hover:shadow-md"
            >
              <img
                src={`/products/${product._id}/photo`}
                alt={product.name}
                className="h-40 w-full object-cover rounded mb-2"
              />
              <h3 className="text-lg font-semibold">{product.name}</h3>
              <p className="text-sm text-gray-600">{product.description}</p>
              <p className="font-bold text-gray-800">₱{product.price}</p>
             {/*  <p className="text-blue-600 text-sm">
                Commission: {Math.round(product.commission * 100)}%
              </p>
              */}
              <button
                onClick={() => handleBuy(product)}
                className="mt-2 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Buy Now
              </button>
            </div>
          ))}
        </div>

        {message.message && (
          <div className="mt-4">
            <Message message={message.message} type={message.type} />
          </div>
        )}
      </div>
    </div>
  );
};

export default AffiliateProducts;
