import { useState, useEffect } from "react";
import api from "../../api/axios";
import HeaderAdmin from "../../layouts/headeradmin"

const AllUsers = () => {

    const [allUsers, setAllUsers] = useState({ users: [], sellers: [], affiliates: [] });
   const [selectedTab, setSelectedTab] = useState("users"); // which tab is active

    const fetchAllUsers = async () => {
  try {
    const token = localStorage.getItem("token");
    const res = await api.get("/auth/all-users", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setAllUsers(res.data);
  } catch (err) {
    console.error("Error fetching users:", err);
  }
};

 useEffect(() => {

     fetchAllUsers(); //for fetching all users
  }, []);
   


   return (
      <div>
         <div className="fixed w-full z-50 top-0">
        <HeaderAdmin />
      </div>
      <div className="pt-14 sm:pt-16 md:pt-20 lg:pt-20">
         <div className="md:flex md:justify-between md:items-center md:gap-4 px-4">
         <div className="flex my-4 justify-center md:justify-start md:flex-col md:w-1/4">
  {["users", "sellers", "affiliates"].map((role) => (
    <button
      key={role}
      onClick={() => setSelectedTab(role)}
      className={`px-4 py-2 rounded ${
        selectedTab === role ? "bg-gray-700 text-white" : "bg-gray-300 text-black"
      }`}
    >
      {role.charAt(0).toUpperCase() + role.slice(1)}
    </button>
  ))}
</div>

{allUsers[selectedTab].length === 0 ? (
   <div className="overflow-x-auto rounded-lg border mb-6 md:w-3/4 lg:w-2/3 mx-auto">
  <table className="min-w-full divide-y divide-gray-200 text-sm">
    <thead className="bg-gray-100">
      <tr>
        <th className="px-4 py-3 text-left font-semibold text-gray-700">Name</th>
        <th className="px-4 py-3 text-left font-semibold text-gray-700">Email</th>
        <th className="px-4 py-3 text-left font-semibold text-gray-700">Role</th>
      </tr>
    </thead>
    <tbody className="bg-white divide-y divide-gray-100">
      <tr>
        <td colSpan="3" className="text-center text-gray-500 py-4">
          No {selectedTab} found.
        </td>
      </tr>
    </tbody>
  </table>
</div>

) : (
  <div className="overflow-x-auto rounded-lg border mb-6 md:w-3/4 lg:w-2/3 mx-auto">
    <table className="min-w-full divide-y divide-gray-200 text-sm">
      <thead className="bg-gray-100">
        <tr>
          <th className="px-4 py-3 text-left font-semibold text-gray-700">Name</th>
          <th className="px-4 py-3 text-left font-semibold text-gray-700">Email</th>
          <th className="px-4 py-3 text-left font-semibold text-gray-700">Role</th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-100">
        {allUsers[selectedTab].map((user) => (
          <tr key={user._id} className="hover:bg-gray-50">
            <td className="px-4 py-2">{user.name}</td>
            <td className="px-4 py-2">{user.email}</td>
            <td className="px-4 py-2 capitalize">{user.role}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)}

      </div>
      </div>
      </div>
   )
}

export default AllUsers;