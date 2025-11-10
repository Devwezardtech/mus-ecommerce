import SalesChart from "../../../components/chart/SalesChart";
import HeaderSeller from "../HeaderSeller";
import PageNav from "../page_nav/page_nave";
import SellerStrats from "../SellerStrats";

const PagesMonthly = () => {
return(
<div>
   <div className="fixed w-full z-50">
       <HeaderSeller />
   </div>
   <div className="w-full">
      <div className="flex md:hidden justify-center items-center">
      <SellerStrats />
   </div>
   <div className="hidden md:flex pt-20 flex justify-center gap-6 px-4 w-full " >
      <div className="w-40">
         <div className=" flex h-100%">
         <PageNav />
      </div>
      </div>
      
      <div className="w-full">
   <SalesChart />
   </div>
   </div>
   </div>
</div>
)
}
export default PagesMonthly;