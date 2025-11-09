import SalesChart from '../../components/chart/SalesChart'
import WeeklyLineChart from '../../components/chart/WeeklyLineChart';
//import CategoryPieChart from '../../components/chart/CategoryPieChart';
import HeaderSeller from "./HeaderSeller"
import TodayRevenueChart from "../../components/chart/TodayRevenueChart";


const SellerStrats = () => {
return (
   <div>
      <div className=" pt-16">
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

         <div className='hidden md:flex'>
            

         </div>
         
         
         
         
      </div>
   </div>
)
}

export default SellerStrats;


