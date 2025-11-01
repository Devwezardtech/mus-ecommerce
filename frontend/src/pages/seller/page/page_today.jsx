import TodayRevenueChart from "../../../components/chart/TodayRevenueChart";
import PageNav from "../page_nav/page_nave";


const PagesToday = () => {
   return(
<div>
   <div className="flex justify-center gap-14 px-4" >
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