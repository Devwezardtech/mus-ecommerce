import { useEffect, useState } from "react";
import api from "../../api/axios";
import HeaderSeller from "./HeaderSeller";
import { useAuth } from "../../contexts/AuthContect";

const SellerProfileMain = () => {
  const { user } = useAuth();

  const [seller, setSeller] = useState(null);
  const [form, setForm] = useState({
    bio: "",
    contact: "",
    address: "",
  });

  const [showEdit, setShowEdit] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch seller profile
  useEffect(() => {
    const fetchSeller = async () => {
    
        const res = await api.get("/seller/me");
        setSeller(res.data);
        setForm({
          bio: res.data.bio || "",
          contact: res.data.contact || "",
          address: res.data.address || "",
        });
      
        setLoading(false);
      
    };

    fetchSeller();
  }, []);

  // Save profile
  const saveProfile = async () => {
    
      const res = await api.put("/seller/me", form);
      setSeller(res.data);
      setShowEdit(false);
   
  };

  // Loading & error states
  if (loading)
    return <p className="text-center mt-32 text-gray-600">Loading profile...</p>;

  return (
    <div>
      <div className="fixed w-full z-50">
        <HeaderSeller />
      </div>

      <div className="pt-20 min-h-screen bg-gray-50 flex justify-center">
        <div className="w-full max-w-4xl bg-white rounded-2xl shadow p-8">

          {/* Profile Header */}
          <div className="flex items-center gap-6 mb-6">
            <img
              src={seller.avatar || "https://via.placeholder.com/100"}
              alt="Seller Avatar"
              className="w-24 h-24 rounded-full object-cover border"
            />

            <div>
              <h3 className="text-xl font-semibold">{user?.name}</h3>
              <p className="text-sm text-gray-600">{user?.role}</p>
              <p className="text-sm text-gray-600 italic">
                {seller.address || "No address provided"}
              </p>
            </div>
          </div>

          {/* About */}
          <div className="mb-6">
            <h4 className="font-semibold text-gray-700 mb-2">About Seller</h4>
            <p className="text-gray-600">
              {seller.bio || "No bio yet"}
            </p>
          </div>

          {/* Contact */}
          <div className="mb-8">
            <h4 className="font-semibold text-gray-700 mb-2">Contact</h4>
            <p className="text-gray-600">
              {seller.contact || "No contact info"}
            </p>
          </div>

          {/* Edit Button */}
          <div className="text-right">
            <button
              onClick={() => setShowEdit(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Edit Profile
            </button>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {showEdit && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Edit Profile</h3>

            <label className="block mb-2 text-sm font-medium">Bio</label>
            <textarea
              value={form.bio}
              onChange={(e) => setForm({ ...form, bio: e.target.value })}
              className="w-full border rounded-md p-2 mb-4"
            />

            <label className="block mb-2 text-sm font-medium">Contact</label>
            <input
              type="text"
              value={form.contact}
              onChange={(e) => setForm({ ...form, contact: e.target.value })}
              className="w-full border rounded-md p-2 mb-4"
            />

            <label className="block mb-2 text-sm font-medium">Address</label>
            <input
              type="text"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              className="w-full border rounded-md p-2 mb-6"
            />

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowEdit(false)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={saveProfile}
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
