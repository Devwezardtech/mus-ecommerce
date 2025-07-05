import { useState, useEffect } from "react";
import api from "../../api/axios";
import { useNavigate } from "react-router-dom";
import HeaderUser from "../../layouts/headeruser";
import Message from "../message";


const CartPage = () => {
   const navigate = useNavigate();
   const token = localStorage.getItem("token");
  const [cartItems, setCartItems] = useState([]);
   const [message, setMessage] = useState({message: "", type: ""});

const showMessage = (msg, type) => {
    setMessage({ message: msg, type });
    setTimeout(() => {
      setMessage({ message: "", type: "" });
    }, 2000);
  };



  const handleBack = () => {
    navigate("/user"); // Redirect to the users page
  };


   useEffect(() => {
    fetchCart();
  }, []);  


  //quantity, remove, buy
  const incrementQty = async (productId) => {
  try {
    await api.put(`/cart/increment/${productId}`, {}, {
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchCart();
  } catch (err) {
    console.error("Increment error:", err.message);
  }
};

const decrementQty = async (productId) => {
  try {
    await api.put(`/cart/decrement/${productId}`, {}, {
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchCart();
  } catch (err) {
    showMessage("Minimum quantity is 1");
  }
};

const removeFromCart = async (productId) => {
  
  try {
    await api.delete(`/cart/${productId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchCart();
  } catch (err) {
    console.error("Remove error:", err.message);
    showMessage("Failed to remove item");
  }
};


// Handle Buy (simulate: add to cart + redirect to checkout page)
  const handleBuy = () => {
  const filteredItems = cartItems.filter(item => item.productId !== null);

  const products = filteredItems.map((item) => ({
    productId: item.productId._id,
    quantity: item.quantity,
    price: item.productId.price,
  }));

  const total = products.reduce((sum, item) => sum + item.price * item.quantity, 0);

  navigate("/checkout", { state: { products, total } });
};


//

  const fetchCart = async () => {
  try {
    showMessage("Loading...", "loading");
    const res = await api.get("/cart", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("Fetched cart items:", res.data);// <-- check structure

    setCartItems(res.data);
  } catch (error) {
    console.error("Failed to fetch cart:", error.response?.data || error.message);
    
  }
};


  return (
    <div>
      <div className="fixed w-full"> 
        <HeaderUser/>
      </div>
      
  <div className="px-4 py-6">
    <button
      onClick={handleBack}
      className="px-3 py-1 bg-gray-400 m-1 text-white rounded hover:bg-gray-300 hover:text-black"
    >
      Back
    </button>

    {cartItems.length === 0 ? (
      <div className=" w-full p-4 text-center text-gray-600 min-h-[700px] flex items-center justify-center">
    <p className="text-md font-semibold">Your cart is empty...</p>
  </div>
    ) : (
      <div className="overflow-x-auto pt-6 lg:pt-10">
        <table className="min-w-full bg-white border border-gray-200 shadow-md rounded-lg">
          <thead className="bg-gray-100 text-gray-700 text-left">
            <tr>
              <th className="p-3 border-b">Image</th>
              <th className="p-3 border-b">Name</th>
              <th className="p-3 border-b">Price</th>
              <th className="p-3 border-b">Quantity</th>
              <th className="p-3 border-b">Total</th>
              <th className="p-3 border-b text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {cartItems
              .filter((item) => item.productId !== null)
              .map((item) => (
                <tr key={item.productId._id} className="hover:bg-gray-50">
                  <td className="p-3 border-b">
                    <img
                      src={item.productId.photo}
                      alt={item.productId.name}
                      className="h-16 w-20 object-cover rounded shadow"
                    />
                  </td>
                  <td className="p-3 border-b">{item.productId.name}</td>
                  <td className="p-3 border-b">₱{item.productId.price}</td>
                  <td className="p-3 border-b">{item.quantity}</td>
                  <td className="p-3 border-b font-semibold">
                    ₱{item.quantity * item.productId.price}
                  </td>
                  <td className="p-3 text-center space-x-2">
                    <button
                      onClick={() => incrementQty(item.productId._id)}
                      className="px-2 py-1 bg-gray-400 rounded text-white hover:bg-gray-300 hover:text-black"
                    >
                      +
                    </button>
                    <button
                      onClick={() => decrementQty(item.productId._id)}
                      disabled={item.quantity <= 1}
                      className={`px-2 py-1 rounded text-white ${
                        item.quantity <= 1
                          ? "bg-gray-300 cursor-not-allowed"
                          : "bg-gray-400 text-white hover:bg-gray-300 hover:text-black"
                      }`}
                    >
                      -
                    </button>
                    <button
                      onClick={() => removeFromCart(item.productId._id)}
                      className="px-4 py-1 bg-gray-400 rounded text-white hover:bg-gray-300 hover:text-black"
                    >
                      Remove
                    </button>
                    <button
                      onClick={() => handleBuy(item)}
                      className="px-4 py-1 bg-gray-400 rounded text-white hover:bg-gray-300 hover:text-black"
                    >
                      Buy
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    )}
  </div>
  <div className="flex justify-center item-center"> 
    {message.message && <Message message={message.message} type={message.type} />}
</div>
   </div>
);

};

export default CartPage;
