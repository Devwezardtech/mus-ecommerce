import { Link } from "react-router-dom";

const PageNav = () => {

  
  return (
    <div className="">
      {/* Fixed header */}
      <nav className="flex justify-start">
         <div className="flex flex-col">
          <Link to="/saletoday">Today</Link>
        <Link to="/saleweekly">Weekly</Link>
        <Link to="/salemonthly">Monthly</Link>
        </div>
      </nav>
    </div>
  );
};

export default PageNav;