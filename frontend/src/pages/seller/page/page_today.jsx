import TodayRevenueChart from "../../../components/chart/TodayRevenueChart";
import HeaderSeller from "../HeaderSeller";
import PageNav from "../page_nav/page_nave";
import SellerStrats from "../SellerStrats";


const PagesToday = () => {
   return(
<div>
   <div className="fixed w-full z-50">
       <HeaderSeller />
   </div>
   <div className="w-full">
    
   <div className="flex md:hidden justify-center items-center">
      <SellerStrats />
   </div>
   <div className="hidden md:flex pt-20 flex justify-center gap-4 px-4 w-full" >
      <div className="w-40 h-100% bg-gray-100 rounded-lg pt-6">
         <PageNav />
      </div>
      <div className="w-full">
   <TodayRevenueChart />
   </div>
     
   </div>
  
   </div>
</div>
   );

}


export default PagesToday;