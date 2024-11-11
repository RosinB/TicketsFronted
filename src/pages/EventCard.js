import React, { useState, useEffect } from "react";
import axios from "axios";

const EventCard = () => {
    const [events, setEvents] = useState([]); // 儲存多筆活動資料

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const response = await axios.get("http://localhost:8080/event/all");
                setEvents(response.data.data); // 假設 API 返回的資料位於 response.data.data
            } catch (err) {
                console.log(err);
            }
        };
        fetchEvent();
    }, []);

    return (
        <div className="flex flex-wrap gap-6 justify-center p-6">
            {events.map((event, index) => (
                <div
                    key={index}
                    className="flex flex-col md:flex-row gap-6 bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-xl shadow-xl w-full max-w-6xl -mt-6"
                >
                    {/* 左側圖片區塊 */}
                    <div className="w-full md:w-1/4 h-64 bg-gradient-to-r from-yellow-500 to-yellow-400 rounded-lg shadow-md overflow-hidden">
                        <img
                            src={event.eventImage || "/default-image.jpg"} // 預設圖片路徑
                            alt={event.eventName}
                            className="object-cover w-full h-full"
                        />
                    </div>

                    {/* 右側資訊區域 */}
                    <div className="flex flex-col w-full md:w-3/4 space-y-4">
                        <div className="bg-gray-700 p-4 border border-gray-600 rounded-lg shadow-md text-sm text-gray-200">
                            <span className="font-bold text-yellow-400">歌手名字：</span> {event.eventPerformer}
                        </div>
                        
                        <div className="bg-gray-700 p-4 border border-gray-600 rounded-lg shadow-md text-sm text-gray-200">
                            <span className="font-bold text-yellow-400">活動名稱：</span> {event.eventName}
                        </div>

                        <div className="bg-gray-700 p-4 border border-gray-600 rounded-lg shadow-md text-sm text-gray-200">
                            <span className="font-bold text-yellow-400">活動時間：</span>{" "}
                            {new Date(event.eventDate).toLocaleString()}
                        </div>

                        <div className="bg-gray-700 p-4 border border-gray-600 rounded-lg shadow-md text-sm text-gray-200">
                            <span className="font-bold text-yellow-400">活動場地：</span> {event.eventLocation}
                        </div>

                        <div className="bg-gray-700 p-4 border border-gray-600 rounded-lg shadow-md text-sm text-gray-200">
                            <span className="font-bold text-yellow-400">活動票價：</span> ${event.eventPrice}
                        </div>



                       

                        {/* 立即購票按鈕 */}
                        <button className="bg-yellow-400 text-gray-800 py-2 px-6 rounded-lg shadow-lg hover:bg-yellow-500 transition duration-300 mt-6">
                            立即購票
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default EventCard;
