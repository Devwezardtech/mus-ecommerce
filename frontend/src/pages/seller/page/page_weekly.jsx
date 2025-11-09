import WeeklyLineChart from "../../../components/chart/WeeklyLineChart";
import HeaderSeller from "../HeaderSeller";
import PageNav from "../page_nav/page_nave";
import SellerStrats from "../SellerStrats";

const PagesWeekly = () => {
   return(
<div>
   <HeaderSeller />
   <div className="flex md:hidden">
      <SellerStrats />
   </div>
   <div className="hidden md:flex pt-4 flex justify-center gap-14 px-4" >
      <div>
         <PageNav />
      </div>
      <div>
   <WeeklyLineChart />
      </div>
     </div>
</div>
   );
}

export default PagesWeekly;