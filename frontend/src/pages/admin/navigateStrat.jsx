import { Link } from 'react-scroll';
import HeaderAdmin from '../../layouts/headeradmin';

const NavigateStrat = () => {
  return (
    <div className="relative">
      {/* Fixed header */}
      <div className="fixed w-full z-50 top-0 left-0">
        <HeaderAdmin />
      </div>

      {/* Desktop-only navigation (hidden below lg screens) */}
      <nav className="hidden lg:flex justify-center gap-8 bg-white shadow-md py-4 fixed top-16 left-0 right-0 z-40 border-b border-gray-200">
        <Link
          to="today-chart"
          smooth={true}
          duration={500}
          offset={-120} // Adjusts scroll for fixed header height
          className="cursor-pointer text-gray-700 font-medium hover:text-blue-600 transition-colors"
        >
          Today
        </Link>

        <Link
          to="sales-chart"
          smooth={true}
          duration={500}
          offset={-120}
          className="cursor-pointer text-gray-700 font-medium hover:text-blue-600 transition-colors"
        >
          Monthly
        </Link>

        <Link
          to="weekly-chart"
          smooth={true}
          duration={500}
          offset={-120}
          className="cursor-pointer text-gray-700 font-medium hover:text-blue-600 transition-colors"
        >
          Weekly
        </Link>
      </nav>
    </div>
  );
};

export default NavigateStrat;
