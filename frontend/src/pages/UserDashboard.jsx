import { useState, useEffect } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import HeaderUser from "../layouts/headeruser";
import Message from "./message";
import ProductCategories from "./Product_category/main_product";
//import AffiliateProducts from "./affiliate/AffiliateProducts";



const UserDashboard = () => {
  const [products, setProducts] = useState([]);
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
      showMessage("Loading...", "loading")
      const res = await api.get("/api/products");
      console.log("Fetched products:", res.data); // Debug
      setProducts(res.data);
     
    } catch (error) {
      console.error("Failed to fetch products:", error.message);
    }
    
  };
// Handle Add to Cart
  const handleAddToCart = async (productId) => {
    const token = localStorage.getItem("token"); //  fetch token
    try {
       await api.post(
        "/api/cart",
        {
          productId,
          quantity: 1,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      showMessage("Added to Cart", "success");
      setTimeout(()=>{
      }, 1000)
    } catch (error) {
      console.error("Add to cart error:", error.message);
      showMessage("Failed to add to cart");
    }
  };

  // Handle Buy (simulate: add to cart + redirect to checkout page)
  const handleBuy = (product) => {
  const productItem = {
    productId: product._id,
    quantity: 1,
    price: product.price
  };

  const total = product.price * 1;
  navigate("/checkout", { state: { products: [productItem], total } });
};


  return (
    <div>
      <div className="fixed w-full z-50" >
        <HeaderUser/>
      </div>


   <div className="p-4">
        {products.length === 0 ? (
          <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 mt-5 gap-4 py-8 lg:mt-16">
            {Array.from({ length: 32 }).map((_, index) => (
              <div
                key={index}
                className="bg-gray-200 rounded shadow animate-pulse p-1 space-y-1 lg:space-y-4 lg:p-4"
              >
                <div className="h-28 bg-gray-300 rounded lg:h-48"></div>
                <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                <div className="h-4 bg-gray-300 rounded w-5/6"></div>
                <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                <div className="flex justify-between mx-1 gap-1 lg:mt-2 ">
                  <div className="h-5 w-20 bg-gray-300 lg:h-8 rounded"></div>
                  <div className="h-5 w-20  w-20 bg-gray-300 lg:h-8 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div> 
            <div className="w-full pt-8">
              <ProductCategories />

            </div>
          <div className="pt-10 sm:pt-14 md:pt-16 lg:pt-18">
            <h2 className="font-semibold">All Products</h2>

            <div className="grid gap-4 px-1 py-4 grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {products.map((product) => (
                <div key={product._id}>
                  <div className="bg-gray-250 mb-4 pb-2 flex flex-col rounded shadow-md hover:shadow-lg transition-shadow duration-300 gap-2 w-auto h-auto">
                   <button onClick={() => navigate(`/product/${product._id}`)}>
                      <div className="flex flex-col items-center justify-center">
                        <img
  src={
    Array.isArray(product.photo)
      ? product.photo[0]
      : product.photo
  }
  alt={product.name}
  className="h-28 w-28 object-cover rounded shadow sm:h-32 sm:w-32 md:h-40 md:w-40 lg:h-60 lg:w-60"
/>

                        <div>
                          <strong className="text-gray-800 text-sm font-semibold sm:text-base md:text-md lg:text-lg">{product.name}</strong>
                          <p className="text-xs">{product.description}</p>
                          <p>
                            <strong className="text-sm font-semibold sm:text-base md:text-md lg:text-lg">${product.price}</strong>
                          </p>
                          <p className="text-sx text-sm text-gray-500 sm:text-sm md:text-sm lg:text-md">
                            Stock: {product.stock}
                          </p>
                        </div>
                      </div>
                    </button>

                    <div className="flex items-center justify-center gap-1">
                      <button
                        onClick={() => handleAddToCart(product._id)}
                        className=" bg-blue-500 text-white text-sm rounded hover:bg-blue-600 sm:text-base md:text-base lg:text-md"
                      >
                         <span className="block sm:hidden md:hidden px-1">CART</span>
                         <span className="hidden sm:block px-1">ADD TO CART</span>
                      </button>
                      <button
                        onClick={() => handleBuy(product)}
                        className="px-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 sm:text-base md:text-base lg:text-md"
                      >
                        BUY
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          </div>
        )}
      </div>




<div className="flex justify-center item-center"> 
    {message.message && <Message message={message.message} type={message.type} />}
</div>

    
    </div>
  );
};

export default UserDashboard;