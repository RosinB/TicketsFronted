import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import apiClient from "../api/ApiClient";

function EventTicket() {
    const location = useLocation();
    const { eventName } = location.state || {};
    const [event,setEvent]=useState([]);

    useEffect(() => {

        const fetchEvent=async()=>{
          console.log("接收到的活動名稱：", eventName);
            try{
            const response = await apiClient.get("/event/ticket",{params:{eventName}});
            setEvent(response.data.data);
          }
            catch(err){
              console.log(err);
            }
        }
        fetchEvent(); 
    }, [eventName]) //我只會執行一次

    console.log(event);







return (
  <div className="flex flex-col items-center pt-0 space-y-6 -mt-8">
    {/* Hero 區塊：展示圖片和標題 */}
    <div className="bg-gradient-to-r from-orange-500 to-red-500 w-full h-96 flex justify-center items-center relative rounded-md shadow-lg mt-2"
    
    style={{ width: "1500px" }}
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
          <button className="bg-white text-blue-600 py-1 px-3 rounded hover:bg-gray-200 transition w-1/4">
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
