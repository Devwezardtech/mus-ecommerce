import React, { useEffect, useState } from "react";
import { useAuth } from "../../../contexts/AuthContect";
import Message from "../../message";
import HeaderAdmin from "../../../layouts/headeradmin";

const DeliveryHome = () => {
  const { user } = useAuth();
  const [message, setMessage] = useState({ message: "", type: "" });

  useEffect(() => {
    if (user) {
      setMessage({ /* message: `Welcome back, ${user.email}`, type: "success" */});
    }
  }, [user]);

  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Header */}
      <div className="fixed w-full z-50">
              <HeaderAdmin />
            </div>
      <div className="pt-20 bg-blue-600 text-white px-6 py-4 shadow-md">
        <h1 className="text-2xl font-bold">🚚 Delivery Dashboard</h1>
        <p className="text-sm">Manage your delivery tasks here</p>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        {message.message && (
          <div className="mb-4">
            <Message message={message.message} type={message.type} />
          </div>
        )}

        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-lg font-semibold mb-2">Assigned Deliveries</h2>
            <p className="text-gray-600">View and track your assigned orders.</p>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-lg font-semibold mb-2">Completed Deliveries</h2>
            <p className="text-gray-600">Check your delivery history.</p>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-lg font-semibold mb-2">Profile</h2>
            <p className="text-gray-600">Update your details and settings.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeliveryHome;
