import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/axios";
import Message from "./message";
import HeaderUser from "../layouts/headeruser";

const ProductDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [message, setMessage] = useState({ message: "", type: "" });

  const showMessage = (msg, type) => {
    setMessage({ message: msg, type });
    setTimeout(() => setMessage({ message: "", type: "" }), 2000);
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await api.get(`/api/products/public/${id}`);
        setProduct(res.data);

        // Fetch related products from same category
        const relatedRes = await api.get(`/api/products?category=${res.data.category}`);
        setRelatedProducts(
          relatedRes.data.filter((p) => p._id !== res.data._id).slice(0, 4)
        );
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };
    fetchProduct();
  }, [id]);

  if (!product) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-600">
        Loading product details...
      </div>
    );
  }

  const handleAddToCart = async () => {
    const token = localStorage.getItem("token");
    try {
      await api.post(
        "/api/cart",
        { productId: product._id, quantity: 1 },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      showMessage("Added to Cart", "success");
    } catch (error) {
      console.error("Add to cart error:", error.message);
      showMessage("Failed to add to cart", "error");
    }
  };

  const handleBuy = () => {
    navigate("/checkout", {
      state: { products: [{ productId: product._id, quantity: 1, price: product.price }], total: product.price },
    });
  };

  const photos = Array.isArray(product.photo) ? product.photo : [product.photo];

  return (
   <div>
      <div className="fixed w-full z-50" >
        <HeaderUser/>
      </div>

    <div className="max-w-6xl mx-auto px-4 md:px-6 py-8 pt-16">
      <button
        onClick={() => navigate(-1)}
        className="mb-6 bg-gray-200 px-4 py-2 rounded-lg hover:bg-gray-300"
      >
        ← Back
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Image section */}
        <div>
          <img
            src={photos[currentImageIndex]}
            alt={product.name}
            className="w-full h-96 object-cover rounded-xl shadow"
          />
          {photos.length > 1 && (
            <div className="flex gap-2 mt-2 justify-center">
              {photos.map((photo, idx) => (
                <img
                  key={idx}
                  src={photo}
                  alt={`thumbnail ${idx}`}
                  onClick={() => setCurrentImageIndex(idx)}
                  className={`w-16 h-16 object-cover rounded cursor-pointer border-2 ${
                    idx === currentImageIndex ? "border-blue-600" : "border-gray-200"
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Details section */}
        <div>
          <h1 className="text-3xl font-bold text-gray-800">{product.name}</h1>
          <p className="mt-2 text-gray-600 leading-relaxed">{product.description}</p>

          <div className="mt-4">
            <p className="text-2xl font-bold text-blue-600">₱{product.price}</p>
            <p className="text-gray-500">Stock: {product.stock}</p>
            <p className="text-gray-500">Commission: {product.commission || 0.2}</p>
          </div>

          <div className="mt-6 flex gap-4">
            <button
              onClick={handleAddToCart}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl"
            >
              Add to Cart
            </button>
            <button
              onClick={handleBuy}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl"
            >
              Buy Now
            </button>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="mt-16">
          <h2 className="text-xl font-semibold mb-4">Related Products</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {relatedProducts.map((p) => (
              <div
                key={p._id}
                onClick={() => navigate(`/product/${p._id}`)}
                className="bg-white rounded-lg shadow hover:shadow-lg cursor-pointer p-2"
              >
                <img
                  src={Array.isArray(p.photo) ? p.photo[0] : p.photo}
                  alt={p.name}
                  className="w-full h-40 object-cover rounded"
                />
                <div className="mt-2">
                  <p className="text-gray-800 font-semibold">{p.name}</p>
                  <p className="text-gray-500 text-sm">₱{p.price}</p>
                </div>
              </div>
            ))}
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

export default ProductDetails;
