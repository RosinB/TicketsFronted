import React, { useState, useEffect } from "react";
import axios from "axios";

const Event = () => {
    const [events, setEvents] = useState([]); // 儲存多筆活動資料

    useEffect(() => {
    const fetchEvent = async () => {
    try {
        const response = await axios.get("http://localhost:8080/event/all");
        setEvents(response.data.data); // 假設 API 返回的資料位於 response.data.data
        console.log(events);
    } catch (err) {
        console.log(err);
    }
    };
    fetchEvent();
    }, []);

    return (
        <div className="flex flex-col gap-6 items-center p-6 ">
            {events.map((event, index) => (
            <div
            key={index}
            className="flex items-start bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-lg shadow-lg w-[1000px]"
        >
          {/* 左側綠色區塊 */}
            <div className="w-32 h-32 bg-gradient-to-r from-yellow-500 to-yellow-400 rounded-lg mr-6 shadow-md border-2 border-yellow-600"></div>

          {/* 右側資訊區域 */}
            <div className="grid grid-cols-2 gap-4 w-full">
                    <div className="bg-gray-700 p-4 border border-gray-600 rounded-lg shadow-sm text-sm text-gray-200">
                        <span className="font-bold text-yellow-400">歌手名字：</span> {event.eventPerformer}
                    </div>
                    
                    <div className="bg-gray-700 p-4 border border-gray-600 rounded-lg shadow-sm text-sm text-gray-200">
                        <span className="font-bold text-yellow-400">活動名稱：</span> {event.eventName}
                    </div>

                    <div className="bg-gray-700 p-4 border border-gray-600 rounded-lg shadow-sm text-sm text-gray-200">
                        <span className="font-bold text-yellow-400">活動描述：</span> {event.eventDescription}
                    </div>

                    <div className="bg-gray-700 p-4 border border-gray-600 rounded-lg shadow-sm text-sm text-gray-200">
                        <span className="font-bold text-yellow-400">活動時間：</span>{" "}
                            {new Date(event.eventDate).toLocaleString()}
                    </div>

                    <div className="bg-gray-700 p-4 border border-gray-600 rounded-lg shadow-sm text-sm text-gray-200">
                        <span className="font-bold text-yellow-400">活動場地：</span> {event.eventLocation}
                    </div>

                    <div className="bg-gray-700 p-4 border border-gray-600 rounded-lg shadow-sm text-sm text-gray-200">
                        <span className="font-bold text-yellow-400">活動票價：</span> ${event.eventPrice}
                    </div>

                    <div className="bg-gray-700 p-4 border border-gray-600 rounded-lg shadow-sm text-sm text-gray-200">
                        <span className="font-bold text-yellow-400">活動人數：</span> {event.eventTotalTickets}
                    </div>

                    <div className="bg-gray-700 p-4 border border-gray-600 rounded-lg shadow-sm text-sm text-gray-200">
                        <span className="font-bold text-yellow-400">活動狀態：</span> {event.eventStatus}
                    </div>
            </div>
        </div>
    ))}
    </div>
        );
};

export default Event;
