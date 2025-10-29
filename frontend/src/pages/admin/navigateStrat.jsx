import { Link } from 'react-scroll';
import { useState } from 'react';

const NavigateStrat = () => {
  const [open, setOpen] = useState(false);

  return (
    <div>
      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-20 left-4 z-50">
        <button
          onClick={() => setOpen(!open)}
          className="bg-blue-600 text-white px-3 py-2 rounded-md shadow-md"
        >
          {open ? "Close" : "Menu"}
        </button>
      </div>

      {/* Mobile Sidebar */}
      {open && (
        <div className="lg:hidden fixed top-32 left-0 bg-white shadow-lg p-4 w-48 z-40 border-r border-gray-200">
          <Link to="today-chart" smooth duration={500} offset={-100} className="block py-2 text-gray-700 hover:text-blue-600" onClick={() => setOpen(false)}>
            Today
          </Link>
          <Link to="sales-chart" smooth duration={500} offset={-100} className="block py-2 text-gray-700 hover:text-blue-600" onClick={() => setOpen(false)}>
            Monthly
          </Link>
          <Link to="weekly-chart" smooth duration={500} offset={-100} className="block py-2 text-gray-700 hover:text-blue-600" onClick={() => setOpen(false)}>
            Weekly
          </Link>
        </div>
      )}

      {/* Desktop Navbar */}
      <nav className="hidden lg:flex justify-center gap-8 bg-white shadow-md py-4 fixed top-16 left-0 right-0 z-40 border-b border-gray-200">
        <Link to="today-chart" smooth duration={500} offset={-120} className="cursor-pointer text-gray-700 font-medium hover:text-blue-600">
          Today
        </Link>
        <Link to="sales-chart" smooth duration={500} offset={-120} className="cursor-pointer text-gray-700 font-medium hover:text-blue-600">
          Monthly
        </Link>
        <Link to="weekly-chart" smooth duration={500} offset={-120} className="cursor-pointer text-gray-700 font-medium hover:text-blue-600">
          Weekly
        </Link>
      </nav>
    </div>
  );
};

export default NavigateStrat;
