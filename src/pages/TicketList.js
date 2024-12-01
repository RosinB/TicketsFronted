import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ApiService from "../api/ApiService";
import LoadingSpinner from "../components/modal/LoadingSpinner";
import { Search, Calendar, ArrowUpDown, Music2, Clock, MapPin } from "lucide-react";

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
        <div className="max-w-7xl mx-auto -mt-1 ">
            <div className="bg-white rounded-lg shadow-lg p-4 mb-4">
                <div className="flex flex-col md:flex-row justify-center items-center gap-4">
                    {/* 搜尋框 */}
                    <SearchInput value={searchQuery} onChange={handleSearch} />
                    {/* 排序按鈕 */}
                    <SortButton onClick={handleSortByDate} isAscending={isAscending} />
                </div>
            </div>
            
            {/* 活動列表 */}
            <EventGrid events={filteredEvents} onEventClick={handleClick} />
        </div>
    );
}

export default EventList;



const SearchInput = ({ value, onChange }) => {
    return (
        <div className="relative w-full md:w-4/12">
            <input 
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder="搜尋活動名稱或日期..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>
    );
};

const SortButton = ({ onClick, isAscending }) => {
    return (
        <button
            onClick={onClick}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors shadow-md"
        >
            <ArrowUpDown className="h-4 w-4" />
            {isAscending ? "演出日期由近到遠" : "演出日期由遠到近"}
        </button>
    );
};

const EventCard = ({ event, onClick }) => (
    <div className="group bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300">
        <div className="relative">
            <img
                src={event.eventTicketList}
                alt={event.eventName}
                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                onClick={onClick}
            />
            {/* 售票狀態標籤 */}
            <div className="absolute top-3 right-3 px-3 py-1 bg-blue-500 text-white text-sm rounded-full shadow-md">
                {new Date(event.eventSalesDate) > new Date() ? "即將開賣" : "熱賣中"}
            </div>
        </div>
        
        <div className="p-4">
            {/* 演出日期 */}
            <div className="flex items-center gap-2 text-gray-500 text-sm mb-2">
                <Calendar className="h-4 w-4" />
                <span>{event.eventDate}</span>
            </div>
            
            {/* 演出名稱 */}
            <div className="flex items-start gap-2 mb-2">
                <Music2 className="h-4 w-4 mt-1 text-blue-500 flex-shrink-0" />
                <h3 className="font-bold text-gray-800 line-clamp-2">
                    {event.eventName}
                </h3>
            </div>

            {/* 演出資訊 */}
            <div className="space-y-1 mb-4">
                <div className="flex items-center gap-2 text-gray-600 text-sm">
                    <Clock className="h-4 w-4" />
                    <span>{event.eventTime}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600 text-sm">
                    <MapPin className="h-4 w-4" />
                    <span>{event.eventLocation || "演出地點"}</span>
                </div>
            </div>

            {/* 查看詳情按鈕 */}
            <button
                onClick={onClick}
                className="w-full py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300 flex items-center justify-center gap-2"
            >
                查看詳情
            </button>
        </div>
    </div>
);

const EventGrid = ({ events, onEventClick }) => {
    if (!events?.length) {
        return (
            <div className="text-center py-12">
                <Music2 className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-500">無符合搜尋條件的活動</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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