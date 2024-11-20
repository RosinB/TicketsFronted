import { useEffect, useState } from "react";
import ApiService from "../api/ApiService";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import { useLocation, useNavigate } from "react-router-dom";

function TicketSection() {
    const location = useLocation();
    const { eventId } = location.state || {};
    const [loading, setLoading] = useState(true);
    const [event, setEvent] = useState(null); // 活動信息
    const [tickets, setTickets] = useState([]); // 票價信息
    const navigate = useNavigate();
    const userName = localStorage.getItem("userName");



    useEffect(() => {

        if (!eventId) {
            console.error("eventId 不存在！");
            alert("ID不存在");
            navigate("/");
            return;
        }

        const fetchTicketSection = async () => {

            try {
                const response = await ApiService.getTicketSection(eventId, userName);
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
                // 這是ticketDto
                setTickets(
                    data.ticketDto.map((ticket) => ({
                        zone: ticket.ticketName,
                        price: ticket.ticketPrice,
                        status: ticket.ticketIsAvailable ? "熱賣中" : "售完",
                        quantity: 0, // 初始化數量為 0
                        remaining: ticket.ticketRemaining
                    }))
                );

            } catch (error) {
                if (error.response) {
                    const { status, data } = error.response; // 確保從 error.response 中提取正確的內容
                    const errorMessage = data.message;

                    if (status === 400 && errorMessage === "使用者沒有認證") {
                        alert("使用者未認證，請檢查您的帳號狀態。");
                        navigate("/user/update");
                    }

                    console.log("演唱會區域價位沒有加載到");
                    return <div className="text-center text-red-500">活動數據加載失敗！</div>;
                }

            } finally {
                setLoading(false);
            }
        };
        fetchTicketSection();


        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [eventId]);


    if (loading) return <LoadingSpinner />;
    




    const handleQuantityChange = (index, value) => {
        setTickets((prevTickets) => {
            const updatedTickets = prevTickets.map((ticket, i) => ({
                ...ticket,
                quantity: i === index ? value : 0, // 只允許當前索引更新數量，其它區域數量歸零
            }));
            return updatedTickets;
        });
    };


    //檢查購票狀態
    const handleCheckout = () => {
        const selectedTicket = tickets.find((ticket) => ticket.quantity > 0);

        if (!selectedTicket) {
            alert("請選擇一個票區並輸入數量！");
            return;
        }

        const ticketInfo = {
            eventId, // 演唱會 ID
            section: selectedTicket.zone, // 票區名稱
            quantity: selectedTicket.quantity, // 選擇的票數
            userName: userName // 替換為實際的使用者名稱變數
        };
        
        navigate("/event/ticket/section/buy", { state: ticketInfo });
    };



    return (
        <div className="pt-4">
            {/* 上部分 */}
            <EventInfoCard event={event} />


            {/* 下部分 */}
            <div className="flex flex-col items-center h-[60vh] ">
                
                <div className="max-w-4xl w-full grid grid-cols-2 gap-4 h-full">
                    {/* 場地平面圖 */}
                    <div>
                        <img
                            src={event.imageUrl}
                            alt="場地平面圖"
                            className="w-full h-full rounded-lg shadow-lg"/>
                    </div>

                    
                    <div className="bg-white  rounded-lg shadow-lg  border border-gray-200">
                        <h2 className="text-base font-medium text-white   text-center bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 pb-1 pt-1  shadow-sm ">
                            票區一覽
                        </h2>

                        <ul className="">
                            {tickets.map((ticket, index) => (
                                <li
                                    key={index}
                                    className="flex justify-between items-center  p-4   border-b border-gray-200  hover:shadow-lg transition-shadow">


                                    {/* 票區名稱和狀態 */}
                                    <div className="flex items-center w-1/3 space-x-2">
                                        <span className="font-medium text-sm sm:text-base text-gray-800">
                                            {ticket.zone}</span>

                                        <span
                                            className={`px-2 py-0.5 text-xs sm:text-sm rounded-md font-medium 
                                                ${ticket.status === "熱賣中" && ticket.remaining > 0 && ticket.remaining < 100
                                                    ?   "bg-orange-500 text-white" // 剩餘票數橙色
                                                    :   ticket.status === "熱賣中" 
                                                    ?   "bg-green-500 text-white" // 熱賣中綠色
                                                    :   "bg-red-500 text-white"   // 售完紅色
                                                }`}>
                                                    {ticket.status === "熱賣中" &&   ticket.remaining < 100 
                                                    ?   `剩餘 ${ticket.remaining} 張` : 
                                                        ticket.status}</span>

                                    </div>

                                    {/* 票價和數量選擇器 */}
                                    <div className="flex flex-col items-end w-1/3">
                                        <span className="font-bold text-green-600 whitespace-nowrap mb-1">
                                            ${ticket.price}
                                        </span>
                                        {ticket.status === '熱賣中' ? (
                                            <input
                                                type="number"
                                                min="0"
                                                value={ticket.quantity}
                                                onChange={(e) =>
                                                handleQuantityChange(index, parseInt(e.target.value, 4) || 0)}

                                                className="w-16 border border-gray-400 rounded text-center text-sm focus:ring focus:ring-blue-300 focus:outline-none shadow-md"
                                            />
                                        ) : (
                                            <span className="text-red-500 text-sm font-semibold">售完</span>
                                        )}
                                    </div>    
                                </li>
                            ))}
                        </ul>


                        {/* 購票按鈕 */}
                        <div className="text-center mt-6">
                            <button
                                className="bg-blue-500 text-white text-sm sm:text-base px-5 sm:px-6 py-2 sm:py-3 rounded-lg shadow-md hover:bg-blue-600 hover:shadow-lg transition-all"
                                onClick={handleCheckout}
                            >
                                確認購票
                            </button>
                        </div>
                    </div>



                </div>
            </div>
        </div>
    );
}

export default TicketSection;





const EventInfoCard = ({ event }) => {
    return (
            <div className="relative flex flex-col items-center bg-gradient-to-r from-gray-100 via-gray-200 to-gray-300 w-full -mt-12 min-h-[50px]">
                <div className="grid grid-cols-3 gap-3 mb-3 max-w-4xl mx-auto">
                    {/* 左側圖片 */}
                    <div
                        className="bg-cover bg-center rounded-lg shadow-lg w-32 aspect-square mx-auto mt-3 mb-2 mx-9"
                        style={{ backgroundImage: `url(${event.imageUrl})` }}/>

                    {/* 右側活動資訊 */}
                    <div className="col-span-2 bg-white p-2 rounded-lg shadow-lg">
                        <h1 className="text-lg font-bold mb-2">{event.name}</h1>
                        <p className="text-gray-700 mb-1">演出者：{event.performer}</p>
                        <p className="text-gray-700 mb-1">
                        📅 {event.date} | 🕗 {event.time} 📍 {event.location}
                        </p>
                        <p className="text-gray-700">主辦單位：{event.organizer}</p>
                    </div>
                </div>
        </div>
    );
};
