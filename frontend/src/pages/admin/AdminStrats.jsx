import SalesChart from '../../components/chart/SalesChart';
import WeeklyLineChart from '../../components/chart/WeeklyLineChart';
import HeaderAdmin from '../../layouts/headeradmin';
import TodayRevenueChart from "../../components/chart/TodayRevenueChart";
import NavigateStrat from "./NavigateStrat"; // ✅ Import navigation here

const AdminStrats = () => {
  return (
    <div>
      {/* Fixed admin header */}
      <div className="fixed w-full z-50">
        <HeaderAdmin />
      </div>

      {/* Navigation bar (top or sidebar depending on screen size) */}
      <div className="mt-20 mb-10">
        <NavigateStrat /> {/* ✅ Use it here */}
      </div>

      {/* Charts section */}
      <div className="pt-4 px-4 sm:px-8 md:px-16 lg:px-20">
        <div id="today-chart" className="mb-8">
          <TodayRevenueChart />
        </div>
        <div id="sales-chart" className="mb-8">
          <SalesChart />
        </div>
        <div id="weekly-chart" className="mb-8">
          <WeeklyLineChart />
        </div>
      </div>
    </div>
  );
};

export default AdminStrats;
