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
  
   <div className="flex md:hidden">
      <SellerStrats />
   </div>
   <div className="hidden md:flex pt-20 flex justify-center gap-14 px-4" >
      <div>
         <PageNav />
      </div>
      <div>
   <TodayRevenueChart />
   </div>
   </div>
</div>
   );

}


export default PagesToday;