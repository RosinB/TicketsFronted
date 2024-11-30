import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ApiService from "../api/ApiService";
import LoadingSpinner from "../components/ui/LoadingSpinner";
function EventList() {
    const navigate = useNavigate();

    const [allEvent, setAllEvent] = useState(null);
    const [filteredEvents, setFilteredEvents] = useState(null); // 過濾後的活動資料
    const [searchQuery, setSearchQuery] = useState(""); // 搜尋框的輸入值
    const [isAscending, setIsAscending] = useState(true); // 控制日期排序
    const [loading, setLoading] = useState(true); 
    
    const fetchEvent=()=>{
        ApiService.fetchAllPic()
            .then((res)=>{
                setAllEvent(res.data.data); 
                setFilteredEvents(res.data.data);})// 初始化過濾後的資料
            .catch((err)=>{console.log("圖片列表沒加載到"+err)})
            .finally(()=>{ setLoading(false); })
    };

    useEffect(() => {
        fetchEvent();
    }, []);

    const handleClick=(eventId)=>{
        navigate("/event/show",{state:{eventId}});
    }

    
    //搜尋
    const handleSearch = (query) => {
        const trimmedQuery = query.trim().toLowerCase();; // 去除空白家變小寫
        setSearchQuery(trimmedQuery); // 更新搜尋框輸入值

        const filtered = allEvent.filter((event) =>
            event.eventName.toLowerCase().includes(trimmedQuery) || // 搜尋活動名稱
            event.eventDate.includes(trimmedQuery)                 // 搜尋活動日期
        );
        setFilteredEvents(filtered); // 更新過濾後的資料
    };

    //排序
    const handleSortByDate = () => {
        const sortedEvents = [...filteredEvents].sort((a, b) => {
            const dateA = new Date(a.eventDate);
            const dateB = new Date(b.eventDate);
            return isAscending ? dateA - dateB : dateB - dateA;
        });
        setFilteredEvents(sortedEvents);
        setIsAscending(!isAscending); // 切換排序方式
    };

    if (loading) return <LoadingSpinner />;

    return (
        //搜尋
        <div className="p-4">
            <div className="flex justify-center -mt-5 items-center gap-2 mb-6">
                {/* 搜尋框 */}
                <SearchInput  value={searchQuery} onChange={handleSearch}/>
                {/* 排序按鈕 */}
                <SortButton   onClick={handleSortByDate}isAscending={isAscending}/>
            </div>  
            {/* 活動列表 */}
            <EventGrid events={filteredEvents} onEventClick={handleClick}/>
        </div>

    );
}

export default EventList;



const SearchInput = ({ value, onChange }) => {
    return (
        <input 
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="搜尋活動名稱或日期..."
            className="p-2 w-4/12 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
    );
};
const SortButton = ({ onClick, isAscending }) => {
    return (
        <button
            onClick={onClick}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
        >
            {isAscending ? "按日期升序" : "按日期降序"}
        </button>
    );
};

// list的卡片
const EventCard = ({ event, onClick }) => (
    <div className="flex flex-col items-center bg-white shadow-md rounded-md">
        <img
            src={event.eventTicketList}
            alt={event.eventName}
            className="rounded-t-md w-full h-48 object-cover hover:scale-105 hover:brightness-110 active:scale-95 active:opacity-80 transition duration-300 cursor-pointer"
            onClick={onClick}
        />
        <div className="p-3 text-center">
            <p className="text-gray-500 text-xs">{event.eventDate}</p>
            <h3 className="text-sm font-bold text-gray-800 mt-1">{event.eventName}</h3>
        </div>
    </div>
);
//排序方式
const EventGrid = ({ events, onEventClick }) => {
    if (!events?.length) {
        return <p className="text-gray-500 text-center col-span-3">無符合搜尋條件的活動</p>;
    }

    return (
        <div className="grid grid-cols-3 gap-4">
            {events.map(event => (
                <EventCard
                    key={event.eventId}
                    event={event}
                    onClick={() => onEventClick(event.eventId)}
                />
            ))}
        </div>
    );
};