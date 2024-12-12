import { useEffect, useState } from "react";
import ApiService from "../api/ApiService";
import LoadingSpinner from "../components/modal/LoadingSpinner";
import { useLocation, useNavigate } from "react-router-dom";
import SeatSectionModal from "../components/modal/SeatSectionModal"
import { Music2, Calendar, Clock, MapPin, Users } from 'lucide-react';

function TicketSection() {
    const location = useLocation();
    const { eventId } = location.state || {};
    const navigate = useNavigate();
    const userName = localStorage.getItem("userName");


    const [loading, setLoading] = useState(true);
    const [event, setEvent] = useState(null); // 活動信息
    const [tickets, setTickets] = useState(null); // 票價信息
    const [isModalOpen, setIsModalOpen] = useState(false); // 控制彈窗的狀態
    const [selectedZone, setSelectedZone] = useState(null); // 當前選擇的票區

    const [captchaImage, setCaptchaImage] = useState('');
    const [captchaKey, setCaptchaKey] = useState('');
    const [userCaptcha, setUserCaptcha] = useState('');



    const fetchCaptcha = async () => {
        try {
            const response = await ApiService.fetchCAPTCHA();
            const data = response.data;
            setCaptchaImage(data.data.captchaImage);
            setCaptchaKey(data.data.captchaKey);
            console.log("驗證碼是:"+data.data.captchaKey)
        } catch (error) {
            console.error('Error fetching captcha:', error);
        }
    };



    const handleSeatSelection = async (zone) => {
        setSelectedZone(zone); // 設置當前選擇的票區
        setIsModalOpen(true); // 打開彈窗
    };
    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedZone(null);
    };

    //====================API==========================
    const fetchTicketSection = () => {
        if (!eventId) {
            console.error("eventId 不存在！");
            alert("ID不存在");
            navigate("/");
            return;
        }

        ApiService.getTicketSection(eventId)
            .then(({ data: { data } }) => {
                setEvent(formatEventData(data));
                setTickets(formatTicketData(data.ticketDto));
                setLoading(false);
            }

            )
            .catch((error) => {
                handleError(error)
                setLoading(false)
                return;  // 確保錯誤時不會繼續執行
            })
    };

    // 驗證用戶輸入的驗證碼 (前端)
    const validateCaptchaFrontend = () => {
        // 檢查驗證碼是否為6位數字

        console.log("userCaptcha是:"+userCaptcha)
        console.log("captchaKey是"+captchaKey)
        
        return userCaptcha === captchaKey;
    };

    //封裝回傳錯誤
    const handleError = (error) => {

        alert("使用者未認證，請檢查您的帳號狀態。");
        setTimeout(() => {
            navigate("/user/update");
        }, 100);
    }




    //獲得演唱會資訊
    const formatEventData = (data) => ({
        name: data.eventName,
        performer: data.eventPerformer,
        date: data.eventDate,
        time: data.eventTime,
        location: data.eventLoaction,
        organizer: data.hostName,
        imageUrl: data.ticketPicList,
        section: data.ticketPicSection
    });

    //獲得演唱會票價位置
    const formatTicketData = (ticketDto) =>
        ticketDto.map(ticket => ({
            zone: ticket.ticketName,
            price: ticket.ticketPrice,
            status: ticket.ticketIsAvailable ? "熱賣中" : "售完",
            quantity: 0,
            remaining: ticket.ticketRemaining
        }));



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
        const isValid = validateCaptchaFrontend();
        if (!isValid) {
            alert("驗證碼輸入錯誤");
            fetchCaptcha();

            return;
        }
    
        const ticketInfo = {
            eventId, // 演唱會 ID
            section: selectedTicket.zone, // 票區名稱
            quantity: selectedTicket.quantity, // 選擇的票數
            userName: userName, // 替換為實際的使用者名稱變數
            userCaptcha
        };

        navigate("/event/ticket/section/buy", { state: ticketInfo });
    };

    useEffect(() => {
        fetchCaptcha();

        fetchTicketSection();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [eventId]);

    if (loading) return <LoadingSpinner />;
    if (!event) return null;  // 如果沒有數據，不渲染任何內容


    return (
        <div className="pt-4">
            {/* 上部分 */}
            <EventInfoCard event={event} />


            {/* 下部分 */}
            <div className="flex flex-col items-center  ">
                <div className="max-w-4xl w-full grid grid-cols-2 gap-4 h-full ">
                    {/* 場地平面圖 */}
                    <VenueMap imageUrl={event.section} />

                    <div className="bg-white  rounded-lg shadow-lg  border-2 border-blue-200">
                        {/* 標題 */}
                        <SectionTitle />

                        {/* 票區選擇 */}
                        <ul className="">
                            {tickets.map((ticket, index) => (
                                <TicketZoneInfo
                                    key={index}
                                    ticket={ticket}
                                    index={index}
                                    onSeatSelection={handleSeatSelection}
                                    onQuantityChange={handleQuantityChange} />
                            ))}
                        </ul>

                        <div className="flex items-center justify-between mt-5">
                            <div className="captcha-container flex items-center mt-3">
                                {captchaImage && (
                                    <img
                                        src={captchaImage}
                                        alt="驗證碼"
                                        onClick={fetchCaptcha}
                                        className="w-28 h-12 cursor-pointer border border-gray-300 rounded mr-3"
                                    />
                                )}
                                <input
                                    type="text"
                                    value={userCaptcha}
                                    onChange={(e) => setUserCaptcha(e.target.value)}
                                    className=" w-28 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="驗證碼"
                                />
                            </div>
                            <CheckoutButton onClick={handleCheckout} />
                        </div>

                    </div>

                </div>
            </div>
            {/* 模態框 */}
            <SeatSectionModal
                isOpen={isModalOpen}
                onClose={closeModal}
                eventId={eventId}
                zone={selectedZone}
            />
        </div>
    );
}

export default TicketSection;






// 確認購票按鈕元件
const CheckoutButton = ({ onClick }) => (
    <div className="text-center mt-5">
        <button
            className="bg-blue-500 text-white text-sm sm:text-base px-5 sm:px-6 py-2 sm:py-3 rounded-lg shadow-md hover:bg-blue-600 hover:shadow-lg transition-all"
            onClick={onClick}
        >
            確認購票
        </button>
    </div>
);

// 票區標題元件
const SectionTitle = () => (
    <h2 className="text-base font-medium text-white text-center bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 pb-1 pt-1 shadow-sm">
        票區一覽
    </h2>
);

// 場地平面圖元件
const VenueMap = ({ imageUrl }) => (
    <div className="overflow-hidden flex justify-center items-center ">
        <img
            src={imageUrl}
            alt="場地平面圖"
            className="rounded-lg shadow-lg"
        />
    </div>
);



const EventInfoCard = ({ event }) => {
    return (
        <div className="relative flex flex-col items-center bg-white w-full -mt-12  border-2 border-blue-200">
            <div className="grid grid-cols-3 gap-4 max-w-4xl mx-auto p-3 ">
                {/* 左側圖片 */}
                <div className="overflow-hidden rounded-lg shadow-md border border-gray-100">
                    <img
                        src={event.imageUrl}
                        alt={event.name}
                        className="w-full h-36 object-cover hover:scale-105 transition-transform duration-300"
                    />
                </div>

                {/* 右側活動資訊 */}
                <div className="col-span-2 bg-white p-3 rounded-lg border-2 border-blue-100">
                    {/* 標題 */}
                    <div className="flex items-center gap-2 mb-2">
                        <Music2 className="w-5 h-5 text-blue-500" />
                        <h1 className="text-lg font-bold text-gray-800">{event.name}</h1>
                    </div>

                    {/* 演出資訊列表 */}
                    <div className="grid grid-cols-2 gap-2">
                        <div className="flex items-center gap-2">
                            <Users className="w-4 h-4 text-blue-500" />
                            <span className="text-gray-600 text-sm">演出者：</span>
                            <span className="text-gray-800">{event.performer}</span>
                        </div>

                        <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-blue-500" />
                            <span className="text-gray-600 text-sm">演出日期：</span>
                            <span className="text-gray-800">{event.date}</span>
                        </div>

                        <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-blue-500" />
                            <span className="text-gray-600 text-sm">演出時間：</span>
                            <span className="text-gray-800">{event.time}</span>
                        </div>

                        <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-blue-500" />
                            <span className="text-gray-600 text-sm">演出地點：</span>
                            <span className="text-gray-800">{event.location}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
const TicketZoneInfo = ({ ticket, onSeatSelection, onQuantityChange, index }) => {
    return (
        <div className="border-b border-gray-200 last:border-b-0 ">
            <div className="flex justify-between items-center p-4 -mb-3  hover:bg-gray-50 transition-colors ">
                {/* 左側：票區名稱和狀態 */}
                <div className="flex items-center gap-2">
                    <span className="font-semibold text-gray-800">
                        {ticket.zone}
                    </span>
                    <span className={`px-2 py-1 text-xs rounded-full font-medium ${ticket.status === "熱賣中" && ticket.remaining > 0 && ticket.remaining < 100
                        ? "bg-orange-100 text-orange-600"
                        : ticket.status === "熱賣中"
                            ? "bg-green-100 text-green-600"
                            : "bg-red-100 text-red-600"
                        }`}>
                        {ticket.status === "熱賣中" && ticket.remaining < 100
                            ? `剩餘 ${ticket.remaining} 張`
                            : ticket.status}
                    </span>
                </div>

                {/* 右側：票價和數量選擇 */}
                <div className="flex items-center ">
                    <span className="font-bold text-blue-600 -mr-6 min-w-[80px]">
                        ${ticket.price}
                    </span>
                    {ticket.status === '熱賣中' && (
                        <input
                            type="number"
                            min="0"
                            max="4"
                            value={ticket.quantity}
                            onChange={(e) => onQuantityChange(index, parseInt(e.target.value, 4) || 0)}
                            className="w-20 px-3 py-1 border border-gray-300 rounded-lg text-center focus:ring-2 focus:ring-blue-300 outline-none"
                        />
                    )}
                </div>
            </div>

            {/* 座位選擇按鈕 */}
            <div className="px-4 pb-3">
                <button
                    onClick={() => onSeatSelection(ticket.zone)}
                    className="text-sm text-blue-500 hover:text-blue-600 transition-colors"
                >
                    查看座位圖
                </button>
            </div>
        </div>
    );
};
