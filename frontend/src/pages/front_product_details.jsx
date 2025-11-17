import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/axios";
import Message from "./message";
import HeaderFrontPage from "../layouts/headerfrontPage";

const FrontProductDetails = () => {
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

  // Fetch main product
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await api.get(`/api/products/public/${id}`);
        setProduct(res.data);
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };
    fetchProduct();
  }, [id]);

  // Fetch related products (after main product is loaded)
  useEffect(() => {
    const fetchRelated = async () => {
      if (!product) return; // wait until product is loaded
      try {
        const res = await api.get(`/api/products?category=${product.category}`);
        const related = Array.isArray(res.data)
          ? res.data.filter((p) => p._id !== product._id).slice(0, 4)
          : [];
        setRelatedProducts(related);
      } catch (error) {
        console.error("Error fetching related products:", error);
        setRelatedProducts([]);
      }
    };
    fetchRelated();
  }, [product]);

  if (!product) {
    return (
      <div>
        <div className="fixed w-full z-50">
          <HeaderFrontPage />
        </div>
        <div className="flex justify-center items-center h-screen text-gray-600">
          Loading product details...
        </div>
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
      state: [{ productId: product._id, quantity: 1, price: product.price }],
      total: product.price,
    });
  };

  const photos = Array.isArray(product.photo) ? product.photo : [product.photo];

  return (
    <div>
      <div className="fixed w-full z-50">
        <HeaderFrontPage />
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
  <div className="mt-12">
    <h2 className="text-2xl font-semibold mb-6 text-gray-800">Related Products</h2>
    <div className="grid gap-4 px-1 py-4 grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
      {relatedProducts.map((item) => (
        <div key={item._id} className="bg-white rounded shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col items-center p-2">
          <button
            onClick={() => navigate(`/products/${item._id}`)}
            className="flex flex-col items-center w-full"
          >
            <img
              src={Array.isArray(item.photo) ? item.photo[0] : item.photo}
              alt={item.name}
              className="h-28 w-28 object-cover rounded shadow sm:h-32 sm:w-32 md:h-40 md:w-40 lg:h-48 lg:w-48 mb-2"
            />
            <div className="text-center">
              <strong className="text-gray-800 text-sm sm:text-base md:text-md lg:text-lg font-semibold truncate">
                {item.name}
              </strong>
              <p className="text-xs sm:text-sm mt-1">{item.description}</p>
              <p className="text-blue-600 font-bold text-sm sm:text-base mt-1">₱{item.price}</p>
              <p className="text-gray-500 text-xs sm:text-sm mt-1">Stock: {item.stock}</p>
            </div>
          </button>
          <div className="mt-3 flex gap-2 w-full justify-center">
            <button
              onClick={(e) => { e.stopPropagation(); handleAddToCart(item); }}
              className="bg-blue-500 text-white px-2 py-1 text-xs sm:text-sm rounded hover:bg-blue-600 w-1/2"
            >
              Add to Cart
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); handleBuy(item); }}
              className="bg-green-500 text-white px-2 py-1 text-xs sm:text-sm rounded hover:bg-green-600 w-1/2"
            >
              Buy
            </button>
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

export default FrontProductDetails;
