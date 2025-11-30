import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import { useNavigate } from "react-router-dom";
import Message from "../message";

const FrontDisplay = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [products, setProducts] = useState([]);
  const [message, setMessage] = useState({ message: "", type: "" });
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const showMessage = (msg, type) => {
    setMessage({ message: msg, type });
    setTimeout(() => setMessage({ message: "", type: "" }), 2000);
  };

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get("/api/products/categories");
        const cats = Array.isArray(res.data) ? res.data : res.data.categories || [];
        setCategories(cats);
        if (cats.length > 0) setSelectedCategory(cats[0]._id);
      } catch (error) {
        console.error("Failed to load categories:", error);
        setCategories([]);
      }
    };
    fetchCategories();
  }, []);

  // Fetch random products by category
  useEffect(() => {
    if (!selectedCategory) return;

    const fetchProducts = async () => {
      try {
        setLoading(true);
        const timestamp = Date.now(); // prevent caching
        const res = await api.get(
          `/api/products?category=${selectedCategory}&random=true&_=${timestamp}`,
          { headers: { "Cache-Control": "no-cache" } }
        );
        const prods = Array.isArray(res.data) ? res.data : res.data.products || [];
        setProducts(prods);
      } catch (error) {
        console.error("Error fetching products:", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [selectedCategory]);

  // Add to Cart
  const handleAddToCart = () => {
      showMessage("You can login first");
    
  };

  // Buy product
  const handleBuy = () => {
     showMessage("You can login first");
  };

  return (
    <div className="min-h-screen py-8 flex flex-col lg:flex-row gap-8">

      {/* DESKTOP CATEGORY SIDEBAR */}
      <div className="hidden md:block">
        <div className="bg-white rounded-xl shadow-md w-64 p-5">
          <h2 className="text-lg font-semibold mb-4 text-gray-700 border-b pb-2">🛒 Categories</h2>
          <ul className="space-y-2">
            {categories.length > 0 ? (
              categories.map((cat) => (
                <li
                  key={cat._id}
                  onClick={() => setSelectedCategory(cat._id)}
                  className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all
                    ${
                      selectedCategory === cat._id
                        ? "bg-blue-100 text-blue-700 font-semibold shadow-sm"
                        : "hover:bg-gray-100 text-gray-700"
                    }`}
                >
                  {cat.name}
                </li>
              ))
            ) : (
              <p className="text-gray-400 text-sm">No categories found</p>
            )}
          </ul>
        </div>
      </div>

      {/* MOBILE CATEGORY SCROLL */}
      <div className="lg:hidden w-full overflow-x-auto whitespace-nowrap px-2 py-3 shadow-sm sticky top-0 z-20 scrollbar-hide">
        <div className="flex gap-2">
          {categories.length > 0 ? (
            categories.map((cat) => (
              <button
                key={cat._id}
                onClick={() => setSelectedCategory(cat._id)}
                className={`px-4 py-2 rounded-xl text-sm border transition
                  ${
                    selectedCategory === cat._id
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-gray-100 text-gray-700 border-gray-300"
                  }`}
              >
                {cat.name}
              </button>
            ))
          ) : (
            <p className="text-gray-400 text-sm">No categories</p>
          )}
        </div>
      </div>

      {/* RIGHT SIDE - PRODUCTS */}
      <div className="flex-1">
        <h4 className="text-lg font-bold mb-6 text-gray-600">
          {categories.find((c) => c._id === selectedCategory)?.name || "Products"}
        </h4>

        {/* Skeleton loader */}
        {loading ? (
          <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 mt-5 gap-4 py-8 lg:mt-16">
            {Array.from({ length: 32 }).map((_, index) => (
              <div
                key={index}
                className="bg-gray-200 rounded shadow animate-pulse p-1 space-y-1 lg:space-y-4 lg:p-4"
              >
                <div className="h-28 bg-gray-300 rounded lg:h-48"></div>
                <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                <div className="h-4 bg-gray-300 rounded w-5/6"></div>
                <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                <div className="flex justify-between mx-1 gap-1 lg:mt-2 ">
                  <div className="h-5 w-20 bg-gray-300 lg:h-8 rounded"></div>
                  <div className="h-5 w-20 bg-gray-300 lg:h-8 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <p className="text-gray-500">No products found for this category.</p>
        ) : (
          <div className="pt-4 sm:pt-8 md:pt-4 lg:pt-4">
            <div className="grid gap-4 px-1 py-4 grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {products.map((product) => (
                <div key={product._id}>
                  <div className="bg-gray-250 mb-4 pb-2 flex flex-col rounded shadow-md hover:shadow-lg transition-shadow duration-300 gap-2 w-auto h-auto">
                    <button onClick={() => navigate(`/products/${product._id}`)}>
                      <div className="flex flex-col items-center justify-center">
                        <img
                          src={Array.isArray(product.photo) ? product.photo[0] : product.photo}
                          alt={product.name}
                          className="h-28 w-28 object-cover rounded shadow sm:h-32 sm:w-32 md:h-40 md:w-40 lg:h-60 lg:w-60"
                        />
                        <div>
                          <strong className="text-gray-800 text-sm font-semibold sm:text-base md:text-md lg:text-lg">
                            {product.name}
                          </strong>
                          <p className="text-xs">{product.description}</p>
                          <p>
                            <strong className="text-sm font-semibold sm:text-base md:text-md lg:text-lg">
                              ₱{product.price.toLocaleString()}
                            </strong>
                          </p>
                          <p className="text-sx text-sm text-gray-500 sm:text-sm md:text-sm lg:text-md">
                            Stock: {product.stock}
                          </p>
                        </div>
                      </div>
                    </button>

                    <div className="flex items-center justify-center gap-1">
                      <button
                        onClick={() => handleAddToCart(product._id)}
                        className="bg-blue-500 text-white text-sm rounded hover:bg-blue-600 sm:text-base md:text-base lg:text-md"
                      >
                        <span className="block sm:hidden md:hidden px-1">CART</span>
                        <span className="hidden sm:block px-1">ADD TO CART</span>
                      </button>
                      <button
                        onClick={() => handleBuy(product)}
                        className="px-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 sm:text-base md:text-base lg:text-md"
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

      {/* MESSAGE */}
      <div className="flex justify-center item-center">
        {message.message && <Message message={message.message} type={message.type} />}
      </div>
    </div>
  );
};

export default FrontDisplay;
