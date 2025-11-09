import TodayRevenueChart from "../../../components/chart/TodayRevenueChart";
import HeaderSeller from "../HeaderSeller";
import PageNav from "../page_nav/page_nave";


const PagesToday = () => {
   return(
<div>
   <HeaderSeller />
   <div className="pt-4 flex justify-center gap-14 px-4" >
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