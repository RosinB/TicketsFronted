import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ApiService from "../api/ApiService";
import LoadingSpinner from "../components/ui/LoadingSpinner";
function EventList() {
    const [allEvent, setAllEvent] = useState([]);
    const [filteredEvents, setFilteredEvents] = useState([]); // 過濾後的活動資料
    const [searchQuery, setSearchQuery] = useState(""); // 搜尋框的輸入值
    const [isAscending, setIsAscending] = useState(true); // 控制日期排序

    const [loading, setLoading] = useState(true); 
    const navigate = useNavigate();


        const fetchEvent = async () => {
            try {
                const response = await ApiService.fetchAllPic();

                setAllEvent(response.data.data); 
                setFilteredEvents(response.data.data); // 初始化過濾後的資料

            } catch (err) {
                console.log("圖片列表沒加載到"+err);
            } finally {
                setLoading(false); 
            }
        };

        useEffect(() => {
        fetchEvent();
        }, []);

        const handleClick=(eventId)=>{
        navigate("/event/ticket-show",{state:{eventId}});
        }

        if (loading) return <LoadingSpinner />;
    

        const handleSearch = (query) => {
            const trimmedQuery = query.trim(); // 去除空白
            setSearchQuery(trimmedQuery); // 更新搜尋框輸入值
            const lowerCaseQuery = trimmedQuery.toLowerCase();
            const filtered = allEvent.filter((event) =>
                event.eventName.toLowerCase().includes(lowerCaseQuery) || // 搜尋活動名稱
                event.eventDate.includes(lowerCaseQuery)                 // 搜尋活動日期
            );
            setFilteredEvents(filtered); // 更新過濾後的資料
        };


        const handleSortByDate = () => {
            const sortedEvents = [...filteredEvents].sort((a, b) => {
                const dateA = new Date(a.eventDate);
                const dateB = new Date(b.eventDate);
                return isAscending ? dateA - dateB : dateB - dateA;
            });
            setFilteredEvents(sortedEvents);
            setIsAscending(!isAscending); // 切換排序方式
        };









        return (
            //搜尋
            <div className="p-4">
                <div className="flex justify-center -mt-5 items-center gap-2 mb-6">
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => handleSearch(e.target.value)}
                        placeholder="搜尋活動名稱或日期..."
                        className=" p-2 w-4/12	 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"/>
                    <button
                        onClick={handleSortByDate}
                        className="px-4 py-2   bg-blue-500 text-white rounded-md hover:bg-blue-600 transition">
                        {isAscending ? "按日期升序" : "按日期降序"}
                    </button>
                </div>  

        {/* 活動列表 */}
                <div className="grid grid-cols-3 gap-4">
                    {filteredEvents.length > 0 
                    ? (filteredEvents.map((event) => (
                            <div
                                key={event.eventId}
                                className="flex flex-col items-center bg-white shadow-md rounded-md"
                            >
                                <img
                                    src={event.eventTicketList}
                                    alt={event.eventName}
                                    className="rounded-t-md w-full h-48 object-cover hover:scale-105 hover:brightness-110 active:scale-95 active:opacity-80 transition duration-300 cursor-pointer"
                                    onClick={() => handleClick(event.eventId)}/>
                                <div className="p-3 text-center">
                                    <p className="text-gray-500 text-xs">{event.eventDate}</p>
                                    <h3 className="text-sm font-bold text-gray-800 mt-1">{event.eventName}</h3>
                                </div>
                            </div>
                        ))) 
                    : (<p className="text-gray-500 text-center col-span-3">無符合搜尋條件的活動</p>)
                    
                    }
                </div>
            </div>

        );
}

export default EventList;



