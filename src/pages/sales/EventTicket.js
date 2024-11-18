import React, { useEffect, useState } from "react";
import { useLocation,useNavigate } from "react-router-dom";
import ApiService from "../../api/ApiService";
import LoadingSpinner from "../../components/LoadingSpinner";

function EventTicket() {
  // console.log("當前路徑:", window.location.pathname);
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
          }
            catch(err){
              console.log(err);
            }finally{
                setLoading(false);
            }
        }
        fetchEvent(); 

    }, [eventId]) 
    
    if(loading){
      return <LoadingSpinner/>
    }


    
    const goToTicketSales = () => {
      console.log("sale網頁的:"+eventId);
      navigate("/event/ticket/section", { state: { eventId} });
    };





return (
  <div className="flex flex-col items-center pt-0 space-y-6 -mt-10">
    {/* Hero 區塊：展示圖片和標題 */}
    <div className="bg-gradient-to-r from-orange-500 to-red-500 w-full h-96 flex justify-center items-center relative rounded-md shadow-lg mt-2"
    
    style={{ width: "1350px" ,height: '300px' }}
    >
      <img
        src={event.eventTicketPic}
        alt="圖片"
        className="h-full object-cover w-full rounded-md"
      />
    
    </div>

    {/* 資訊區塊 */}
    <div className="bg-gradient-to-r from-blue-600 via-indigo-500 to-blue-800 w-full py-4 text-white rounded-md shadow-lg">
      <div className="max-w-4xl mx-auto px-4">
        {/* 標題與值 */}
        <div className="flex justify-between text-center border-b-2 border-solid border-white pb-2 mb-4">
          {/* 標題 */}
          <span className="font-bold w-1/4">名稱</span>
          <span className="font-bold w-1/4">場地</span>
          <span className="font-bold w-1/4">時間</span>
          <span className="font-bold w-1/4">購票</span>
        </div>

        {/* 資料 */}
        <div className="flex justify-between text-center">
          {/* 值 */}
          <span className="font-normal w-1/4">{event.eventName}</span>
          <span className="font-normal w-1/4">{event.eventLocation}</span>
          <span className="font-normal w-1/4">{event.eventDate}</span>
          <button className="bg-white text-blue-600 py-1 px-3 rounded hover:bg-gray-200 transition w-1/4"
                        onClick={goToTicketSales}
>
            立即購票
          </button>
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

export default EventTicket;
