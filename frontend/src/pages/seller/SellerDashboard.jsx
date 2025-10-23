import { useState, useEffect } from "react";
import api from "../../api/axios";
import Message from "../message";
import HeaderSeller from "./HeaderSeller";

const SellerDashboard = () => {
  const [newProducts, setNewProducts] = useState({ name: "", description: "", price: "", stock: "", commission: "", photo: null, photoId:"" });
  const [photo, setPhoto] = useState(null);
  const [preview, setPreview] = useState(null);
  const [products, setProducts] = useState([]);
  const [editingProductId, setEditingProductId] = useState(null);
  const [create, setCreate] = useState(false);

  const [showDelete, setShowDelete] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [message, setMessage] = useState({ message: "", type: "" });

  const showMessage = (message, type) => {
    setMessage({ message, type });
    setTimeout(() => {
      setMessage({ message: "", type: "" });
    }, 2000);
  };

  const fetchProducts = async () => {
    try {
      showMessage("Loading...", "loading");
      const res = await api.get("/api/products");
      setProducts(Array.isArray(res.data) ? res.data : res.data.products || []);
    } catch (error) {
      console.error("Failed to fetch products:", error.message);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

const handleSubmit = async (e) => {
  e.preventDefault();

  if (!newProducts.name || !newProducts.description || !newProducts.price) {
    showMessage("All fields are required.", "failed");
    return;
  }

  let imageUrl = newProducts.photo;
  let publicId = newProducts.photoId;

  if (photo) {
    const cloudData = new FormData();
    cloudData.append("file", photo);
    cloudData.append("upload_preset", "ecommerce_preset");

    try {
      const uploadRes = await fetch("https://api.cloudinary.com/v1_1/dawfelvee/image/upload", {
        method: "POST",
        body: cloudData,
      });

      if (!uploadRes.ok) throw new Error("Image upload failed");

      const uploadData = await uploadRes.json();

      if (!uploadData.secure_url) {
        showMessage("Failed to get uploaded image URL.", "failed");
        return;
      }

      imageUrl = uploadData.secure_url;
      publicId = uploadData.public_id;
    } catch (uploadError) {
      console.error("Cloudinary upload error:", uploadError);
      showMessage("Image upload failed.", "failed");
      return;
    }
  }

  const token = localStorage.getItem("token");
  if (!token) {
    showMessage("You are not logged in.");
    return;
  }

  const url = editingProductId ? `/api/products/${editingProductId}` : "/api/products";
  const method = editingProductId ? "put" : "post";

  const payload = {
  name: newProducts.name.trim(),
  description: newProducts.description.trim(),
  price: parseFloat(newProducts.price),
  stock: parseInt(newProducts.stock) || 0,
  commission: parseFloat(newProducts.commission) || 0.2,
  photo: imageUrl || newProducts.photo,
  photoId: publicId || newProducts.photoId,
};


  try {
    await api[method](url, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    showMessage(method === "put" ? "Updated" : "Created Successfully", "success");
    fetchProducts();
   setNewProducts({ 
  name: "", 
  description: "", 
  price: "", 
  stock: "", 
  commission: "", 
  photo: null, 
  photoId: "" 
});
    setPhoto(null);
    setPreview(null);
    setEditingProductId(null);
    setCreate(false);
  } catch (error) {
    console.error("Error submitting product:", error.message);
    showMessage("Failed to submit product.", "failed");
  }
};



  const handleCancel = () => {
  setCreate(false);
  setNewProducts({ name: "", description: "", price: "", stock: "", commission: "", photo: null, photoId: "" });
  setPhoto(null);
  setPreview(null);
  setEditingProductId(null);
  showMessage("Canceled");
};

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setPhoto(file);
    if (file) {
      setPreview(URL.createObjectURL(file));
    } else {
      setPreview(null);
    }
  };

  const handleEdit = (product) => {
    setNewProducts({
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      commission: product.commission,
      photo: product.photo,
      photoId: product.photoId,
    });
    setEditingProductId(product._id);
    setPreview(product.photo);
    setCreate(true);
  };

  const handleDelete = async (id) => {
    setDeleteId(id);
    setShowDelete(true);
  };

  const handleConfirm = async () => {
    if (!deleteId) return;

    try {
      const token = localStorage.getItem("token");
      await api.delete(`/api/products/${deleteId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      showMessage("Deleted Sucessfully", "success");
      fetchProducts();
    } catch (error) {
      console.error("Error deleting product:", error.message);
    }
    setShowDelete(false);
    setDeleteId(null);
  };

  const handleDeclien = () => {
    setShowDelete(false);
    setDeleteId(null);
    showMessage("Canceled");
  };

  return (
    <div>
       <div className="fixed w-full z-50">
        <HeaderSeller onAddProduct={() => setCreate(true)} />
      </div>

      {/* this line for modals*/}
      {showDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg mx-6">
            <p>Are you sure you want to delete this product?</p>
            <div className="mt-4 flex justify-end gap-2">
              <button onClick={handleDeclien} className="px-4 py-2 bg-blue-500 hover:bg-blue-400 text-white rounded">Cancel</button>
              <button onClick={handleConfirm} className="px-4 py-2 bg-red-500 text-white hover:bg-red-400 rounded">Delete</button>
            </div>
          </div>
        </div>
      )}
     
<div className="bg-white-200 flex flex-col">
    <div className="lg:px-20" >
      <div className="items-center justify-center">

      {create && (
  <div className="fixed inset-0 flex items-center flex-col justify-center bg-opacity-40 z-50">
    <div className="bg-gray-200 p-4 rounded-lg m-20">
       <div className="justify-center item-center flex m-2 justify-between">
        <div>
     <h2 className="font-semibold ">{editingProductId ? "Edit Product" : "Create Product"}</h2>
     </div>
     <button className="w-5 rounded text-white bg-gray-400 hover:bg-gray-200 hover:text-black" onClick={handleCancel}>X</button>
   </div>

    <form onSubmit={handleSubmit} className="flex flex-col gap-2 mb-6 ">
      <input
        className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        type="text"
        placeholder="  Name"
        value={newProducts.name}
        onChange={(e) => setNewProducts({ ...newProducts, name: e.target.value })}
      />
      <input
        className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        type="text"
        placeholder="  Description"
        value={newProducts.description}
        onChange={(e) => setNewProducts({ ...newProducts, description: e.target.value })}
      />
      <input
       className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        type="number"
        placeholder="  Price"
        value={newProducts.price}
        onChange={(e) => setNewProducts({ ...newProducts, price: e.target.value })}
      />

      <input
  className="w-full px-2 py-1 border border-gray-300 rounded"
  type="number"
  placeholder="Stock (quantity)"
  value={newProducts.stock}
  onChange={(e) => setNewProducts({ ...newProducts, stock: e.target.value })}
/>


      <input
  className="w-full px-2 py-1 border border-gray-300 rounded"
  type="number"
  step="0.01"
  placeholder="Commission (e.g. 0.2 for 20%)"
  value={newProducts.commission || ""}
  onChange={(e) => setNewProducts({ ...newProducts, commission: e.target.value })}
/>

      <input 
      type="file" accept="image/*" onChange={handleImageChange} />
      <div className="flex m-4 justify-center item-center">
        {preview && <img 
        className="rounded max-w-md shadow-lg w-60  hover:shadow-sm"
        src={preview} alt="Preview" />}
        </div>
      
      <div className="justify-center text-center item-center">
        <button type="submit" className=" w-40 bg-gray-500 hover:text-black text-white px-4 py-2 rounded hover:bg-gray-400">
        {editingProductId ? "Update" : "Create"}
       
      </button>
      </div>
      
    </form>
    </div>
  
  </div>
)}
</div>


<div className="bg-white-200 flex flex-col" >
      <div className="w-full sm:max-w-full md:max-w-full lg:max-w-full mt-14 sm:mt-16 md:mt-20 lg:mt-20"></div>
      
{products.length === 0 ? (
  <div className="overflow-x-aut">
    <table className="w-full min-w-full md:min-w-full lg:min-w-full divide-y divide-gray-200 text-sm lg:text-md">
      <thead className="bg-gray-50 ">
        <tr>
          <th className="text-left font-semibold text-gray-700 px-2 py-1 lg:px-4 lg:py-3">Image</th>
          <th className="lg:text-left sm:text-center md:text-left font-semibold text-gray-700 px-2 py-1 lg:px-4 lg:py-3">Name</th>
          <th className="text-left font-semibold text-gray-700 px-2 py-1 lg:px-4 lg:py-3">Description</th>
          <th className="px-2 py-1 text-left font-semibold text-gray-700">Price</th>
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
          <th className="text-center font-semibold text-gray-700 px-2 py-1 lg:px-4 lg:py-3">Image</th>
          <th className="lg:text-left sm:text-center md:text-left font-semibold text-gray-700 px-2 py-1 lg:px-4 lg:py-3">Name</th>
          <th className="text-left font-semibold text-gray-700 px-2 py-1 lg:px-4 lg:py-3">Description</th>
          <th className="px-2 py-1 text-left font-semibold text-gray-700">Price</th>
          <th className="font-semibold text-gray-700 px-1 py-1 lg:px-4 lg:py-3 ">Actions</th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-100">
        {products.map((product) => (
          <tr key={product._id} className="hover:bg-gray-50">
            <td className="pl-4 px-2 py-1 md:px-4 md:py-2 lg:px-4 lg:py-2">
              <img
                src={product.photo}
                alt={product.name}
                className="w-10 h-10 object-cover rounded md:w-20 md:h-20 lg:w-20 lg:h-20"
              />
            </td>

            {/**
             * display for products name
             */}
            <td className="px-2 py-1 font-medium"> 
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
            <td className="px-2 py-1 font-medium">
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
             <td className=" px-2 py-1 font-semibold">
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


           <td className="left-0 px-2 py-1 pb-5 text-center space-y-2 space-x-1 ">
  <button
    onClick={() => handleEdit(product)}
    className="px-2 py-1 bg-blue-500 text-white rounded w-16 hover:bg-blue-600 ml-1"
  >
    Edit
  </button>
  <button
    onClick={() => handleDelete(product._id)}
    className="ml-2 px-2 py-1 bg-red-500 text-white rounded w-16 hover:bg-red-600"
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
     </div>
  );
};

export default SellerDashboard;
