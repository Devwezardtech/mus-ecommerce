import React from 'react';
import HeaderAdmin from '../../layouts/headeradmin';
import { LInk } from 'react-router-dom';

const NavigateStrat = () => {
  return (
    <div className="relative">
      {/* Fixed header */}
      <div className="fixed w-full z-50 top-0 left-0">
        <HeaderAdmin />
      </div>

      {/* Desktop-only navigation (hidden below lg screens) */}
      <nav className="hidden lg:flex justify-center gap-8 bg-white shadow-md py-4 fixed top-16 left-0 right-0 z-40 border-b border-gray-200">
        <link>Today</link>
        <link>Weekly</link>
        <link>Monthly</link>
      </nav>
    </div>
  );
};

export default NavigateStrat;
