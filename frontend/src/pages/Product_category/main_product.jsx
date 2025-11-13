import React, { useState } from "react";

const categories = [
  { name: "Electronics", icon: "💻" },
  { name: "Fashion", icon: "👕" },
  { name: "Beauty & Care", icon: "💅" },
  { name: "Home & Kitchen", icon: "🏠" },
  { name: "Sports & Outdoors", icon: "🏃‍♂️" },
];

const products = {
  Electronics: [
    {
      name: "iPhone 15 Pro Max",
      price: "₱85,990",
      image: "https://via.placeholder.com/150?text=iPhone+15+Pro",
    },
    {
      name: "MacBook Air M3",
      price: "₱72,990",
      image: "https://via.placeholder.com/150?text=MacBook+Air+M3",
    },
    {
      name: "Sony WH-1000XM5",
      price: "₱17,990",
      image: "https://via.placeholder.com/150?text=Sony+Headphones",
    },
  ],
  Fashion: [
    {
      name: "Oversized Graphic T-Shirt",
      price: "₱499",
      image: "https://via.placeholder.com/150?text=T-Shirt",
    },
    {
      name: "White Sneakers",
      price: "₱1,299",
      image: "https://via.placeholder.com/150?text=Sneakers",
    },
    {
      name: "Floral Summer Dress",
      price: "₱799",
      image: "https://via.placeholder.com/150?text=Dress",
    },
  ],
  "Beauty & Care": [
    {
      name: "Maybelline Fit Me Foundation",
      price: "₱399",
      image: "https://via.placeholder.com/150?text=Foundation",
    },
    {
      name: "Cetaphil Gentle Cleanser",
      price: "₱329",
      image: "https://via.placeholder.com/150?text=Cleanser",
    },
  ],
  "Home & Kitchen": [
    {
      name: "Rice Cooker",
      price: "₱2,499",
      image: "https://via.placeholder.com/150?text=Rice+Cooker",
    },
    {
      name: "Wall Clock",
      price: "₱699",
      image: "https://via.placeholder.com/150?text=Wall+Clock",
    },
  ],
  "Sports & Outdoors": [
    {
      name: "Yoga Mat",
      price: "₱599",
      image: "https://via.placeholder.com/150?text=Yoga+Mat",
    },
    {
      name: "Dumbbell Set",
      price: "₱1,499",
      image: "https://via.placeholder.com/150?text=Dumbbells",
    },
  ],
};

const ShopDisplay = () => {
  const [selectedCategory, setSelectedCategory] = useState("Electronics");

  return (
    <div className="bg-gray-50 min-h-screen py-8 px-6 flex flex-col lg:flex-row gap-8">
      {/* Left Sidebar - Categories */}
      <div className="bg-white rounded-xl shadow-md w-full lg:w-1/5 p-4">
        <h2 className="text-lg font-semibold mb-4 text-gray-700 border-b pb-2">
          🛒 Categories
        </h2>
        <ul className="space-y-2">
          {categories.map((cat, index) => (
            <li
              key={index}
              className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition ${
                selectedCategory === cat.name
                  ? "bg-blue-100 text-blue-600 font-semibold"
                  : "hover:bg-gray-100 text-gray-700"
              }`}
              onClick={() => setSelectedCategory(cat.name)}
            >
              <span className="text-xl">{cat.icon}</span> {cat.name}
            </li>
          ))}
        </ul>
      </div>

      {/* Right Side - Products */}
      <div className="flex-1">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">
          {selectedCategory}
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {products[selectedCategory]?.map((product, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow hover:shadow-lg transition p-3 cursor-pointer"
            >
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-40 object-cover rounded-md mb-3"
              />
              <h3 className="text-sm font-medium text-gray-800 mb-1 truncate">
                {product.name}
              </h3>
              <p className="text-blue-600 font-semibold">{product.price}</p>
              <button className="mt-3 w-full bg-blue-600 text-white py-1.5 rounded-lg hover:bg-blue-700 text-sm transition">
                Add to Cart
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ShopDisplay;
