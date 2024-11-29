import React, { useEffect, useState } from "react";
import ApiService from "../../api/ApiService";
const SeatSectionModal = ({ isOpen, onClose, eventId, zone }) => {
    const [seats, setSeats] = useState([]); // 存儲座位數據
   
    useEffect(() => {
        setSeats(Array.from({ length: 1000 }, (_, i) => ({
            number: i + 1, // 座位编号，从 1 到 1000
            isAvailable: true, // 默认座位可用
        })));

        if (isOpen) {
            const fetchSeats = async () => {
                try {
                    const response = await ApiService.getAvailableSeats({ eventId, zone });
                    setSeats(response.data.seats); // 更新座位數據
                } catch (error) {
                    console.error("無法加載座位數據", error);
                    alert("無法加載座位數據，請稍後重試！");
                }
            };
            fetchSeats();
        }
    }, [isOpen, eventId, zone]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex w-full justify-center items-center">
            <div className="bg-white rounded-lg shadow-lg p-6 w-11/12  h-4/5 overflow-auto">
                <h2 className="text-xl font-bold mb-4 text-center">選擇座位 - {zone}</h2>
                {/* 座位区域 */}
                <div
                    className="grid gap-3"
                    style={{
                        gridTemplateColumns: "repeat(25, minmax(0, 1fr))",
                    }}>
                    {seats.map((seat, index) => (
                        <label
                            key={index}
                            className={`inline-flex  flex-col items-center text-sm ${seat.isAvailable ? "cursor-pointer" : "cursor-not-allowed"
                                }`}

                        >
                            <input
                                type="checkbox"
                                className="hidden"
                                disabled={!seat.isAvailable}
                                onChange={() => console.log(`切换座位：${seat.number}`)} // 处理选中逻辑
                            />
                            
                            <div
                                className={`w-8 h-8 border rounded flex items-center justify-center text-xs ${seat.isAvailable
                                        ? "bg-white border-green-500 text-green-500 hover:bg-green-500 hover:text-white"
                                        : "bg-gray-300 border-gray-400 text-gray-500"
                                    }`}
                                    
                            >
                                
                            </div>

                            {Math.ceil(seat.number / 25)}排 <br/>
                            {((seat.number - 1) % 25) + 1}號

                        </label>
                    ))}
                </div>
                {/* 按钮区域 */}
                <div className="flex justify-end mt-6">
                    <button
                        className="bg-red-500 text-white px-6 py-3 rounded hover:bg-red-600"
                        onClick={onClose}
                    >
                        關閉
                    </button>
                </div>
            </div>
        </div>
    );


};

export default SeatSectionModal;
