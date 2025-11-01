const pageNav = () => {
  return (
    <div className="">
      {/* Fixed header */}
      <div className="fixed w-full z-50 top-0 left-0">
        
      </div>
      <nav className="top-24 flex flex-cols justify-start">
        <Link>Today</Link>
        <Link>Weekly</Link>
        <Link>Monthly</Link>
      </nav>
    </div>
  );
};

export default pageNav;