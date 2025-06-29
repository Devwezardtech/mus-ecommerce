import { useAuth } from "../../contexts/AuthContect";
import HeaderSeller from "./HeaderSeller";

const SellerProfileMain = () => {
  const { user } = useAuth();

  return (
    <div>
      <div className="fixed w-full z-50">
        <HeaderSeller />
      </div>
      <div className="pt-20 p-6 min-h-screen bg-gray-100">
        <div className="max-w-md mx-auto bg-white shadow-md rounded p-6">
          <h2 className="text-2xl font-bold mb-4">Seller Profile</h2>
          <p><strong>Name:</strong> {user?.name}</p>
          <p><strong>Email:</strong> {user?.email}</p>
          <p><strong>Role:</strong> {user?.role}</p>
          <p><strong>ID:</strong> {user?._id}</p>
        </div>
      </div>
    </div>
  );
};

export default SellerProfileMain;
