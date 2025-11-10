import { Link } from "react-router-dom";

const PageNav = () => {

  
  return (
    <div className="">
      {/* Fixed header */}
      <nav className="flex justify-start w-full  h-100%">
         <div className="flex flex-col w-30 px-4 gap-2 w-full font-semibold">
          <Link className="hover:bg-white" to="/saletoday">Today</Link>
        <Link className="hover:bg-white" to="/saleweekly">Weekly</Link>
        <Link className="hover:bg-white" to="/salemonthly">Monthly</Link>
        </div>
      </nav>
    </div>
  );
};

export default PageNav;