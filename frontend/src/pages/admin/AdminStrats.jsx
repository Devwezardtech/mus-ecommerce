import SalesChart from '../../components/chart/SalesChart';
import WeeklyLineChart from '../../components/chart/WeeklyLineChart';
import HeaderAdmin from '../../layouts/headeradmin';
import TodayRevenueChart from "../../components/chart/TodayRevenueChart";

const AdminStrats = () => {
  return (
    <div>
      <div className="fixed w-full z-50">
        <HeaderAdmin />
      </div>
      <div className="pt-28 px-4 sm:px-8 md:px-16 lg:px-20">
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
