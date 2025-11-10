import { Link } from "react-router-dom";

const PageNav = () => {

  
  return (
    <div className="">
      {/* Fixed header */}
      <nav className="flex justify-start w-full">
         <div className="flex flex-col bg-gray-300 rounded-md w-30 px-2 gap-3 h-100%">
          <Link to="/saletoday">Today</Link>
        <Link to="/saleweekly">Weekly</Link>
        <Link to="/salemonthly">Monthly</Link>
        </div>
      </nav>
    </div>
  );
};

export default PageNav;