import { useNavigate } from "react-router-dom";

const PageNav = () => {
   const navigate = useNavigate;

   const today =()=>{
      navigate("/saletoday")
   }
  return (
    <div className="">
      {/* Fixed header */}
      <div className="fixed w-full z-50 top-0 left-0">
        
      </div>
      <nav className="top-24 flex flex-cols justify-start">
        <button onlick={today}>Today</button>
        <button>Weekly</button>
        <button>Monthly</button>
      </nav>
    </div>
  );
};

export default PageNav;