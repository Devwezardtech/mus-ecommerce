import TodayRevenueChart from "../../../components/chart/TodayRevenueChart";



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