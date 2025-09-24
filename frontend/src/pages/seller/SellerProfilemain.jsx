import { useAuth } from "../../contexts/AuthContect";
import HeaderSeller from "./HeaderSeller";

const SellerProfileMain = () => {
  const { user } = useAuth();

  return (
    <div>
      <div className="fixed w-full z-50">
        <HeaderSeller />
      </div>
      <div className="pt-20  min-h-screen bg-white">
        <div className="max-w-full bg-white rounded px-10">
          <h2 className="text-lg font-semibold mb-4">Seller Profile</h2>
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
