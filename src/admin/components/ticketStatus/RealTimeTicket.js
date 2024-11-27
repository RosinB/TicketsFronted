import { useParams } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import ApiService from "../../../api/ApiService";

function RealTimeTicket() {
    const { eventId } = useParams();
    const [event, setEvent] = useState({
        eventName: "",
        dto: [],
    });
    const [socket, setSocket] = useState(null);
    const [error, setError] = useState(null);
    const [wsInitialized, setWsInitialized] = useState(false);



    const fetchRealTime = useCallback(async () => {
        try {
            const response = await ApiService.fetchRealTimeTicket(eventId);
            setEvent(response.data.data);
        } catch (error) {
            console.error("Error fetching real-time ticket data:", error);
        }
    }, [eventId]);


    const handleLockToggle = (ticketName, ticketIsAvailable) => {
        console.log(`鎖票操作: ${ticketName}`);
        const locked = {
            eventId,
            ticketName,
            ticketIsAvailable: !ticketIsAvailable
        }
        ApiService.lockTicket(locked)
            .then(() => {
                alert(`票區 ${ticketName} 鎖票成功`)
                fetchRealTime();

            })
            .catch((err) => alert(`鎖票失敗: ${err.message}`));
    };




    useEffect(() => {
        fetchRealTime();

        const ws = new WebSocket("ws://localhost:8080/ws/tickets");

        ws.onopen = () => {
            console.log("WebSocket 已連接");
        };

        ws.onmessage = (eventMessage) => {
            try {
                const data = JSON.parse(eventMessage.data);

                if (data.eventId && data.section && data.remainingTickets !== undefined) {
                    setEvent((prevEvent) => ({
                        ...prevEvent,
                        dto: prevEvent.dto.map((ticket) =>
                            ticket.ticketName === data.section
                                ? { ...ticket, remaining: data.remainingTickets }
                                : ticket
                        ),
                    }));
                } else {
                    console.error("推送的數據中缺少必需字段:", data);
                }
            } catch (e) {
                console.error("數據解析失敗:", e.message);
                setError("數據解析失敗，請檢查後端數據格式");
            }
        };

        ws.onerror = (e) => {
            console.error("WebSocket 發生錯誤:", e.message);
            setError("WebSocket 發生錯誤，請檢查後端連接");
        };

        ws.onclose = () => {
            console.log("WebSocket 已斷開");
            setSocket(null);
        };

        setSocket(ws);

        return () => {
            if (ws) ws.close();
        };
    }, [fetchRealTime, eventId]);

    // 發送訂閱數據，確保只執行一次
    useEffect(() => {
        if (!wsInitialized && socket && event.dto.length > 0) {
            event.dto.forEach((ticket) => {
                const subscriptionData = {
                    eventId: parseInt(eventId),
                    section: ticket.ticketName,
                };
                socket.send(JSON.stringify(subscriptionData));
                console.log("已發送訂閱條件:", subscriptionData);
            });
            setWsInitialized(true); // 標記已初始化
        }
    }, [socket, event.dto, eventId, wsInitialized]);



    return (
        <div className="flex mt-5 justify-center min-h-screen bg-gray-900 text-white">
            <div className="text-center">
                <h1 className="text-4xl font-bold mb-6">實時查詢票務</h1>
                <p className="text-2xl mb-4">
                    活動 ID: <span className="text-teal-400">{eventId}</span>
                </p>
                <p className="text-2xl mb-8">
                    活動名稱: <span className="text-teal-400">{event.eventName}</span>
                </p>

                <table className="table-auto mx-auto text-left text-lg border-collapse border border-gray-700">

                    <TableName />
                    <tbody>
                        {event.dto.length > 0 ? (
                            event.dto.map((ticket, index) => (
                                <tr key={index} className="bg-gray-900 hover:bg-gray-800">
                                    <td className="border border-gray-700 px-6 py-4">{ticket.ticketName}</td>
                                    <td className="border border-gray-700 px-6 py-4">{ticket.ticketPrice}</td>
                                    <td className="border border-gray-700 px-6 py-4">{ticket.ticketQuantity}</td>
                                    <td className="border border-gray-700 px-6 py-4 text-center">
                                        {ticket.ticketIsAvailable ? (
                                            <i className="fas fa-circle text-green-500"></i>
                                        ) : (
                                            <i className="fas fa-circle text-red-500"></i>
                                        )}
                                    </td>

                                    <td className="border border-gray-700 px-6 py-4">
                                        {ticket.remaining !== undefined
                                            ? ticket.remaining
                                            : "加載中..."}
                                    </td>
                                    {/* 鎖票按鈕 */}
                                    <td className="border border-gray-700 px-6 py-4 text-center">
                                        <button
                                            onClick={() => handleLockToggle(ticket.ticketName, ticket.ticketIsAvailable)}
                                            className={`px-4 py-2 rounded-md text-white ${ticket.ticketIsAvailable
                                                    ? "bg-red-500 hover:bg-red-600"
                                                    : "bg-blue-500 hover:bg-blue-600"
                                                } ${ticket.remaining === 0 ? "opacity-50 cursor-not-allowed" : ""}`}
                                            disabled={ticket.remaining === 0} // 當 remaining 為 0 時禁用按鈕
                                        >
                                            {ticket.ticketIsAvailable ? "鎖票" : "放票"}
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="text-center border border-gray-700 px-6 py-4">
                                    無票務數據
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>

                {error && (
                    <div className="bg-red-100 text-red-600 p-3 rounded-lg mt-4 shadow">
                        錯誤: {error}
                    </div>
                )}
            </div>
        </div>
    );
}

export default RealTimeTicket;

const TableName = () => {

    return (<thead className="bg-gray-800">
        <tr>
            <th className="border border-gray-700 px-6 py-4">票區名稱</th>
            <th className="border border-gray-700 px-6 py-4">票價</th>
            <th className="border border-gray-700 px-6 py-4">總票數</th>
            <th className="border border-gray-700 px-6 py-4">票卷狀況</th>
            <th className="border border-gray-700 px-6 py-4">剩餘票數</th>
            <th className="border border-gray-700 px-6 py-4">已完成訂單數</th>
            <th className="border border-gray-700 px-6 py-4">鎖票</th>

        </tr>
    </thead>)


}