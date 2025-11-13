import { useAuth } from "../../contexts/AuthContect";
import HeaderSeller from "./HeaderSeller";
import { useState } from "react";

const SellerProfileMain = () => {
  const { user } = useAuth();
  const [bio, setBio] = useState("Welcome to my shop! We sell quality products with care.");
  const [contact, setContact] = useState("seller@email.com");
  const [address, setAddress] = useState("Cebu City, Philippines");
  const [stats] = useState({
    products: 18,
    sales: 126,
    rating: 4.8,
  });
  const [joinedDate] = useState("March 2024");
  const [lastActive] = useState("5 mins ago");
  const [showEditModal, setShowEditModal] = useState(false);

  const Edit = () => {
    setShowEditModal(true);
  };

  const saveEdit = () => {
    setShowEditModal(false);
    alert("Profile updated successfully!");
  };

  return (
    <div>
      <div className="fixed w-full z-50">
        <HeaderSeller />
      </div>

      <div className="pt-16 min-h-screen bg-gray-50 flex justify-center">
        <div className="w-full max-w-4xl bg-white rounded-2xl shadow p-8">
          {/* Header */}
          <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-3">
            Seller Profile
          </h2>

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
              <p className="text-xs text-gray-500 mt-1">
                Joined: {joinedDate} | Last Active: {lastActive}
              </p>
            </div>
          </div>

          {/* Bio Section */}
          <div className="mb-6">
            <h4 className="font-semibold text-gray-700 mb-2">About Seller</h4>
            <p className="text-gray-600">{bio}</p>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-3 gap-4 mb-8">
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

          {/* Recent Products */}
          <div className="mb-8">
            <h4 className="font-semibold text-gray-700 mb-3">Recent Products</h4>
            <div className="grid grid-cols-3 gap-4">
              {["Shoes", "Watch", "Bag"].map((item, index) => (
                <div
                  key={index}
                  className="bg-gray-100 rounded-lg p-4 text-center hover:shadow-md transition"
                >
                  <img
                    src={`https://via.placeholder.com/100?text=${item}`}
                    alt={item}
                    className="w-full h-24 object-cover rounded-md mb-2"
                  />
                  <p className="font-medium text-gray-700">{item}</p>
                  <p className="text-sm text-gray-500">₱{(index + 1) * 500}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Feedback Section */}
          <div className="mb-8">
            <h4 className="font-semibold text-gray-700 mb-3">Customer Feedback</h4>
            <div className="space-y-3">
              <div className="p-3 bg-gray-100 rounded-lg">
                <p className="text-sm text-gray-800">
                  ⭐⭐⭐⭐⭐ “Great products and fast delivery!”
                </p>
              </div>
              <div className="p-3 bg-gray-100 rounded-lg">
                <p className="text-sm text-gray-800">
                  ⭐⭐⭐⭐ “Good quality, will order again.”
                </p>
              </div>
            </div>
          </div>

          {/* Contact Info */}
          <div className="mb-8">
            <h4 className="font-semibold text-gray-700 mb-2">Contact Information</h4>
            <p className="text-gray-600">{contact}</p>
          </div>

          {/* Edit Profile Button */}
          <div className="text-right">
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
              onClick={Edit}
            >
              Edit Profile
            </button>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Edit Profile</h3>

            <label className="block mb-2 text-sm font-medium">Bio</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full border rounded-md p-2 mb-4"
            />

            <label className="block mb-2 text-sm font-medium">Contact</label>
            <input
              type="text"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              className="w-full border rounded-md p-2 mb-4"
            />

            <label className="block mb-2 text-sm font-medium">Address</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full border rounded-md p-2 mb-4"
            />

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowEditModal(false)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={saveEdit}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SellerProfileMain;
