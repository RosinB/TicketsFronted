import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ApiService from "../api/ApiService";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import TicketDetails from "../components/ticketshow/TicketDetails.js";

function TicketShow() {
    const location = useLocation();
    const { eventId } = location.state || {};

    const [currentPage, setCurrentPage] = useState(0);
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true); // 加載狀態
    const navigate = useNavigate();

    const pages = [
      {
        title: "活動詳情",
        content: <TicketDetails event={event} />,
      },
      {
        title: "須知",
        content: event.eventRules || "暫無須知",
      },
      {
        title: "退款說明",
        content: event.eventRefundPolicy || "暫無退款說明",
      },
    ];

    const getInfoItems = (eventData) => {
      if (!eventData) return [];
      
      return [
          { label: "演唱會名稱", value: eventData.eventName },
          { label: "場地", value: eventData.eventLocation },
          { label: "日期", value: eventData.eventDate },
          { label: "時間", value: eventData.eventTime },
          { label: "購票", value: "button" }
      ];
    };
    //api
    const fetchEvent=()=>{
      ApiService.fetchTicketsEvent(eventId)
          .then((res)=>{setEvent(res.data.data)})
          .catch((err)=>{console.log("抓取演唱會資料失敗", err)})
          .finally(()=>{setLoading(false)})
    }

    useEffect(() => {

      fetchEvent();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [eventId])

    if (loading) return <LoadingSpinner />

    const infoItems = getInfoItems(event);

    //進到演唱會銷售網頁
    const goToTicketSales = async () => {
      navigate("/event/ticket/section", { state: { eventId } });
    };


  


    return (
      <div className="flex flex-col items-center pt-0 space-y-6 -mt-10">

        {/*上面的大圖片 */}
        <EventPic src={event.eventTicketPic} />

        {/* 橫向資訊區塊 */}
        <div className=" bg-gradient-to-r from-blue-600 via-indigo-500 to-blue-800  w-9/12 rounded-md py-6 text-white shadow-lg">
          <div className="max-w-4xl min-w-64 mx-auto ">
            
            {/* 標題 */}
            <div className="flex justify-between text-center border-b-2 border-solid border-white pb-2 mb-4">
              {infoItems.map(item => <ColumnHeader key={item.label} name={item.label} />)}
            </div>


            {/* 資料 */}
            <div className="flex justify-between text-center">
              {infoItems.map(item => (
                item.value === "button"
                  ? <BuyButton key={item.label} onClick={goToTicketSales} />
                  : <ColumnContent key={item.label} value={item.value} />
              ))}
            </div>



          </div>
        </div>


        {/* 描述與額外資訊 (加入多頁切換功能) */}
        <div className="bg-white w-9/12 flex flex-col  rounded-md shadow-lg">
          {/* 上方按鈕 */}
          <div className="flex justify-start items-center w-3/5 ">

            {pages.map((tab, index) => (
              <TabButton
                key={index}
                title={tab.title}
                isActive={currentPage === index}
                onClick={() => setCurrentPage(index)}/>
            ))}
          </div>

          <hr className="w-full border-t border-gray-300 " />

          {/* 分頁內容 */}
          <div className="max-w-4xl text-center text-gray-700">
            <h3 className="text-2xl font-semibold mb-4">{pages[currentPage].title}</h3>
            <div className="text-sm">{pages[currentPage].content}</div>
          </div>
        </div>

      </div>
    );
}

export default TicketShow;




// 把css提出來
const ColumnHeader = ({ name }) => {

  return (<span className="font-bold w-1/4">{name}</span>)

}
const ColumnContent = ({ value }) => {

  return (<span className="font-normal w-1/4">{value}</span>)

}
const EventPic = ({ src }) => {

  return (
        <div className="w-full h-96 flex justify-center relative shadow-lg mt-2">
            <img
                src={src}
                alt="演唱會圖片"
                className="h-full object-cover w-full"
            />
        </div>
    );
}
const BuyButton = ({ onclick }) => {
  return (<button
    className="bg-white text-blue-600 py-1 px-3 rounded hover:bg-gray-200 transition w-1/4"
    onClick={onclick}>

    立即購票</button>)

}
const TabButton = ({ title, isActive, onClick }) => (
  <button
      onClick={onClick}
      className={`px-4 py-2 font-bold ${
          isActive 
              ? "bg-blue-500 text-white"
              : "bg-gray-200 hover:bg-gray-400"
      }`}
  >
      {title}
  </button>
);