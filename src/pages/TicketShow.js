import React, { useEffect, useState } from "react";
import { useLocation,useNavigate } from "react-router-dom";
import ApiService from "../api/ApiService";
import LoadingSpinner from "../components/ui/LoadingSpinner";

function TicketShow() {
    const location = useLocation();
    const { eventId } = location.state || {};


    const [event,setEvent]=useState([]);
    const [loading, setLoading] = useState(true); // 加載狀態
    const navigate = useNavigate();

    useEffect(() => {
        const fetchEvent=async()=>{
            try{
            const response = await ApiService.fetchTicketsEvent(eventId);         
            setEvent(response.data.data);
            console.log("Ticket-show的演唱會資訊",response.data.data);

          }
            catch(err){
              console.log("抓取演唱會資料失敗",err);
            }finally{
                setLoading(false);
            }
        }
        fetchEvent(); 

            // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [eventId]) 
  
    if(loading) return <LoadingSpinner/>



    //進到演唱會銷售網頁
    const goToTicketSales = async() => {
      navigate("/event/ticket/section", { state: { eventId} });
    };





  return (
    //演唱會圖片區
      <div className="flex flex-col items-center pt-0 space-y-6 -mt-10">
        <div className=" w-full h-96 flex justify-center  relative  shadow-lg  mt-2">
          <img
              src={event.eventTicketPic}
              alt="演唱會圖片"
              className="h-full object-cover w-full "/>
      </div>



    {/* 橫向資訊區塊 */}
      <div className=" bg-gradient-to-r from-blue-600 via-indigo-500 to-blue-800  w-9/12 rounded-md py-6 text-white shadow-lg">
        <div className="max-w-4xl min-w-64 mx-auto ">


          {/* 標題 */}
          <div className="flex justify-between text-center border-b-2 border-solid border-white pb-2 mb-4">
            <ColumnHeader name="演唱會名稱"/>
            <ColumnHeader name="場地"/>
            <ColumnHeader name="日期"/>
            <ColumnHeader name="時間"/>
            <ColumnHeader name="購票"/>
          </div>

        {/* 資料 */}
          <div className="flex justify-between text-center">
            <ColumnContent value={event.eventName}/>
            <ColumnContent value={event.eventLocation}/>
            <ColumnContent value={event.eventDate}/>
            <ColumnContent value={event.eventTime}/>

            <button 
                  className="bg-white text-blue-600 py-1 px-3 rounded hover:bg-gray-200 transition w-1/4"
                  onClick={goToTicketSales}>  
                  立即購票</button>
          </div>
        </div>
      </div>


    {/* 描述與額外資訊 */}
    <div className="bg-gray-100 w-full py-12 flex justify-center items-center rounded-md shadow-lg">
      <div className="max-w-4xl text-center text-gray-700">
        <h3 className="text-2xl font-semibold mb-4">活動詳情</h3>
        <p className="text-sm">
              {event.eventDescription}
        </p>
      </div>
    </div>
  </div>
);
}

export default TicketShow;




// 把css提出來
const ColumnHeader=({name})=>{

  return (<span className="font-bold w-1/4">{name}</span>)

}
const ColumnContent=({value})=>{

  return (<span className="font-normal w-1/4">{value}</span>)

}