const Message = ({ message, type }) => {
  let bgColor = "";
  let textColor = "";

  if (type === "success") {
    bgColor = "bg-green-400";
    textColor = "text-white";
  } else if (type === "loading") {
    bgColor = "bg-white";
    textColor = "text-black";
  } else {
    bgColor = "bg-red-200";
    textColor = "text-white";
  }

  return (
    <div
      className={`fixed top-20 z-50 ${bgColor} ${textColor} px-4 py-2 rounded shadow-lg backdrop-blur-md animate-fade`}
    >
      {message}
    </div>
  );
};

export default Message;
