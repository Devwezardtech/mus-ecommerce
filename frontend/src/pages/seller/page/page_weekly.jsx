import WeeklyLineChart from "../../../components/chart/WeeklyLineChart";
import PageNav from "../page_nav/page_nave";

const PagesWeekly = () => {
   return(
<div>
   <div className="flex justify-center gap-14 px-4" >
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