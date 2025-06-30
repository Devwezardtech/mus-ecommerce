// components/Toast.js
const Message = ({ message, type }) => {
  const bgColor =
    type === "success" 
    type === "loading" 

    if (type === "success"){
      "bg-green-400",
      "text-white"
    }
    else if (type === "loading"){
      "bg-white",
      "text-black"
    }
    else {
      "bg-red-200",
      "text-white"
    }

  return (
    <div className={`fixed top-20 z-50 ${bgColor} px-2 py-1 backdrop-blur rounded shadow-lg animate-fade`}>
      {message}
    </div>
  );
};

export default Message;
