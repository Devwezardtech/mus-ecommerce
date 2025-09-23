import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api/axios";
// import Message from "../components/Message"; // optional
import HeaderUser from "../layouts/headeruser";

const PublicProductMerged = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const refCode = searchParams.get("ref");

  const [product, setProduct] = useState(null);
  const [sellerProducts, setSellerProducts] = useState([]);
  const [affiliateProducts, setAffiliateProducts] = useState([]);
  const [copied, setCopied] = useState(false);
  const [message, setMessage] = useState({ message: "", type: "" });

  const link = `${window.location.origin}#${`/product/public/${id}${refCode ? `?ref=${refCode}` : ""}`}`;

  const showMessage = (msg, type = "success") => {
    setMessage({ message: msg, type });
    setTimeout(() => setMessage({ message: "", type: "" }), 2000);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(link);
    setCopied(true);
    showMessage("Referral link copied!", "success");
  };

  const handleAddToCart = async () => {
    const token = localStorage.getItem("token");
    if (!token) return showMessage("Login required to add to cart", "failed");

    try {
      await api.post(
        "/api/cart",
        { productId: product._id, quantity: 1 },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      showMessage("Added to cart");
    } catch (err) {
      showMessage("Failed to add to cart", "failed", err);
    }
  };

  const handleBuyNow = () => {
    const total = product.price;
    const productItem = {
      productId: product._id,
      quantity: 1,
      price: product.price,
    };
    navigate("/checkout", {
      state: { products: [productItem], total },
    });
  };

  const goToSellerProfile = (sellerId) => {
    navigate(`/seller/${sellerId}`);
  };

  useEffect(() => {
    const fetchProductAndRelated = async () => {
      try {
        const res = await api.get(`/api/products/public/${id}`);
        const fetchedProduct = res.data;
        setProduct(fetchedProduct);

        // Fetch seller's other products
        if (fetchedProduct.createdBy) {
          const sellerRes = await api.get(`/api/products?seller=${fetchedProduct.createdBy}`);
          setSellerProducts(sellerRes.data.filter((p) => p._id !== fetchedProduct._id));
        }

        // Fetch affiliate shared products (if ref present)
        if (refCode) {
          const refRes = await api.get(`/api/users/ref/${refCode}`);
          const affiliate = refRes.data;
          if (affiliate?._id) {
            const affiliateProdRes = await api.get(`/api/products?sharedBy=${affiliate._id}`);
            setAffiliateProducts(affiliateProdRes.data);
          }
        }
      } catch (err) {
        console.error("Error loading product or related:", err);
        showMessage("Product not found or unavailable", "failed");
      }
    };

    fetchProductAndRelated();
  }, [id, refCode]);

  if (!product) return <div className="text-center mt-32">Loading...</div>;

  return (
    <div>
      <div className="fixed w-full z-50" >
        <HeaderUser/>
      </div>

 <div className="min-h-screen bg-gray-100 pt-20 pb-10">
      {/* Product Info */}
      <div className="max-w-3xl mx-auto bg-white rounded-lg p-6">
        <img
           src={product.photo}
          alt={product.name}
          className="w-full h-64 object-cover rounded mb-4"
        />
        <h2 className="text-2xl font-bold text-gray-800 mb-2">{product.name}</h2>
        <p className="text-gray-600 mb-2">{product.description}</p>
        <p className="text-lg font-bold text-gray-700 mb-1">₱{product.price}</p>
        <p className={`mb-2 ${product.stock > 0 ? "text-green-600" : "text-red-500"}`}>
          {product.stock > 0 ? `In stock: ${product.stock}` : "Out of stock"}
        </p>

        {/* Seller */}
        {product.createdBy && (
          <div className="mb-4">
            <p className="text-sm text-gray-500">Sold by:</p>
            <button
              onClick={() => goToSellerProfile(product.createdBy)}
              className="text-blue-600 hover:underline font-medium"
            >
              View Seller Profile
            </button>
          </div>
        )}

        {/* Buttons */}
        <div className="flex flex-wrap gap-2 mb-4">
          <button className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-800" onClick={handleAddToCart}>
            Add to Cart
          </button>
          <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700" onClick={handleBuyNow}>
            Buy Now
          </button>
          <button className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded" onClick={handleCopy}>
            {copied ? "Copied!" : "Copy Link"}
          </button>
          <a
            href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(link)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-blue-700 hover:bg-blue-800 text-white py-2 px-4 rounded"
          >
            Share
          </a>
        </div>
      </div>

      {/* Seller Products */}
      {sellerProducts.length > 0 && (
        <div className="max-w-5xl mx-auto mt-8">
          <h3 className="text-xl font-semibold mb-4">More from this seller</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {sellerProducts.map((prod) => (
              <div key={prod._id} className="bg-white p-4 rounded shadow">
                <img
                  src={prod.photo}
                  alt={prod.name}
                  className="w-full h-40 object-cover rounded mb-2"
                />
                <h4 className="font-semibold text-gray-800">{prod.name}</h4>
                <p className="text-sm text-gray-600 mb-1">{prod.description}</p>
                <p className="text-sm font-bold text-gray-700">₱{prod.price}</p>
                <button
                  onClick={() => navigate(`/product/public/${prod._id}${refCode ? `?ref=${refCode}` : ""}`)}
                  className="mt-2 text-sm text-blue-600 hover:underline"
                >
                  View Product
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Affiliate Shared Products */}
      {affiliateProducts.length > 0 && (
        <div className="max-w-5xl mx-auto mt-8">
          <h3 className="text-xl font-semibold mb-4">Shared by Affiliate</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {affiliateProducts.map((prod) => (
              <div key={prod._id} className="bg-white p-4 rounded shadow">
                <img
                  src={prod.photo}
                  alt={prod.name}
                  className="w-full h-40 object-cover rounded mb-2"
                />
                <h4 className="font-semibold text-gray-800">{prod.name}</h4>
                <p className="text-sm text-gray-600 mb-1">{prod.description}</p>
                <p className="text-sm font-bold text-gray-700">₱{prod.price}</p>
                <button
                  onClick={() => navigate(`/product/public/${prod._id}${refCode ? `?ref=${refCode}` : ""}`)}
                  className="mt-2 text-sm text-blue-600 hover:underline"
                >
                  View Product
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Toast Message */}
      {message.message && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-white px-4 py-2 rounded shadow border">
          <p className={`text-sm ${message.type === "failed" ? "text-red-600" : "text-green-600"}`}>
            {message.message}
          </p>
        </div>
      )}
    </div>


    </div>
   
  );
};

export default PublicProductMerged;
