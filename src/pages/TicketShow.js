import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ApiService from "../api/ApiService";
import LoadingSpinner from "../components/modal/LoadingSpinner.js";
import TicketDetails from "../components/ticketshow/TicketDetails.js";
import { Calendar, Clock, MapPin, Ticket, Info, RotateCcw, Music2 } from 'lucide-react';

function TicketShow() {
  const { eventId } = useParams() || {};

  const [currentPage, setCurrentPage] = useState(0);
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
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

    const isSaleStarted = new Date(eventData.eventSalesDate) <= new Date();

    return [
      { label: "演唱會名稱", value: eventData.eventName, icon: <Music2 className="w-4 h-4" /> },
      { label: "場地", value: eventData.eventLocation, icon: <MapPin className="w-4 h-4" /> },
      { label: "日期", value: eventData.eventDate, icon: <Calendar className="w-4 h-4" /> },
      { label: "時間", value: eventData.eventTime, icon: <Clock className="w-4 h-4" /> },
      { label: "購票", value: "button", icon: <Ticket className="w-4 h-4" />, isSaleStarted }
    ];
  };



  useEffect(() => {
    const fetchEvent = () => {
      ApiService.fetchTicketsEvent(eventId)
        .then((res) => { setEvent(res.data.data) })
        .catch((err) => { console.log("抓取演唱會資料失敗", err) })
        .finally(() => { setLoading(false) })
    }
    fetchEvent();
  }, [eventId])

  if (loading) return <LoadingSpinner />

  const infoItems = getInfoItems(event);

  const goToTicketSales = () => {
    navigate("/event/ticket/section", { state: { eventId } });
  };

  if (!event) {
    return (
      <div className="flex flex-col items-center pt-20">
        <h2 className="text-2xl text-gray-700">目前無法取得資料</h2>
        <p className="text-gray-500 mt-4">請稍後再試。</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center pt-0 space-y-6 -mt-10">
      <EventPic src={event.eventTicketPic} />
      <div className={`
        absolute top-3 right-3 
        px-3 py-1 
        text-white text-sm 
        rounded-full 
        shadow-md
        ${new Date(event.eventSalesDate) > new Date() ? 'bg-blue-500' : 'bg-green-500'}
      `}>
        {new Date(event.eventSalesDate) > new Date() ? "即將開賣" : "熱賣中"}
      </div>
      <ColumnData infoItems={infoItems} goToTicketSales={goToTicketSales}/>
      <ShowData pages={pages} currentPage={currentPage} setCurrentPage={setCurrentPage}/>
    </div>
  );
}

const ColumnData=({infoItems,goToTicketSales})=>{
  return(<div className="bg-white border-2 border-blue-200 w-9/12 rounded-lg py-6 shadow-lg">
    <div className="max-w-4xl min-w-64 mx-auto">
      <ColTitle infoItems={infoItems}/>
      <ColData infoItems={infoItems} goToTicketSales={goToTicketSales}/>
    </div>
  </div>)
}

const ShowData=({pages,currentPage,setCurrentPage})=>{
  return(<div className="bg-white w-9/12 flex flex-col rounded-lg shadow-lg overflow-hidden">
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
  )
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

const ColumnHeader = ({ name, icon }) => (
  <span className="font-bold w-1/4 flex items-center justify-center gap-2 text-black">
    {icon}
    {name}
  </span>
);

const ColumnContent = ({ value }) => (
  <div className="w-1/4 flex flex-col items-center justify-center">
    <span className="font-bold text-lg text-blue-500">
      {value}
    </span>
  </div>
);

const BuyButton = ({ onClick, isSaleStarted }) => (
  <button
    className={`
      py-2 rounded-lg transition-colors duration-200 w-1/4 
      flex items-center justify-center gap-2 font-semibold
      ${isSaleStarted 
        ? "bg-blue-500 text-white hover:bg-blue-600" 
        : "bg-gray-400 text-white cursor-not-allowed"}
    `}
    onClick={isSaleStarted ? onClick : undefined}
    disabled={!isSaleStarted}
  >
    <Ticket className="w-4 h-4" />
    {isSaleStarted ? "立即購票" : "尚未開售"}
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

const ColTitle=({infoItems})=>{
  return(<div className="flex justify-between text-center border-b-2 border-blue-100 pb-2 mb-4">
    {infoItems.map(item => (
      <ColumnHeader
        key={item.label}
        name={item.label}
        icon={item.icon}
      />
    ))}
  </div>)
}

const ColData=({infoItems,goToTicketSales})=>{
  return(<div className="flex justify-between text-center">
    {infoItems.map(item => (
      item.value === "button"
        ? <BuyButton 
            key={item.label} 
            onClick={goToTicketSales} 
            isSaleStarted={item.isSaleStarted}
          />
        : <ColumnContent key={item.label} value={item.value} />
    ))}
  </div>)
}

export default TicketShow;