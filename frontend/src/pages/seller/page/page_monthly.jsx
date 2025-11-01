import SalesChart from "../../../components/chart/SalesChart";
import PageNav from "../page_nav/page_nave";

const PagesMonthly = () => {
return(
<div>
    <div className="flex justify-center gap-14 px-4" >
      <div>
         <PageNav />
      </div>
      <div>
   <SalesChart />
   </div>
   </div>
</div>
)
}
export default PagesMonthly;