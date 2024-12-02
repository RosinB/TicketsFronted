import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import ApiService from "../../../api/ApiService";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

function RealTimeTicket() {
    const { eventId } = useParams();
    const [event, setEvent] = useState({
        eventName: "",
        dto: [],
    });
    const [socket, setSocket] = useState(null);
    const [error, setError] = useState(null);
    const [wsInitialized, setWsInitialized] = useState(false);
    const [retryCount, setRetryCount] = useState(0);
    const MAX_RETRIES = 3;

    const connectWebSocket = useCallback(() => {
        const ws = new WebSocket("ws://localhost:8080/ws/tickets");

        ws.onopen = () => {
            console.log("WebSocket 已連接");
            setError(null);
            // 重置重試計數
            setRetryCount(0);
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
            console.error("WebSocket 發生錯誤:", e);
            setError("WebSocket 連接錯誤，正在嘗試重新連接");
        };

        ws.onclose = () => {
            console.log("WebSocket 已斷開");
            setSocket(null);
            setWsInitialized(false);

            // 實現重連機制
            if (retryCount < MAX_RETRIES) {
                console.log(`嘗試重新連接... (${retryCount + 1}/${MAX_RETRIES})`);
                setRetryCount(prev => prev + 1);
                setTimeout(connectWebSocket, 3000); // 3秒後重試
            } else {
                setError("WebSocket 連接失敗，請重新載入頁面");
            }
        };

        setSocket(ws);
    }, [retryCount]);

    const fetchRealTime = useCallback(async () => {
        try {
            const response = await ApiService.fetchRealTimeTicket(eventId);
            setEvent(response.data.data);
        } catch (error) {
            console.error("Error fetching real-time ticket data:", error);
            setError("獲取票務數據失敗");
        }
    }, [eventId]);

    const handleLockToggle = async (ticketName, ticketIsAvailable) => {
        try {
            const locked = {
                eventId,
                ticketName,
                ticketIsAvailable: !ticketIsAvailable
            };
            await ApiService.lockTicket(locked);
            alert(`票區 ${ticketName} ${ticketIsAvailable ? '鎖票' : '放票'}成功`);
            await fetchRealTime();
        } catch (err) {
            alert(`操作失敗: ${err.message}`);
        }
    };

    const handleBalanceTicket = async (section) => {
        try {
            const response = await ApiService.blanceTicket(eventId, section);
            console.log(response.data.data);
            alert("整理票券成功");
            await fetchRealTime();
        } catch (error) {
            console.error("整理票券失敗:", error);
            alert("整理票券失敗");
        }
    };

    const handleClearTicket = async (section) => {
        try {
            await ApiService.clearTicket(eventId,section);
            alert("清票成功");
            await fetchRealTime();
        } catch (error) {
            console.error("清票失敗:", error);
            alert("清票失敗");
        }
    };

    // 初始化 WebSocket 連接
    useEffect(() => {
        fetchRealTime();
        connectWebSocket();

        return () => {
            if (socket) {
                socket.close();
            }
        };

        //待驗證
                // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [connectWebSocket, fetchRealTime]);

    // 訂閱數據
    useEffect(() => {
        if (!wsInitialized && socket && event.dto.length > 0 && socket.readyState === WebSocket.OPEN) {
            event.dto.forEach((ticket) => {
                const subscriptionData = {
                    eventId: parseInt(eventId),
                    section: ticket.ticketName,
                };
                socket.send(JSON.stringify(subscriptionData));
                console.log("已發送訂閱條件:", subscriptionData);
            });
            setWsInitialized(true);
        }
    }, [socket, event.dto, eventId, wsInitialized]);
    // 為圖表準備數據
    const chartData = event.dto.map(ticket => ({
        總票數:ticket.ticketQuantity,
        name: ticket.ticketName,
        已售出: ticket.ticketQuantity - (ticket.remaining || 0),
        剩餘: ticket.remaining || 0
    }));
    console.log(chartData)
    return (
        <div className="flex flex-col min-h-screen bg-gray-900 text-white p-8">
            <div className="text-center mb-8">
                <h1 className="text-4xl font-bold mb-6">實時票務監控</h1>
                <div className="flex justify-center items-center gap-4 mb-4">
                    <p className="text-2xl">
                        活動 ID: <span className="text-teal-400">{eventId}</span>
                    </p>
                    <p className="text-2xl">
                        活動名稱: <span className="text-teal-400">{event.eventName}</span>
                    </p>
                </div>
            </div>

            {/* 圖表區域 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                {/* 長條圖 */}
                <div className="bg-gray-800 p-6 rounded-xl shadow-xl">
                    <h3 className="text-xl font-semibold mb-4">票區銷售狀況</h3>
                    <div className="h-[400px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData}
                                stackOffset="sign"  >
                                <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                                <XAxis dataKey="name" stroke="#fff" />
                                <YAxis dataKey="總票數"stroke="#fff" 

                                />
                                <Tooltip 
                                    contentStyle={{ backgroundColor: '#1f2937', border: 'none', color: '#fff' }}
                                    labelStyle={{ color: '#fff' }}
                                />
                                <Legend />
                                <Bar dataKey="已售出" fill="#ef4444" />
                                <Bar dataKey="剩餘" fill="#22c55e" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* 進度圈 */}
                <div className="grid grid-cols-2 gap-4">
                    {event.dto.map((ticket, index) => {
                        const soldPercentage = ((ticket.ticketQuantity - (ticket.remaining || 0)) / ticket.ticketQuantity) * 100;
                        return (
                            <div key={index} className="bg-gray-800 p-4 rounded-xl">
                                <div className="w-32 h-32 mx-auto">
                                    <CircularProgressbar
                                        value={soldPercentage}
                                        text={`${Math.round(soldPercentage)}%`}
                                        styles={buildStyles({
                                            textColor: '#fff',
                                            pathColor: soldPercentage > 80 ? '#ef4444' : '#22c55e',
                                            trailColor: '#374151'
                                        })}
                                    />
                                </div>
                                <p className="text-center mt-2">{ticket.ticketName}</p>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* 表格區域 */}
            <div className="overflow-x-auto">
                <table className="table-auto mx-auto text-left text-lg border-collapse border border-gray-700">
                    <TableHeader />
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
                                        {ticket.remaining !== undefined ? ticket.remaining : "加載中..."}
                                    </td>
                                    <td className="border border-gray-700 px-6 py-4 text-center">
                                        <button
                                            onClick={() => handleLockToggle(ticket.ticketName, ticket.ticketIsAvailable)}
                                            className={`px-4 py-2 rounded-md text-white ${
                                                ticket.ticketIsAvailable
                                                    ? "bg-red-500 hover:bg-red-600"
                                                    : "bg-blue-500 hover:bg-blue-600"
                                            } ${ticket.remaining === 0 ? "opacity-50 cursor-not-allowed" : ""}`}
                                            disabled={ticket.remaining === 0}
                                        >
                                            {ticket.ticketIsAvailable ? "鎖票" : "放票"}
                                        </button>
                                    </td>
                                    <td className="border border-gray-700 px-6 py-4 text-center">
                                        <button
                                            onClick={() => handleBalanceTicket(ticket.ticketName)}
                                            className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600"
                                        >
                                            整理
                                        </button>
                                    </td>
                                    <td className="border border-gray-700 px-6 py-4 text-center">
                                        <button
                                                onClick={() => handleClearTicket(ticket.ticketName)}  // 傳入票區名稱
                                                className="bg-orange-700 text-white px-4 py-2 rounded hover:bg-orange-800"
                                        >
                                            清票
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="8" className="text-center border border-gray-700 px-6 py-4">
                                    無票務數據
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {error && (
                <div className="bg-red-100 text-red-600 p-3 rounded-lg mt-4 shadow">
                    錯誤: {error}
                </div>
            )}
        </div>
    );
}

const TableHeader = () => (
    <thead className="bg-gray-800">
        <tr>
            <th className="border border-gray-700 px-6 py-4">票區名稱</th>
            <th className="border border-gray-700 px-6 py-4">票價</th>
            <th className="border border-gray-700 px-6 py-4">總票數</th>
            <th className="border border-gray-700 px-6 py-4">票卷狀況</th>
            <th className="border border-gray-700 px-6 py-4">剩餘票數</th>
            <th className="border border-gray-700 px-6 py-4">鎖票</th>
            <th className="border border-gray-700 px-6 py-4">整理票</th>
            <th className="border border-gray-700 px-6 py-4">清票</th>
        </tr>
    </thead>
);

export default RealTimeTicket;