import { useState, useEffect } from "react";
import api from "../api/axios";
import HeaderAdmin from "../layouts/headeradmin";
import Message from "./message";


const AdminDashboard = () => {
  const [products, setProduct] = useState([]);
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
      fetchProducts(); // Refresh list
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
     

    <div className="bg-white-200 flex flex-col items-center justify-center" >
      <div className="w-full sm:max-w-full md:max-w-full lg:max-w-full mt-14 sm:mt-16 md:mt-20 lg:mt-20 lg:px-14">


{products.length === 0 ? (
  <div className="overflow-x-aut">
    <table className="min-w-full md:min-w-full lg:min-w-full divide-y divide-gray-200 text-sm lg:text-md">
      <thead className="bg-gray-50">
        <tr>
          <th className="text-left font-semibold text-gray-700 px-2 py-1 lg:px-4 lg:py-3">Image</th>
          <th className="lg:text-left sm:text-center md:text-left font-semibold text-gray-700 px-2 py-1 lg:px-4 lg:py-3">Name</th>
          <th className="text-left font-semibold text-gray-700 px-2 py-1 lg:px-4 lg:py-3">Description</th>
          <th className="px-4 py-3 text-left font-semibold text-gray-700">Price</th>
          <th className="font-semibold text-gray-700 px-2 py-1 lg:px-4 lg:py-3">Actions</th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-100">
        {[...Array(15)].map((_, index) => (
          <tr key={index} className="hover:bg-gray-50 animate-pulse">
            {/* Image */}
            <td className="px-2 py-1 md:px-4 md:py-2 lg:px-4 lg:py-2">
              <div className="w-10 h-10 md:w-20 md:h-20 lg:w-20 lg:h-20 bg-gray-200 rounded"></div>
            </td>

            {/* Name */}
            <td className="px-4 py-2">
              <div className="h-4 w-12 md:w-24 lg:w-32 bg-gray-200 rounded"></div>
            </td>

            {/* Description */}
            <td className="px-4 py-2">
              <div className="h-4 w-12 md:w-28 lg:w-40 bg-gray-200 rounded"></div>
            </td>

            {/* Price */}
            <td className="px-4 py-2">
              <div className="h-4 w-12 md:w-16 lg:w-20 bg-gray-200 rounded"></div>
            </td>

            {/* Actions */}
            <td className="px-2 text-center space-x-1">
              <div className="inline-block w-12 h-6 bg-gray-200 rounded"></div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
) : (
  <div className="overflow-x-auto">
    <table className="min-w-full md:min-w-full lg:min-w-full divide-y divide-gray-200 text-sm lg:text-md">
      <thead className="bg-gray-50">
        <tr>
          <th className="text-left font-semibold text-gray-700 px-2 py-1 lg:px-4 lg:py-3">Image</th>
          <th className="lg:text-left sm:text-center md:text-left font-semibold text-gray-700 px-2 py-1 lg:px-4 lg:py-3">Name</th>
          <th className="text-left font-semibold text-gray-700 px-2 py-1 lg:px-4 lg:py-3">Description</th>
          <th className="px-4 py-3 text-left font-semibold text-gray-700">Price</th>
          <th className="font-semibold text-gray-700 px-2 py-1 lg:px-4 lg:py-3 ">Actions</th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-100">
        {products.map((product) => (
          <tr key={product._id} className="hover:bg-gray-50">
            <td className="px-2 py-1 md:px-4 md:py-2 lg:px-4 lg:py-2">
              <img
                src={product.photo}
                alt={product.name}
                className="w-10 h-10 object-cover rounded md:w-20 md:h-20 lg:w-20 lg:h-20"
              />
            </td>

            {/**
             * display for products name
             */}
            <td className="px-4 py-2 font-medium"> 
   <span className="block md:hidden">
    {product.name.length > 6 ? product.name.slice(0, 6) + "..." : product.name}
  </span>

  <span className="hidden md:block lg:hidden">
    {product.name.length > 15 ? product.name.slice(0, 15) + "..." : product.name}
  </span>

  <span className="hidden lg:block">
    {product.name.length > 30 ? product.name.slice(0, 30) + "..." : product.name}
  </span>
            </td>

             {/**
             * display for description
             */}
            <td className="px-4 py-2 font-medium">
  <span className="block md:hidden">
    {product.description.length > 6 ? product.description.slice(0, 6) + "..." : product.description}
  </span>

  <span className="hidden md:block lg:hidden">
    {product.description.length > 15 ? product.description.slice(0, 15) + "..." : product.description}
  </span>

  <span className="hidden lg:block">
    {product.description.length > 30 ? product.description.slice(0, 30) + "..." : product.description}
  </span>
</td>


            
            {/**
             * for price
             */}
             <td className="px-4 py-2 font-semibold">
  <span className="block md:hidden">
    ₱{product.price.toString().length > 4 
      ? product.price.toString().slice(0, 4) + "..." 
      : product.price}
  </span>

  <span className="hidden md:block lg:hidden">
    ₱{product.price.toString().length > 8 
      ? product.price.toString().slice(0, 8) + "..." 
      : product.price}
  </span>

  <span className="hidden lg:block">
    ₱{product.price}
  </span>
</td>


            <td className="px-2 text-center space-x-1">
              <button
                onClick={() => handleDelete(product._id)}
                className="px-1 py-1 bg-red-400 text-white rounded w-16 hover:bg-red-500"
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
