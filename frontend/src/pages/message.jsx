const Message = ({ message, type }) => {
  let bgColor = "";
  let textColor = "";

  if (type === "success") {
    bgColor = "bg-green-500";
    textColor = "text-white";
  } else if (type === "loading") {
    bgColor = "bg-white";
    textColor = "text-black";
  } else {
    bgColor = "bg-red-500";
    textColor = "text-white";
  }

  return (
    <div
      className={`fixed top-20 z-50 ${bgColor} ${textColor} px-4 py-2 rounded-sm  animate-fade`}
    >
      {message}
    </div>
  );
};

export default Message;
