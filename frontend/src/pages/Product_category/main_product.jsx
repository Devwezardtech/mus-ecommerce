import React, { useEffect, useState } from "react";
import api from "../../api/axios"; // adjust path as needed

const ShopDisplay = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalProduct, setModalProduct] = useState(null); // for modal

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

  // Fetch products by category
  useEffect(() => {
    if (!selectedCategory) return;

    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/api/products?category=${selectedCategory}`);
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

  return (
    <div className="bg-gray-50 min-h-screen py-8 px-6 flex flex-col lg:flex-row gap-8">
      {/* Left Sidebar */}
      <div className="bg-white rounded-xl shadow-md w-full lg:w-1/5 p-4">
        <h2 className="text-lg font-semibold mb-4 text-gray-700 border-b pb-2">
          🛒 Categories
        </h2>
        <ul className="space-y-2">
          {categories.length > 0 ? (
            categories.map((cat) => (
              <li
                key={cat._id}
                className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition ${
                  selectedCategory === cat._id
                    ? "bg-blue-100 text-blue-600 font-semibold"
                    : "hover:bg-gray-100 text-gray-700"
                }`}
                onClick={() => setSelectedCategory(cat._id)}
              >
                <span className="text-xl">📦</span> {cat.name}
              </li>
            ))
          ) : (
            <p className="text-gray-400 text-sm">No categories found</p>
          )}
        </ul>
      </div>

      {/* Right Side - Products */}
      <div className="flex-1">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">
          {categories.find((c) => c._id === selectedCategory)?.name || "Products"}
        </h2>

        {loading ? (
          <p>Loading products...</p>
        ) : products.length === 0 ? (
          <p className="text-gray-500">No products found for this category.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <div
                key={product._id}
                className="bg-white rounded-xl shadow hover:shadow-lg transition p-3 cursor-pointer"
                onClick={() => setModalProduct(product)} // open modal on click
              >
                <img
                  src={Array.isArray(product.photo) ? product.photo[0] : product.photo}
                  alt={product.name}
                  className="w-full h-40 object-cover rounded-md mb-3"
                />
                <h3 className="text-sm font-medium text-gray-800 mb-1 truncate">
                  {product.name}
                </h3>
                <p className="text-blue-600 font-semibold">
                  ₱{product.price.toLocaleString()}
                </p>
                <button className="mt-3 w-full bg-blue-600 text-white py-1.5 rounded-lg hover:bg-blue-700 text-sm transition">
                  Add to Cart
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal for multiple images */}
      {modalProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-4 shadow-lg w-full max-w-lg relative">
            <button
              onClick={() => setModalProduct(null)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl bg-gray-200 hover:bg-gray-300 rounded w-10"
            >
              ✕
            </button>

            <div className="overflow-x-auto flex gap-2 mb-4 py-2">
              {Array.isArray(modalProduct.photo) &&
                modalProduct.photo.map((imgUrl, index) => (
                  <img
                    key={index}
                    src={imgUrl}
                    alt={`${modalProduct.name}-${index}`}
                    className="h-48 w-48 object-cover rounded-lg flex-shrink-0"
                  />
                ))}
            </div>

            <h2 className="text-xl font-bold text-gray-800 mb-2">{modalProduct.name}</h2>
            <p className="text-gray-600">{modalProduct.description}</p>
            <p className="text-gray-800 font-bold mt-2">₱{modalProduct.price.toLocaleString()}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShopDisplay;
