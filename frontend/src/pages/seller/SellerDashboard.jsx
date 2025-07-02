import { useState, useEffect } from "react";
import axios from "axios";
import Message from "../message";
import HeaderSeller from "./HeaderSeller";

const SellerDashboard = () => {
  const [newProducts, setNewProducts] = useState({ name: "", description: "", price: "", stock: "", image: null,});
  const [photo, setPhoto] = useState(null);
  const [preview, setPreview] = useState(null);
  const [products, setProducts] = useState([]);
  const [editingProductId, setEditingProductId] = useState(null);
  const [create, setCreate] = useState(false);
  //const [allUsers, setAllUsers] = useState({ users: [], sellers: [], affiliates: [] });
const [selectedTab, setSelectedTab] = useState("users"); // which tab is active



  //for modals
  const [showDelete, setShowDelete] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  //show notification or alert message
  const [message, setMessage] = useState({message: "", type: ""})// store message

   
  //this alert message
    const showMessage = (message, type) => {
      setMessage({message, type});

      setTimeout(()=>{
        setMessage({message: "", type: ""});
      }, 2000)
    }
  
  const fetchAllUsers = async () => {
  try {
    const token = localStorage.getItem("token");
    const res = await axios.get("http://localhost:5000/api/auth/all-users", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setAllUsers(res.data);
  } catch (err) {
    console.error("Error fetching users:", err);
  }
};



 

  // Fetch products
  const fetchProducts = async () => {
    try {
      showMessage("Loading...", "loading")
      const res = await axios.get("http://localhost:5000/api/products");
      console.log("Fetched products:", res.data); // Debug
      setProducts(res.data);
    } catch (error) {
      console.error("Failed to fetch products:", error.message);
    }
  };

  useEffect(() => {
    fetchProducts();
     fetchAllUsers(); //for fetching all users
  }, []);

  // Create or update product
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!newProducts.name || !newProducts.description || !newProducts.price) {
      showMessage("All fields are required.", "failed");
      return;
    }

    const formData = new FormData();
    formData.append("name", newProducts.name);
    formData.append("description", newProducts.description);
    formData.append("price", newProducts.price);
    formData.append("stock", newProducts.stock);
    if (newProducts.commission) formData.append("commission", newProducts.commission);
    if (photo) formData.append("photo", photo);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        showMessage("You are not logged in.");
        return;
      }

      const url = editingProductId
        ? `http://localhost:5000/api/products/${editingProductId}`
        : "http://localhost:5000/api/products";

      const method = editingProductId ? "put" : "post";

      await axios[method](url, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      //use modal message if created and edited
      if(method === "put"){
        showMessage("Updated", "success")
      }
      else {
        showMessage("Created Successfully", "success")
      }

      fetchProducts();
      setNewProducts({ name: "", description: "", price: "", stock: "", commission: "" });
      setPhoto(null);
      setPreview(null);
      setEditingProductId(null);
    } catch (error) {
      console.error("Error submitting product:", error.message);
    }
    setCreate(false); 
  };


const handleCancel = () => {
  setCreate(false);
  setNewProducts({ name: "", description: "", price: "" });
  setPhoto(null);
  setPreview(null);
  setEditingProductId(null);
  showMessage("Canceled");
};


  // Image preview
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setPhoto(file);
    if (file) {
      setPreview(URL.createObjectURL(file));
    } else {
      setPreview(null);
    }
  };

  // Edit product
  const handleEdit = (product) => {
    setNewProducts({
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      commission: product.commission,
    });
    setEditingProductId(product._id);
    setPreview(`http://localhost:5000/api/products/${product._id}/photo`);
    setCreate(true);
  };

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

      await axios.delete(`http://localhost:5000/api/products/${deleteId}`, {
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
        <HeaderSeller />
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
        type="text" maxLength={15} //length of text
        placeholder="  Name"
        value={newProducts.name}
        onChange={(e) => setNewProducts({ ...newProducts, name: e.target.value })}
      />
      <input
        className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        type="text" maxLength={20} //length of text
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


      <div className="flex items-center justify-center max-w-4xl p-6 pt-20 lg:pt-20 ">
         <h2 className="text-2xl font-bold mb-4">All Products</h2> 
       <button
  onClick={() => setCreate(!create)}
  className="mb-4 mx-8 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-300 hover:text-black"
>
  {create ? "Cancel" : "Add New Product"}
</button>

      </div>


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
                src={`http://localhost:5000/api/products/${product._id}/photo`}
                alt={product.name}
                className="w-20 h-20 object-cover rounded"
              />
            </td>
            <td className="px-4 py-2 font-medium">{product.name}</td>
            <td className="px-4 py-2">{product.description}</td>
            <td className="px-4 py-2 font-semibold">₱{product.price}</td>
            <td className="px-4 py-2 text-right space-x-2">
              <button
                onClick={() => handleEdit(product)}
                className="px-3 py-1 bg-gray-500 text-white rounded w-16 my-1 hover:bg-gray-300 hover:text-black"
              >
                Edit
              </button>
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

{/*
<div className="flex gap-2 my-4 justify-center">
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
  <p className="text-center text-gray-500">No {selectedTab} found.</p>
) : (
  <div className="overflow-x-auto rounded-lg border mb-6">
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
*/}


    </div>

    {/* show message */}
    <div className="flex justify-center item-center"> 
    {message.message && <Message message={message.message} type={message.type} />}
</div>
     </div>
  );
};

export default SellerDashboard;
