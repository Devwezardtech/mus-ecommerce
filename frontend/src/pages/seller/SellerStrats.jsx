import SalesChart from '../../components/chart/SalesChart'
import WeeklyLineChart from '../../components/chart/WeeklyLineChart';
//import CategoryPieChart from '../../components/chart/CategoryPieChart';
import HeaderSeller from "./HeaderSeller"
import TodayRevenueChart from "../../components/chart/TodayRevenueChart";


const SellerStrats = () => {
return (
   <div>
      <div className=" pt-16 px-4 sm:px-8 md:px-16 lg:px-18 sm:pt-20 md:pt-24 lg:pt-28">
         <div className="mb-8">
            <TodayRevenueChart />
         </div>
         <div className="mb-8">
            <SalesChart />
         </div>
         <div className="mb-8">
            <WeeklyLineChart />
         </div>
         {/*<div className="mb-8">
            <CategoryPieChart />
         </div>
         */}

         <div className='hidden md:flex'>
            

         </div>
         
         
         
         
      </div>
   </div>
)
}

export default SellerStrats;


