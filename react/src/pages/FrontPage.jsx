import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import HeaderFrontPage from "../layouts/headerfrontPage";
import Message from "./message";


const FrontPage = () => {
  const [products, setProducts] = useState([]);
 const [modalProduct, setModalProduct] = useState(null);


 const [message, setMessage] = useState({message: "", type: ""});

const showMessage = (msg, type) => {
    setMessage({ message: msg, type });
    setTimeout(() => {
      setMessage({ message: "", type: "" });
    }, 2000);
  };

  const navigate = useNavigate(); //  Initialize useNavigate

  useEffect(() => {
    fetchProducts();
  }, []);

  // Fetch all products from the backend
  // Fetch products
  const fetchProducts = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/products");
      console.log("Fetched products:", res.data); // Debug
      setProducts(res.data);
     
    } catch (error) {
      console.error("Failed to fetch products:", error.message);
      
    }
   
    
  };
// Handle Add to Cart
  const handleAddToCart = async () => {
    showMessage("You can login first");
    setTimeout(()=>{
      navigate("/login");
   }, 2000)
  };

  // ✅ Handle Buy (simulate: add to cart + redirect to checkout page)
  const handleBuy = () => {
   showMessage("You can login first");
   setTimeout(()=>{
      navigate("/login");
   }, 2000)
};





  return (
    <div>
     <div className="fixed w-full z-50">
        <HeaderFrontPage />
      </div>
    <div className="p-4 bg-gray-100">
    <div>
      {products.length === 0 ? ( 

       <div className="px-4 mt-16 sm:px-2 md:px-8 lg:px-16 py-8 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
    {Array.from({ length: 32 }).map((_, index) => (
      <div key={index} className="bg-gray-200 p-4 rounded shadow animate-pulse space-y-4">
        <div className="h-48 bg-gray-300 rounded"></div>
        <div className="h-4 bg-gray-300 rounded w-3/4"></div>
        <div className="h-4 bg-gray-300 rounded w-5/6"></div>
        <div className="h-4 bg-gray-300 rounded w-1/2"></div>
        <div className="flex justify-between mt-2">
          <div className="h-8 w-20 bg-gray-300 rounded"></div>
          <div className="h-8 w-20 bg-gray-300 rounded"></div>
        </div>
      </div>
    ))}
    
 </div>
  
      ) : (
         <div className="pt-20 lg:pt-10 ">
        <div className="px-1 sm:px-2 md:px-8 lg:px-16
         py-2 sm:py-2 md:py-4 lg:py-8 m-1 md:m-2 lg:m-4
         grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:mt-8 lg:grid-cols-4 gap-4 ">
          {products.map((product) => (
            <div key={product._id}>
              
                <div className="bg-gray-250 p-2 flex flex-col rounded shadow-md hover:shadow-lg transition-shadow duration-300 gap-2 w-70 lg:w-60">
                  <button onClick={() => setModalProduct(product)}>
                <div className="flex flex-col mb-2">
                <img 
               src={`http://localhost:5000/uploads/${product.photo}`}
               alt={product.name}
                className="h-60 w-60 object-cover rounded shadow"
              />
              <div className="p-2" >
                 <strong className="text-gray-600">{product.name}</strong>
              <p>{product.description}</p>
              <p>
                <strong>${product.price}</strong>
              </p>
               <p className="text-sm text-gray-600">Stock: {product.stock}</p>

              </div>
              
             
              </div>
              </button>
              
              
              <div className="flex items-center justify-center gap-2">
                <button onClick={() => handleAddToCart(product._id)} 
              className=" p-1 m-1 bg-gray-400 text-white rounded hover:bg-gray-300 hover:text-black shadow-lg hover:shadow-md transition-shadow duration-200"
              > ADD TO CART
              </button>{" "}
              <button onClick={() => handleBuy(product)}
                className=" p-1 m-1 bg-gray-400 text-white rounded hover:bg-gray-300 hover:text-black shadow-lg hover:shadow-md transition-shadow duration-200"
                >BUY</button>
              
              </div>
              
              </div>
              
              
              
              
            </div>
          ))}
        </div>
        </div>
      )}
    </div>

    </div>

    {modalProduct && (
  <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
    <div className="bg-gray-300 rounded-lg p-4 shadow-lg w-full max-w-sm relative">
      <button
        onClick={() => setModalProduct(null)}
        className="absolute w-10 top-2 right-2 text-gray-500 hover:text-gray-200 text-xl bg-gray-200 hover:bg-gray-400 rounded "
      >
        ✕
      </button>
      <img
        src={`http://localhost:5000/uploads/${modalProduct.photo}`}
        alt={modalProduct.name}
        className="w-full h-74 object-cover rounded-lg mb-4 py-8"
      />
      <h2 className="text-xl font-bold text-gray-700 mb-2">{modalProduct.name}</h2>
      <p className="text-gray-600">{modalProduct.description}</p>
      <p className="text-gray-800 font-bold mt-2">${modalProduct.price}</p>
      <div className="flex justify-end gap-2 mt-4">
        <button
          onClick={() => handleAddToCart(modalProduct._id)}
          className="bg-gray-500 text-white px-3 py-1 rounded-lg hover:bg-gray-400 hover:text-black"
        >
          Add to Cart
        </button>
        <button
          onClick={() => handleBuy(modalProduct)}
          className="bg-gray-500 text-white px-3 py-1 rounded-lg hover:bg-gray-400 hover:text-black"
        >
          Buy
        </button>
      </div>
    </div>
  </div>
)}


      {/* message login successful or failed */}
<div className="flex justify-center item-center"> 
    {message.message && <Message message={message.message} type={message.type} />}
</div>

    
    </div>
  );
};

export default FrontPage;