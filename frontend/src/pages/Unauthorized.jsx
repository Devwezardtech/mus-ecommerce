import { useNavigate } from "react-router-dom";

const Unauthorized = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-100 px-4">
      <div className="bg-white w-full max-w-md rounded-xl shadow-lg p-8 text-center">
        
        {/* Icon */}
        <div className="text-5xl mb-4">🚫</div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Access Denied
        </h1>

        {/* Message */}
        <p className="text-gray-600 mb-1">
          You don’t have permission to access this page.
        </p>
        <p className="text-sm text-gray-500 mb-6">
          Please login with the correct account or return home.
        </p>

        {/* Actions */}
        <div className="flex gap-3 justify-center">
          <button
            onClick={() => navigate("/")}
            className="px-5 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition"
          >
            Go Home
          </button>

          <button
            onClick={() => navigate(-1)}
            className="px-5 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;
