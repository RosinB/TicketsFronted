import { useEffect, useState, useNavigate } from "react";
import ApiService from "../../api/ApiService";
import LoadingSpinner from "../../components/LoadingSpinner";
import { useLocation } from "react-router-dom";

function TicketSection() {
    const location = useLocation();
    const { eventId } = location.state || {};
    const [loading, setLoading] = useState(true);
    const [event, setEvent] = useState(null); // 活動信息
    const [tickets, setTickets] = useState([]); // 票價信息
    const navigate = useNavigate();


    const fetchTicketSection = async () => {
        console.log("我的號碼是" + eventId);

        try {
            const response = await ApiService.getTicketSection(eventId);
            const data = response.data.data;

            // 將後端返回的數據分配給相應的狀態
            setEvent({
                name: data.eventName,
                performer: data.eventPerformer,
                date: data.eventDate,
                time: data.eventTime,
                location: data.eventLoaction,
                organizer: data.hostName,
                imageUrl: data.ticketPicList,
            });

            setTickets(
                data.ticketDto.map((ticket) => ({
                    zone: ticket.ticketName,
                    price: ticket.ticketPrice,
                    status: ticket.ticketIsAvailable ? "熱賣中" : "售罄",
                }))
            );
        } catch (error) {
            console.log("演唱會區域價位沒有加載到");
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!eventId) {
            console.error("eventId 不存在！");
            return;
        }
        fetchTicketSection();
    }, [eventId]);

    if (loading) {
        return <LoadingSpinner />;
    }

    if (!event) {
        return <div className="text-center text-red-500">活動數據加載失敗！</div>;
    }


    const handleClick = () => {

        navigate("/goticket", { state: { eventId, } });


    }


    return (
        <div className="p-4">
            {/* 上部分 */}
            <div className="flex flex-col items-center -mt-12 bg-gradient-to-r from-gray-100 via-gray-200 to-gray-300 w-screen -mx-4">
                <div className="grid grid-cols-3 gap-3 mb-3 max-w-4xl mx-auto bg-gradient-to-r from-gray-100 via-gray-200 to-gray-300">
                    {/* 左側圖片 */}
                    <div
                        className="bg-cover bg-center rounded-lg shadow-lg  w-48 mx-auto"
                        style={{ backgroundImage: `url(${event.imageUrl})` }}
                    ></div>

                    {/* 右側活動資訊 */}
                    <div className="col-span-2 bg-white p-4 rounded-lg shadow-lg">
                        <h1 className="text-2xl font-bold mb-4">{event.name}</h1>
                        <p className="text-gray-700 mb-2">演出者：{event.performer}</p>
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
                            src={event.imageUrl}
                            alt="場地平面圖"
                            className="w-full h-full rounded-lg shadow-lg"
                        />
                    </div>

                    {/* 售票區域 */}
                    <div className="bg-white p-6 rounded-lg shadow-lg">
                        <h2 className="text-xl font-bold mb-4">票區一覽</h2>
                        <ul>
                            {tickets.map((ticket, index) => (
                                <li
                                    key={index}
                                    className="flex justify-between items-center mb-4"
                                >
                                    {/* 票區名稱和指示燈 */}
                                    <div className="flex items-center">
                                        <div className="w-4 h-4 bg-orange-500 rounded-full mr-2"></div>
                                        <span className="font-bold">{ticket.zone}</span>
                                    </div>

                                    {/* 票區狀態 */}
                                    <span className="bg-yellow-100 text-yellow-600 px-2 py-1 rounded">
                                        {ticket.status}
                                    </span>

                                    {/* 票價和按鈕 */}
                                    <div className="flex items-center space-x-4">
                                        <span className="font-bold text-green-600">
                                            NT${ticket.price}
                                        </span>
                                        {/* 購買按鈕 */}
                                        <button
                                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
                                            onClick={() => handleClick(ticket)}
                                        >
                                            購買
                                        </button>
                                    </div>
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
