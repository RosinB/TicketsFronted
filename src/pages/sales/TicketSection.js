import { useEffect, useState } from "react";
import ApiService from "../../api/ApiService";
import LoadingSpinner from "../../components/LoadingSpinner";
import { useLocation } from "react-router-dom";


function TicketSection() {
    const location = useLocation();


    const { eventId } = location.state || {};
    const [loading, setloading] = useState(true);
    const [ticket, setTicket] = useState([]);


    const fetchTicketSection = async () => {
        console.log("我的號碼是" + eventId)

        try {
            const response = await ApiService.getTicketSection(eventId);
            setTicket(response.data.data)
        } catch (error) {
            console.log("演唱會區域價位沒有加載到");
            console.log(error);
        } finally {
            setloading(false);
        }
    }

    useEffect(() => {
        if (!eventId) {
            console.error("eventId 不存在！");
            return;
        }
        fetchTicketSection();

    }, [eventId])


    const event = {
        name: "Virtual Festival 虛擬音樂群星會",
        date: "2024-12-28",
        time: "18:00",
        location: "台北花博館 (台北市中山區玉門街1號)",
        organizer: "杜威商品股份有限公司",
        imageUrl: "https://via.placeholder.com/300x200", // 替換為活動圖片路徑
        stageMapUrl: "https://via.placeholder.com/400x300", // 替換為場地平面圖路徑
    };

    const tickets = [
        { zone: "A區", status: "熱賣中", price: 2500 },
        { zone: "B區", status: "熱賣中", price: 2000 },
    ];


    console.log(ticket)

    if (loading) {
        return <LoadingSpinner />
    }

    return (
        <div className="p-4">

            {/* 上部分 */}
            <div className="flex flex-col items-center   -mt-12 bg-orange-500 w-screen -mx-4 ">
            <div className="grid grid-cols-3 gap-3 mb-3 max-w-4xl mx-auto bg-orange-500 ">
            {/* 左側圖片 */}
                    <div className="bg-cover bg-center rounded-lg shadow-lg h-48 w-48 mx-auto" style={{ backgroundImage: `url(${event.imageUrl})` }}></div>

                    {/* 右側活動資訊 */}
                    <div className="col-span-2 bg-white p-4 rounded-lg shadow-lg">
                    <h1 className="text-2xl font-bold mb-4">{event.name}</h1>
                        <p className="text-gray-700 mb-2">
                            📅 {event.date} | 🕗 {event.time}
                        </p>
                        <p className="text-gray-700 mb-2">📍 {event.location}</p>
                        <p className="text-gray-700">主辦單位：{event.organizer}</p>
                    </div>
                </div>
            </div>


            {/* 下部分 */}
            <div className="flex flex-col items-center h-[500px]">
                <div className="max-w-4xl w-full grid grid-cols-2 gap-4 h-full">
                    {/* 場地平面圖 */}
                    <div>
                        <img
                            src={event.stageMapUrl}
                            alt="場地平面圖"
                            className="w-full h-full rounded-lg shadow-lg"
                        />
                    </div>

                    {/* 售票區域 */}
                    <div className="bg-white p-6 rounded-lg shadow-lg ">
                        <h2 className="text-xl font-bold mb-4">票區一覽</h2>
                        <ul>
                            {tickets.map((ticket, index) => (
                                <li key={index} className="flex justify-between items-center mb-4">
                                    <div className="flex items-center">
                                        <div className="w-4 h-4 bg-orange-500 rounded-full mr-2"></div>
                                        <span className="font-bold">{ticket.zone}</span>
                                    </div>
                                    <span className="bg-yellow-100 text-yellow-600 px-2 py-1 rounded">{ticket.status}</span>
                                    <span className="font-bold text-green-600">NT${ticket.price}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>



        </div>
    );

















}


export default TicketSection;