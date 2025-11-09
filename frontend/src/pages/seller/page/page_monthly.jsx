import SalesChart from "../../../components/chart/SalesChart";
import HeaderSeller from "../HeaderSeller";
import PageNav from "../page_nav/page_nave";

const PagesMonthly = () => {
return(
<div>
   <HeaderSeller />
    <div className=" pt-24 flex justify-center gap-14 px-4" >
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