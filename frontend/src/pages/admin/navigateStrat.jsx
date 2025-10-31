import React from 'react';
import HeaderAdmin from '../../layouts/headeradmin';
import { Link } from 'react-router-dom';

const NavigateStrat = () => {
  return (
    <div className="">
      {/* Fixed header */}
      <div className="fixed w-full z-50 top-0 left-0">
        <HeaderAdmin />
      </div>
      <nav className="top-24 flex flex-cols justify-start">
        <Link>Today</Link>
        <Link>Weekly</Link>
        <Link>Monthly</Link>
      </nav>
    </div>
  );
};

export default NavigateStrat;
