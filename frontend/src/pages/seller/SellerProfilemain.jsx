import { useAuth } from "../../contexts/AuthContect";
import HeaderSeller from "./HeaderSeller";
import { useState } from "react";

const SellerProfileMain = () => {
  const { user } = useAuth();
  const [bio ] = useState("Welcome to my shop! We sell quality products with care.");
  const [contact ] = useState("seller@email.com");
  const [address] = useState("Cebu City, Philippines");
  const [stats] = useState({
    products: 18,
    sales: 126,
    rating: 4.8,
  });

  const Edit = () => {
    
  }

  return (
    <div>
      <div className="fixed w-full z-50">
        <HeaderSeller />
      </div>

      <div className="pt-16 min-h-screen bg-gray-50 flex justify-center">
        <div className="w-full max-w-3xl bg-white rounded-2xl shadow p-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-3">Seller Profile</h2>

          {/* Profile Header */}
          <div className="flex items-center gap-6 mb-6">
            <img
              src="https://via.placeholder.com/100"
              alt="Seller Avatar"
              className="w-24 h-24 rounded-full object-cover border"
            />
            <div>
              <h3 className="text-xl font-semibold">{user?.name}</h3>
              <p className="text-sm text-gray-600">{user?.role}</p>
              <p className="text-sm text-gray-600 italic">{address}</p>
            </div>
          </div>

          {/* Bio Section */}
          <div className="mb-6">
            <h4 className="font-semibold text-gray-700 mb-2">About Seller</h4>
            <p className="text-gray-600">{bio}</p>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-gray-100 p-4 rounded-lg text-center">
              <p className="text-2xl font-bold text-gray-800">{stats.products}</p>
              <p className="text-sm text-gray-600">Products</p>
            </div>
            <div className="bg-gray-100 p-4 rounded-lg text-center">
              <p className="text-2xl font-bold text-gray-800">{stats.sales}</p>
              <p className="text-sm text-gray-600">Sales</p>
            </div>
            <div className="bg-gray-100 p-4 rounded-lg text-center">
              <p className="text-2xl font-bold text-gray-800">{stats.rating}</p>
              <p className="text-sm text-gray-600">Rating</p>
            </div>
          </div>

          {/* Contact Section */}
          <div className="mb-6">
            <h4 className="font-semibold text-gray-700 mb-2">Contact Information</h4>
            <p className="text-gray-600">{contact}</p>
          </div>

          {/* Edit Profile Button */}
          <div className="text-right">
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition" onClick={Edit}>
              
              Edit Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerProfileMain;
