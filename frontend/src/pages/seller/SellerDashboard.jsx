import { useState, useEffect } from "react";
import api from "../../api/axios";
import Message from "../message";
import HeaderSeller from "./HeaderSeller";

const SellerDashboard = () => {
  const [newProducts, setNewProducts] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    commission: "",
    photo: [],
    photoId: [],
  });

  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [products, setProducts] = useState([]);
  const [editingProductId, setEditingProductId] = useState(null);
  const [create, setCreate] = useState(false);

  const [showDelete, setShowDelete] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [message, setMessage] = useState({ message: "", type: "" });
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");

  const showMessage = (msg, type) => {
    setMessage({ message: msg, type });
    setTimeout(() => setMessage({ message: "", type: "" }), 2000);
  };

  // Fetch products
  const fetchProducts = async () => {
    try {
      showMessage("Loading...", "loading");
      const res = await api.get("/api/products");
      const productsData = Array.isArray(res.data) ? res.data : res.data.products || [];

      // Normalize photo & photoId to always be arrays
      const normalizedProducts = productsData.map((p) => ({
        ...p,
        photo: Array.isArray(p.photo) ? p.photo : p.photo ? [p.photo] : [],
        photoId: Array.isArray(p.photoId) ? p.photoId : p.photoId ? [p.photoId] : [],
      }));

      setProducts(normalizedProducts);
    } catch (error) {
      console.error("Failed to fetch products:", error.message);
    }
  };

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const res = await api.get("/api/products/categories");
      const data = Array.isArray(res.data) ? res.data : res.data.categories || [];
      setCategories(data);
    } catch (err) {
      console.error("Failed to load categories", err);
      setCategories([]);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  // Handle file selection
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + selectedFiles.length > 5) {
      showMessage("Maximum 5 photos allowed", "failed");
      return;
    }
    setSelectedFiles([...selectedFiles, ...files]);
    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setPreviews([...previews, ...newPreviews]);
  };

  // Remove single photo before submit
  const removePhoto = (index) => {
    setSelectedFiles(selectedFiles.filter((_, i) => i !== index));
    setPreviews(previews.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!newProducts.name || !newProducts.description || !newProducts.price) {
      showMessage("All fields are required.", "failed");
      return;
    }

    if (selectedFiles.length === 0 && newProducts.photo.length === 0) {
      showMessage("Please add at least 1 photo", "failed");
      return;
    }

    let photo = [...newProducts.photo];
    let photoId = [...newProducts.photoId];

    // Upload new selected files to Cloudinary
    for (let file of selectedFiles) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "ecommerce_preset");

      try {
        const uploadRes = await fetch(
          "https://api.cloudinary.com/v1_1/dawfelvee/image/upload",
          {
            method: "POST",
            body: formData,
          }
        );

        if (!uploadRes.ok) throw new Error("Image upload failed");

        const uploadData = await uploadRes.json();
        photo.push(uploadData.secure_url);
        photoId.push(uploadData.public_id);
      } catch (error) {
        console.error("Cloudinary upload error:", error);
        showMessage("Image upload failed", "failed");
        return;
      }
    }

    const token = localStorage.getItem("token");
    if (!token) {
      showMessage("You are not logged in.", "failed");
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
      photo,
      photoId,
      category: selectedCategory,
    };
    console.log("Submitting payload:", payload);


    try {
      await api[method](url, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      showMessage(method === "put" ? "Updated" : "Created Successfully", "success");
      fetchProducts();

      // Reset form
      setNewProducts({
        name: "",
        description: "",
        price: "",
        stock: "",
        commission: "",
        photo: [],
        photoId: [],
      });
      setSelectedFiles([]);
      setPreviews([]);
      setSelectedCategory("");
      setEditingProductId(null);
      setCreate(false);
    } catch (error) {
      console.error("Error submitting product:", error.message);
      showMessage("Failed to submit product.", "failed");
    }
  };

  const handleCancel = () => {
    setCreate(false);
    setNewProducts({
      name: "",
      description: "",
      price: "",
      stock: "",
      commission: "",
      photo: [],
      photoId: [],
    });
    setSelectedFiles([]);
    setPreviews([]);
    setSelectedCategory("");
    setEditingProductId(null);
    showMessage("Canceled");
  };

  const handleEdit = (product) => {
    setNewProducts({
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      commission: product.commission,
      photo: Array.isArray(product.photo) ? product.photo : product.photo ? [product.photo] : [],
      photoId: Array.isArray(product.photoId) ? product.photoId : product.photoId ? [product.photoId] : [],
    });
    setPreviews(Array.isArray(product.photo) ? product.photo : product.photo ? [product.photo] : []);
    setSelectedFiles([]);
    setSelectedCategory(product.category || "");
    setEditingProductId(product._id);
    setCreate(true);
  };

  const handleDelete = (id) => {
    setDeleteId(id);
    setShowDelete(true);
  };

  const handleConfirm = async () => {
    if (!deleteId) return;
    try {
      const token = localStorage.getItem("token");
      await api.delete(`/api/products/${deleteId}`, { headers: { Authorization: `Bearer ${token}` } });
      showMessage("Deleted Successfully", "success");
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

      <div className="bg-white-200 flex flex-col lg:px-20">
        {create && (
          <div className="fixed inset-0 flex items-center flex-col justify-center bg-opacity-40 z-50">
            <div className="bg-gray-200 p-4 rounded-lg m-20 w-full max-w-lg">
              <div className="flex justify-between items-center m-2">
                <h2 className="font-semibold">{editingProductId ? "Edit Product" : "Create Product"}</h2>
                <button className="w-5 rounded text-white bg-gray-400 hover:bg-gray-200 hover:text-black" onClick={handleCancel}>X</button>
              </div>

              <form onSubmit={handleSubmit} className="flex flex-col gap-2 mb-6">
                <input type="text" placeholder="Name" value={newProducts.name} onChange={(e) => setNewProducts({ ...newProducts, name: e.target.value })} className="w-full px-2 py-1 border border-gray-300 rounded" />
                <input type="text" placeholder="Description" value={newProducts.description} onChange={(e) => setNewProducts({ ...newProducts, description: e.target.value })} className="w-full px-2 py-1 border border-gray-300 rounded" />
                <input type="number" placeholder="Price" value={newProducts.price} onChange={(e) => setNewProducts({ ...newProducts, price: e.target.value })} className="w-full px-2 py-1 border border-gray-300 rounded" />
                <input type="number" placeholder="Stock" value={newProducts.stock} onChange={(e) => setNewProducts({ ...newProducts, stock: e.target.value })} className="w-full px-2 py-1 border border-gray-300 rounded" />
                <input type="number" step="0.01" placeholder="Commission" value={newProducts.commission || ""} onChange={(e) => setNewProducts({ ...newProducts, commission: e.target.value })} className="w-full px-2 py-1 border border-gray-300 rounded" />

                <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
  <option value="">Select Category</option>
  {Array.isArray(categories) && categories.map((cat) => (
    <option key={cat._id} value={cat._id}>{cat.name}</option>
  ))}
</select>


                <input type="file" accept="image/*" multiple onChange={handleFileChange} />

                {/* Preview images */}
                {previews.length > 0 && (
                  <div className="flex flex-wrap gap-2 my-2">
                    {previews.map((src, index) => (
                      <div key={index} className="relative">
                        <img src={src} alt="Preview" className="w-24 h-24 object-cover rounded shadow-md" />
                        <button type="button" onClick={() => removePhoto(index)} className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6 text-xs flex items-center justify-center">x</button>
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex justify-center">
                  <button type="submit" className="w-40 bg-gray-500 hover:text-black text-white px-4 py-2 rounded hover:bg-gray-400">
                    {editingProductId ? "Update" : "Create"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="overflow-x-auto mt-6">
          <table className="min-w-full divide-y divide-gray-200 text-sm lg:text-md">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-center font-semibold px-2 py-1">Images</th>
                <th className="text-left font-semibold px-2 py-1">Name</th>
                <th className="text-left font-semibold px-2 py-1">Description</th>
                <th className="text-left font-semibold px-2 py-1">Price</th>
                <th className="text-center font-semibold px-2 py-1">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {products.map((product) => (
                <tr key={product._id} className="hover:bg-gray-50">
                  <td className="px-2 py-1 flex flex-wrap gap-1 justify-center">
                    {Array.isArray(product.photo) && product.photo.map((p, i) => (
                      <img key={i} src={p} alt={product.name} className="w-10 h-10 object-cover rounded md:w-16 md:h-16" />
                    ))}
                  </td>
                  <td className="px-2 py-1 font-medium">{product.name}</td>
                  <td className="px-2 py-1 font-medium">{product.description}</td>
                  <td className="px-2 py-1 font-semibold">₱{product.price}</td>
                  <td className="px-2 py-1 text-center space-x-2">
                    <button onClick={() => handleEdit(product)} className="px-2 py-1 bg-blue-500 text-white rounded w-16 hover:bg-blue-600">Edit</button>
                    <button onClick={() => handleDelete(product._id)} className="px-2 py-1 bg-red-500 text-white rounded w-16 hover:bg-red-600">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {message.message && (
          <div className="flex justify-center my-2">
            <Message message={message.message} type={message.type} />
          </div>
        )}
      </div>
    </div>
  );
};

export default SellerDashboard;
