import SalesChart from '../../components/chart/SalesChart'
import WeeklyLineChart from '../../components/chart/WeeklyLineChart';
//import CategoryPieChart from '../../components/chart/CategoryPieChart';
import HeaderSeller from "./HeaderSeller"
import TodayRevenueChart from "../../components/chart/TodayRevenueChart";


const SellerStrats = () => {
return (
   <div className='w-full'>
      <div className=" pt-16 px-2 sm:px-6 md:px-8 lg:px-12 sm:pt-20 md:pt-24 lg:pt-28">
         <div className="mb-6">
            <TodayRevenueChart />
         </div>
         <div className="mb-6">
            <SalesChart />
         </div>
         <div className="mb-6">
            <WeeklyLineChart />
         </div>
         {/*<div className="mb-6">
            <CategoryPieChart />
         </div>
         */}
         
         
         
      </div>
   </div>
)
}

export default SellerStrats;


