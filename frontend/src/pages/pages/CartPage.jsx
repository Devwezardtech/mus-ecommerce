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

   useEffect(() => {
    fetchCart();
  }, []);  

//temp comment
  //quantity, remove, buy
  /*const incrementQty = async (productId) => {
  try {
    await api.put(`/api/cart/increment/${productId}`, {}, {
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchCart();
  } catch (err) {
    console.error("Increment error:", err.message);
  }
};

const decrementQty = async (productId) => {
  try {
    await api.put(`/api/cart/decrement/${productId}`, {}, {
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchCart();
  } catch (error) {
    console.error("error", error)
    showMessage("Minimum quantity is 1");
  }
};
*/

const removeFromCart = async (productId) => {
  
  try {
    await api.delete(`/api/cart/${productId}`, {
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
    const res = await api.get("/api/cart", {
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
      
  <div className="pt-8 min-w-full md:min-w-full lg:min-w-full text-sm lg:text-lg md:text-md">

    {cartItems.length === 0 ? (
      <div className=" w-full p-4 text-center text-gray-600 min-h-[700px] flex items-center justify-center">
    <p className="text-md font-semibold">Your cart is empty...</p>
  </div>
    ) : (
      <div className="w-full min-w-full md:min-w-full lg:min-w-full pt-6 lg:pt-10">
        <table className="min-w-full bg-white border border-gray-200" >
          <thead className="bg-blue-500 text-gray-700 text-center text-white md:text-sm lg:text-md text-sm">
            <tr>
              <th className="p-1 border-b">Image</th>
              <th className="p-1 border-b">Name</th>
              <th className="p-1 border-b">Price</th>
              <th className="p-1 border-b">Quantity</th>
              <th className="p-1 border-b">Total</th>
              <th className="p-1 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {cartItems
              .filter((item) => item.productId !== null)
              .map((item) => (
                <tr key={item.productId._id} className="hover:bg-gray-50 justify-center items-center">
                  <td className="py-1 px-2 border-b w-24 text-center">
  <div className="flex justify-center items-center">
    <img
      src={item.productId.photo}
      alt={item.productId.name}
      className="h-12 w-12 md:h-14 md:w-14 lg:h-16 lg:w-16 object-cover rounded shadow-lg"
    />
  </div>
</td>
                  <td className="p-1 border-b text-center">{item.productId.name}</td>
                  <td className="p-1 border-b text-center">₱{item.productId.price}</td>
                  <td className="border-b text-center ">{item.quantity}</td>
                  <td className="p-1 border-b font-semibold text-center">
                    ₱{item.quantity * item.productId.price}
                  </td>

                  <td className="px-1 py-3 border-b text-center">

                    
                    {/**
                     * 
                     *  <button
                      onClick={() => incrementQty(item.productId._id)}
                      className="px-1 py-1 bg-gray-400 rounded text-white hover:bg-gray-300 hover:text-black"
                    >
                      +
                    </button>
                    <button
                      onClick={() => decrementQty(item.productId._id)}
                      disabled={item.quantity <= 1}
                      className={`px-1 py-1 rounded text-white ${
                        item.quantity <= 1
                          ? "bg-gray-300 cursor-not-allowed"
                          : "bg-gray-400 text-white hover:bg-gray-300 hover:text-black"
                      }`}
                    >
                      -
                    </button>
                     * 
                     */}
  <div className="flex flex-col md:flex-row justify-center items-center gap-2">
    <button
      onClick={() => handleBuy(item)}
      className="px-6 py-1 bg-green-400 rounded text-white hover:bg-green-500"
    >
      Buy
    </button>

    <button
      onClick={() => removeFromCart(item.productId._id)}
      className="px-3 py-1 bg-red-400 rounded text-white hover:bg-red-500"
    >
      Remove
    </button>
  </div>
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
