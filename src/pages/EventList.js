import React, { useEffect, useState } from "react";
import ApiClient from "../api/ApiClient";
import { useNavigate } from "react-router-dom";

function ConcertList() {
    const [allEvent, setAllEvent] = useState([]);
    const navigate = useNavigate();

    // 從後端獲取活動資料
    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const response = await ApiClient.get("/event/all");
                setAllEvent(response.data.data); // 假設 API 返回的活動資料在 response.data.data
            } catch (err) {
                console.log(err);
            }
        };

        fetchEvent();
    }, []);

    const handleClick=(eventName)=>{

        navigate("/eventticket", { state: { eventName } });

    }



    return (
        <div className="grid grid-cols-3 gap-4 p-4">
            {allEvent.map((event) => (
                <div
                    key={event.eventId} // 每個卡片需要唯一的 key
                    className="flex flex-col items-center bg-white shadow-md rounded-md"
                >
                    {/* 圖片和跳轉連結 */}
                        <img
                            src={event.image} // 圖片來自 API 返回的資料
                            alt={event.eventName} // 使用活動名稱作為圖片的替代文字
                            className="rounded-t-md w-full h-48 object-cover hover:scale-105 hover:brightness-110 active:scale-95 active:opacity-80 transition duration-300 cursor-pointer"
                            onClick={() => handleClick(event.eventName)}

                        />
                    {/* 活動資訊 */}
                    <div className="p-3 text-center">
                        <p className="text-gray-500 text-xs">{event.eventDate}</p>
                        <h3 className="text-sm font-bold text-gray-800 mt-1">{event.eventName}</h3>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default ConcertList;
