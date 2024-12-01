import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ApiService from "../api/ApiService";
import LoadingSpinner from "../components/modal/LoadingSpinner.js";
import TicketDetails from "../components/ticketshow/TicketDetails.js";
import { Calendar, Clock, MapPin, Ticket, Info, RotateCcw, Music2 } from 'lucide-react';

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
      icon: <Info className="w-4 h-4" />,
      content: <TicketDetails event={event} />,
    },
    {
      title: "須知",
      icon: <Ticket className="w-4 h-4" />,
      content: event?.eventRules || "暫無須知",
    },
    {
      title: "退款說明",
      icon: <RotateCcw className="w-4 h-4" />,
      content: event?.eventRefundPolicy || "暫無退款說明",
    },
  ];

  const getInfoItems = (eventData) => {
    if (!eventData) return [];

    return [
      { label: "演唱會名稱", value: eventData.eventName, icon: <Music2 className="w-4 h-4" /> },
      { label: "場地", value: eventData.eventLocation, icon: <MapPin className="w-4 h-4" /> },
      { label: "日期", value: eventData.eventDate, icon: <Calendar className="w-4 h-4" /> },
      { label: "時間", value: eventData.eventTime, icon: <Clock className="w-4 h-4" /> },
      { label: "購票", value: "button", icon: <Ticket className="w-4 h-4" /> }
    ];
  };
  //api
  const fetchEvent = () => {
    ApiService.fetchTicketsEvent(eventId)
      .then((res) => { setEvent(res.data.data) })
      .catch((err) => { console.log("抓取演唱會資料失敗", err) })
      .finally(() => { setLoading(false) })
  }

  useEffect(() => {

    fetchEvent();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventId])

  if (loading) return <LoadingSpinner />

  const infoItems = getInfoItems(event);

  //進到演唱會銷售網頁
  const goToTicketSales = () => {
    navigate("/event/ticket/section", { state: { eventId } });
  };





  return (
    <div className="flex flex-col items-center pt-0 space-y-6 -mt-10">
      <EventPic src={event.eventTicketPic} />

      {/* 橫向資訊區塊 */}
      <div className="bg-white border-2 border-blue-200 w-9/12 rounded-lg py-6 shadow-lg">
        <div className="max-w-4xl min-w-64 mx-auto">
          {/* 標題 */}
          <div className="flex justify-between text-center border-b-2 border-blue-100 pb-2 mb-4">
            {infoItems.map(item => (
              <ColumnHeader
                key={item.label}
                name={item.label}
                icon={item.icon}
              />
            ))}
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

      {/* 描述與額外資訊 */}
      <div className="bg-white w-9/12 flex flex-col rounded-lg shadow-lg overflow-hidden">
        <div className="flex justify-start items-center">
          {pages.map((tab, index) => (
            <TabButton
              key={index}
              title={tab.title}
              icon={tab.icon}
              isActive={currentPage === index}
              onClick={() => setCurrentPage(index)}
            />
          ))}
        </div>

        <hr className="border-t border-gray-200" />

        <div className="max-w-4xl text-center text-gray-700 p-6">
          <h3 className="text-2xl font-semibold mb-4">{pages[currentPage].title}</h3>
          <div className="text-sm">{pages[currentPage].content}</div>
        </div>
      </div>
    </div>
  );
}

export default TicketShow;

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

const ColumnHeader = ({ name, icon }) => (
  <span className="font-bold w-1/4 flex items-center justify-center gap-2 text-black">
      {icon}
      {name}
  </span>
);

// 修改內容樣式
const ColumnContent = ({ value }) => (
  <div className="w-1/4 flex flex-col items-center justify-center">
    <span className="font-bold text-lg text-blue-500">
{value}
      </span>
  </div>
);

// 修改按鈕樣式
const BuyButton = ({onClick}) => (
  <button
      className="bg-blue-500 text-white py-2  rounded-lg hover:bg-blue-600 transition-colors duration-200 w-1/4 flex items-center justify-center gap-2 font-semibold"
      onClick={onClick}
  >
      <Ticket className="w-4 h-4" />
      立即購票
  </button>
);

const TabButton = ({ title, icon, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`
          px-6 py-3 font-bold flex items-center gap-2 transition-colors duration-200
          ${isActive
        ? "bg-blue-600 text-white"
        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
      }
      `}
  >
    {icon}
    {title}
  </button>
);