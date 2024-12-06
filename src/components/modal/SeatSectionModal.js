import React, { useEffect, useState } from "react";
import ApiService from "../../api/ApiService";
import { useNavigate } from "react-router-dom";

const SeatSectionModal = ({
    isOpen,
    onClose,
    eventId,
    zone
}) => {
    const [seats, setSeats] = useState([]);
    const [selectedSeats, setSelectedSeats] = useState([]);
    const userName = localStorage.getItem("userName");
    const navigate = useNavigate();
    const [userCaptcha, setUserCaptcha] = useState('');
    const [captchaImage, setCaptchaImage] = useState('');
    const [captchaKey, setCaptchaKey] = useState('');



    const fetchCaptcha = async () => {
        try {
            const responses = await ApiService.fetchCAPTCHA(userName);
            const data = responses.data;
            setCaptchaImage(data.data.captchaImage);
            setCaptchaKey(data.data.captchaKey);
            console.log("驗證碼是:" + data.data.captchaKey)
        } catch (error) {
            console.error('Error fetching captcha:', error);
        }
    };


    // 驗證碼校驗邏輯
    const validateCaptchaFrontend = () => {
        console.log("userCaptcha:", userCaptcha);
        console.log("captchaKey:", captchaKey);
        return userCaptcha === captchaKey;
    };


    useEffect(() => {
        if (isOpen) {
            const fetchSeats = async () => {
                try {
                    const response = await ApiService.getSeatStatus(eventId, zone);

                    const totalSeats = response.data.data.quantity;
                    const seatStatuses = response.data.data.seatStatus;

                    const seatsData = Array.from({ length: totalSeats }, (_, i) => ({
                        number: i + 1,
                        isAvailable: seatStatuses[i + 1] === "未售出"
                    }));

                    setSeats(seatsData);
                } catch (error) {
                    console.error("無法載入座位資料", error);
                }
            };
            fetchCaptcha();
            fetchSeats();
        }
        
                // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen, eventId, zone,]);

    const handleSeatSelection = (seat) => {
        if (!seat.isAvailable || selectedSeats.length >= 4){
            alert("請點選座位")
            return;
        } 

     
        setSelectedSeats(prevSelected => {
            if (prevSelected.includes(seat.number)) {
                return prevSelected.filter(selectedSeat => selectedSeat !== seat.number);
            } else {
                return [...prevSelected, seat.number];
            }
        });
    };

    const handleConfirmSelection = () => {
        const isValid = validateCaptchaFrontend();
        if (!isValid) {
            fetchCaptcha(); // 刷新驗證碼
            alert("驗證碼輸入錯誤，請重試！");
            return;
        }
        if (selectedSeats.length > 0) {
            const ticketInfo = {
                poolNumber: selectedSeats,
                eventId: eventId,
                section: zone,
                userName: userName
            };

            console.log("訂票資訊：", ticketInfo);
            onClose(ticketInfo);
            navigate("/event/ticket/section/buy", { state: ticketInfo });

        }

    };

    const handleClose = () => {
        setSelectedSeats([]); // 清空已選座位
        onClose();
    };

    // 將座位號碼轉換為排數和座位號
    const formatSeatDisplay = (seatNumber) => {
        const row = Math.ceil(seatNumber / 25);
        const seatInRow = ((seatNumber - 1) % 25) + 1;
        return `${row}排${seatInRow}號`;
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex w-full justify-center items-center">
            <div className="bg-white rounded-lg shadow-lg p-6 w-11/12 h-4/5 overflow-auto">
                <div className="mb-4">
                    <div className="bg-gray-100 p-4 rounded-lg">
                        {/* 選擇座位摘要 */}
                        <SelectedSeatsSummary selectedSeats={selectedSeats} />
                        {/* 顯示選擇座位 */}
                        <SelectedSeatsList selectedSeats={selectedSeats} formatSeatDisplay={formatSeatDisplay} />
                        {/* 確認按鈕 */}               
                        <SeatSelectionButton selectedSeats={selectedSeats} handleClose={handleClose} handleConfirmSelection={handleConfirmSelection} />
                        
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
                    </div>
                </div>

                <h2 className="text-xl font-bold mb-4 text-center">選擇座位 - {zone}</h2>

                {/* 列印座位 */}
                <SeatSelectionGrid formatSeatDisplay={formatSeatDisplay} selectedSeats={selectedSeats} seats={seats} handleSeatSelection={handleSeatSelection} />
            </div>
        </div>
    );
};

export default SeatSectionModal;



const SelectedSeatsSummary = ({ selectedSeats }) => {
    return (<div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-semibold">已選座位</h3>
        <div className="text-sm text-gray-600">
            已選 {selectedSeats.length} 個座位 (上限 4 個)
        </div>
    </div>)

}

const SelectedSeatsList = ({ selectedSeats, formatSeatDisplay }) => {
    return (
        <div className="flex flex-wrap gap-2">
            {selectedSeats.length > 0 ? (
                selectedSeats.map(seat => (
                    <span
                        key={seat}
                        className="bg-blue-500 text-white px-2 py-1 rounded text-xs"
                    >
                        {formatSeatDisplay(seat)}
                    </span>
                ))
            ) : (
                <span className="text-gray-500">尚未選擇座位</span>
            )}
        </div>)



}

const SeatSelectionButton = ({ selectedSeats, handleClose, handleConfirmSelection }) => {
    return (<div className="mt-3 flex justify-end space-x-2">
        <button
            className={`text-white px-4 py-2 rounded ${selectedSeats.length > 0
                    ? 'bg-green-500 hover:bg-green-600'
                    : 'bg-gray-400 cursor-not-allowed'
                }`}
            onClick={handleConfirmSelection}
            disabled={selectedSeats.length === 0}
        >
            確認選座
        </button>
        <button
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            onClick={handleClose}
        >
            取消
        </button>
    </div>)

}

const SeatSelectionGrid = ({ formatSeatDisplay, selectedSeats, seats, handleSeatSelection }) => {

    return (<div
        className="grid gap-3"
        style={{
            gridTemplateColumns: "repeat(25, minmax(0, 1fr))",
        }}>
        {seats.map((seat) => (
            <label
                key={seat.number}
                className={`inline-flex flex-col items-center text-sm ${seat.isAvailable && selectedSeats.length < 4 ? "cursor-pointer" : "cursor-not-allowed"
                    }`}
            >
                <input
                    type="checkbox"
                    className="hidden"
                    checked={selectedSeats.includes(seat.number)}
                    disabled={!seat.isAvailable || selectedSeats.length >= 4}
                    onChange={() => handleSeatSelection(seat)}
                />

                <div
                    className={`w-8 h-8 border rounded flex items-center justify-center text-xs ${selectedSeats.includes(seat.number)
                            ? "bg-blue-500 text-white"
                            : seat.isAvailable
                                ? "bg-white border-green-500 text-green-500 hover:bg-green-500 hover:text-white"
                                : "bg-gray-300 border-gray-400 text-gray-500"
                        }`}
                >
                </div>

                {formatSeatDisplay(seat.number)}
            </label>
        ))}
    </div>)

}