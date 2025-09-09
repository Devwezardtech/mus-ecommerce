import { useState, useEffect } from "react";
import api from "../api/axios";
import HeaderAdmin from "../layouts/headeradmin";
import Message from "./message";


const AdminDashboard = () => {
  const [products, setProducts] = useState([]);
  const [showDelete, setShowDelete] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [message, setMessage] = useState({message: "", type: ""})
   
  //this alert message
    const showMessage = (message, type) => {
      setMessage({message, type});

      setTimeout(()=>{
        setMessage({message: "", type: ""});
      }, 2000)
    }



 

  // Fetch products
  const fetchProducts = async () => {
    try {
      showMessage("Loading...", "loading")
      const res = await api.get("/api/products");
      console.log("Fetched products:", res.data); // Debug
      setProducts(res.data);
    } catch (error) {
      console.error("Failed to fetch products:", error.message);
    }
  };

  useEffect(() => {
    fetchProducts();
  },[]);

  //modals for delete code line 113 to 145
    // Delete product modals show
  const handleDelete = async (id) => {
    setDeleteId(id);
    setShowDelete(true);
  };

   //confirm modals delete
  const handleConfirm = async () => {
    if(!deleteId) return;

      try {
      const token = localStorage.getItem("token");

       await api.delete(`/api/products/${deleteId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      showMessage("Deleted Sucessfully", "success")
      fetchProducts(); 
    } catch (error) {
      console.error("Error deleting product:", error.message);
    }
    setShowDelete(false);
    setDeleteId(null);
  };

  //declien or cancel modals delete
  const handleDeclien = () => {
    setShowDelete(false);
    setDeleteId(null);
    showMessage("Canceled")
  };

 

  return (
    <div>
       <div className="fixed w-full z-50">
        <HeaderAdmin />
      </div>

      {/* this line for modals*/}
      {showDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded shadow-lg">
            <p>Are you sure you want to delete this product?</p>
            <div className="mt-4 flex justify-end gap-2">
              <button onClick={handleDeclien} className="px-4 py-2 bg-gray-300 rounded">Cancel</button>
              <button onClick={handleConfirm} className="px-4 py-2 bg-red-500 text-white rounded">Delete</button>
            </div>
          </div>
        </div>
      )}
     

    <div className="bg-white-200 flex flex-col items-center justify-center p-4" >
      <div className="w-full max-w-5xl mt-14 sm:mt-16 md:mt-20 lg:mt-20">


{products.length === 0 ? (
  <div className="overflow-x-auto rounded-lg justify-center item-center shadow-sm bg-white w-full max-w-5xl animate-pulse" >
    <table className="min-w-full lg:min-w-60 mx-1 lg:mx-40 divide-y divide-gray-200 text-sm ">
      <thead className="bg-gray-100">
        <tr>
          <th className="px-4 py-3 text-left font-semibold text-gray-700">Image</th>
          <th className="px-4 py-3 text-left font-semibold text-gray-700">Name</th>
          <th className="px-4 py-3 text-left font-semibold text-gray-700">Description</th>
          <th className="px-4 py-3 text-left font-semibold text-gray-700">Price</th>
          <th className="px-4 py-3 text-right font-semibold text-gray-700">Actions</th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-100">
        {[...Array(12)].map((_, index) => (
          <tr key={index}>
            <td className="px-4 py-3">
              <div className="w-16 h-16 bg-gray-200 rounded"></div>
            </td>
            <td className="px-4 py-3">
              <div className="h-4 w-24 bg-gray-200 rounded"></div>
            </td>
            <td className="px-4 py-3">
              <div className="h-4 w-40 bg-gray-200 rounded"></div>
            </td>
            <td className="px-4 py-3">
              <div className="h-4 w-16 bg-gray-200 rounded"></div>
            </td>
            <td className="px-4 py-3 text-right">
              <div className="flex justify-end space-x-2">
                <div className="w-12 h-6 bg-gray-200 rounded"></div>
                <div className="w-12 h-6 bg-gray-200 rounded"></div>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
) : (
  <div className="overflow-x-auto rounded-lg border">
    <table className="min-w-full divide-y divide-gray-200 text-sm">
      <thead className="bg-gray-100">
        <tr>
          <th className="px-4 py-3 text-left font-semibold text-gray-700">Image</th>
          <th className="px-4 py-3 text-left font-semibold text-gray-700">Name</th>
          <th className="px-4 py-3 text-left font-semibold text-gray-700">Description</th>
          <th className="px-4 py-3 text-left font-semibold text-gray-700">Price</th>
          <th className="px-4 py-3 text-right font-semibold text-gray-700">Actions</th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-100">
        {products.map((product) => (
          <tr key={product._id} className="hover:bg-gray-50">
            <td className="px-4 py-2">
              <img
                src={product.photo}
                alt={product.name}
                className="w-20 h-20 object-cover rounded"
              />
            </td>
            <td className="px-4 py-2 font-medium">{product.name}</td>
            <td className="px-4 py-2">{product.description}</td>
            <td className="px-4 py-2 font-semibold">₱{product.price}</td>
            <td className="px-4 py-2 text-right space-x-2">
              <button
                onClick={() => handleDelete(product._id)}
                className="px-3 py-1 bg-gray-500 text-white rounded w-16 hover:bg-gray-300 hover:text-black"
              >
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)}
    </div>

    {/* show message */}
    <div className="flex justify-center item-center"> 
    {message.message && <Message message={message.message} type={message.type} />}
</div>
     </div>
     </div>
  );
};

export default AdminDashboard;
