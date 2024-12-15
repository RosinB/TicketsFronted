import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import ApiService from "../../../api/ApiService";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { useLocation } from "react-router-dom";
function RealTimeTicket() {
    const { eventId } = useParams();
    const [event, setEvent] = useState({
        eventName: "",
        dto: [],
    });
    const location = useLocation();
    const [socket, setSocket] = useState(null);
    const [error, setError] = useState(null);
    const [lastUpdate, setLastUpdate] = useState(new Date());
    const [isMonitoring, setIsMonitoring] = useState(true);

    //api
    const fetchRealTime = useCallback(async () => {
        try {
            const response = await ApiService.fetchRealTimeTicket(eventId);
            setEvent(response.data.data);
            setLastUpdate(new Date());
            return response.data.data;
        } catch (error) {
            console.error("Error fetching real-time ticket data:", error);
            setError("獲取票務數據失敗");
        }
    }, [eventId]);


    const initializeWebSocket = useCallback(() => {
        if (socket?.readyState === WebSocket.OPEN) {
            console.log("WebSocket 已經連接");
            return;
        }
        console.log("開始建立 WebSocket 連接...");
        const ws = new WebSocket("ws://localhost/ws/tickets");

        ws.onopen = () => {
            console.log("WebSocket 連接已建立");
            setSocket(ws);
            setError(null);
        };

        ws.onmessage = (event) => {
            // console.log("收到 WebSocket 消息:", event.data);
            try {
                const data = JSON.parse(event.data);
                if (data.eventId && data.section && data.remainingTickets !== undefined) {
                    setEvent(prevEvent => ({
                        ...prevEvent,
                        dto: prevEvent.dto.map(ticket =>
                            ticket.ticketName === data.section
                                ? { ...ticket, remaining: data.remainingTickets }
                                : ticket
                        )
                    }));
                    setLastUpdate(new Date());
                }
            } catch (error) {
                console.error("處理WebSocket消息失敗:", error);
            }
        };

        ws.onerror = (error) => {
            console.error("WebSocket 錯誤:", error);
            setError("WebSocket 連接錯誤");
        };

        ws.onclose = () => {
            console.log("WebSocket 連接已關閉");
            setSocket(null);
        };
    }, [socket?.readyState]);

    // 發送訂閱請求 (保持原有邏輯)
    const sendSubscriptions = useCallback(() => {
        // console.log("準備發送訂閱...", {
        //     socketExists: !!socket,
        //     readyState: socket?.readyState,
        //     hasData: !!event.dto?.length
        // });
        if (!socket || socket.readyState !== WebSocket.OPEN || !event.dto?.length) return;

        event.dto.forEach(ticket => {
            const subscription = {
                eventId: parseInt(eventId),
                section: ticket.ticketName
            };
            console.log("發送訂閱:", subscription);
            socket.send(JSON.stringify(subscription));
        });
    }, [socket, event.dto, eventId]);

    useEffect(() => {
        const initialize = async () => {
            await fetchRealTime();
            if (isMonitoring) {  // 只有在監控狀態時才初始化 WebSocket
                initializeWebSocket();
            }
        };

        if (isMonitoring) {  // 只有在監控狀態時才執行初始化
            initialize();
        }
        return () => {
            if (socket) {
                socket.onclose = null; // 移除 onclose 處理器避免觸發重新連接
                socket.close();
                setSocket(null);
            }
        };
    }, [initializeWebSocket, fetchRealTime, isMonitoring,socket]); // 添加 isMonitoring 作為依賴

    useEffect(() => {
        if (!isMonitoring) {  // 只有在非監控狀態時才執行路由跳轉
            const currentPath = window.location.pathname;
            if (location.pathname !== currentPath) {
                window.location.reload();
            }
        }
    }, [location, isMonitoring]);



    useEffect(() => {
        if (isMonitoring && socket?.readyState === WebSocket.OPEN && event.dto?.length > 0) {
            sendSubscriptions();
        }
    }, [socket?.readyState, event.dto, sendSubscriptions, isMonitoring]);

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
            await ApiService.clearTicket(eventId, section);
            alert("清票成功");
            await fetchRealTime();
        } catch (error) {
            console.error("清票失敗:", error);
            alert("清票失敗");
        }
    };
    const handleStopMonitoring = () => {
        if (socket) {
            socket.onclose = null;
            socket.onerror = null;
            socket.onmessage = null;
            socket.onopen = null;
            socket.close();
            setSocket(null);
        }
        setIsMonitoring(false);
    };
    // 統計數據
    const stats = {
        totalTickets: event.dto.reduce((acc, ticket) => acc + ticket.ticketQuantity, 0),
        totalRemaining: event.dto.reduce((acc, ticket) => acc + (ticket.remaining || 0), 0),
        totalRevenue: event.dto.reduce((acc, ticket) =>
            acc + ((ticket.ticketQuantity - (ticket.remaining || 0)) * ticket.ticketPrice), 0)
    };
    stats.totalSold = stats.totalTickets - stats.totalRemaining;

    // 為圖表準備數據
    const chartData = event.dto.map(ticket => ({
        總票數: ticket.ticketQuantity,
        name: ticket.ticketName,
        已售出: ticket.ticketQuantity - (ticket.remaining || 0),
        剩餘: ticket.remaining || 0
    }));


    return (
        <div className="flex flex-col min-h-screen bg-gray-900 text-white p-8">
            <div className="flex items-center justify-center gap-6 mb-8">
                <h1 className="text-4xl font-bold">實時票務監控</h1>
                <div className="w-px h-8 bg-gray-600" /> {/* 分隔線 */}
                <p className="text-2xl">
                    活動 ID: <span className="text-teal-400">{eventId}</span>
                </p>
                <div className="w-px h-8 bg-gray-600" /> {/* 分隔線 */}
                <p className="text-2xl">
                    活動名稱: <span className="text-teal-400">{event.eventName}</span>
                </p>
                <button
                    onClick={handleStopMonitoring}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                >
                    停止監控
                </button>
            </div>

            {/* 統計卡片 */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
                    <div className="flex justify-between items-center">
                        <h3 className="text-gray-400">總票數</h3>
                        <span className="text-2xl font-bold text-blue-400">
                            {stats.totalTickets.toLocaleString()}
                        </span>
                    </div>
                </div>
                <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
                    <div className="flex justify-between items-center">
                        <h3 className="text-gray-400">已售出</h3>
                        <span className="text-2xl font-bold text-green-400">
                            {stats.totalSold.toLocaleString()}
                        </span>
                    </div>
                </div>
                <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
                    <div className="flex justify-between items-center">
                        <h3 className="text-gray-400">剩餘票數</h3>
                        <span className="text-2xl font-bold text-yellow-400">
                            {stats.totalRemaining.toLocaleString()}
                        </span>
                    </div>
                </div>
                <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
                    <div className="flex justify-between items-center">
                        <h3 className="text-gray-400">總收入</h3>
                        <span className="text-2xl font-bold text-purple-400">
                            ${stats.totalRevenue.toLocaleString()}
                        </span>
                    </div>
                </div>
            </div>

            {/* 圖表區域 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                {/* 長條圖 */}
                <div className="bg-gray-800 p-6 rounded-xl shadow-xl">
                    <h3 className="text-xl font-semibold mb-4">票區銷售狀況</h3>
                    <div className="h-[400px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData} stackOffset="sign">
                                <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                                <XAxis dataKey="name" stroke="#fff" />
                                <YAxis stroke="#fff" />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: '#1f2937',
                                        border: 'none',
                                        color: '#fff',
                                        borderRadius: '8px'
                                    }}
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
                            <div key={index} className="bg-gray-800 p-6 rounded-xl shadow-xl">
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
                                <div className="text-center mt-4">
                                    <h4 className="text-lg font-semibold">{ticket.ticketName}</h4>
                                    <p className="text-gray-400 mt-2">
                                        剩餘: {ticket.remaining} / {ticket.ticketQuantity}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* 表格區域 */}
            <div className="overflow-x-auto bg-gray-800 rounded-xl shadow-xl">
                <table className="w-full text-left">
                    <thead className="bg-gray-700">
                        <tr>
                            <th className="px-6 py-4">票區名稱</th>
                            <th className="px-6 py-4">票價</th>
                            <th className="px-6 py-4">總票數</th>
                            <th className="px-6 py-4">票券狀況</th>
                            <th className="px-6 py-4">剩餘票數</th>
                            <th className="px-6 py-4">鎖票操作</th>
                            <th className="px-6 py-4">整理票券</th>
                            <th className="px-6 py-4">清票操作</th>
                        </tr>
                    </thead>
                    <tbody>
                        {event.dto.map((ticket, index) => (
                            <tr key={index} className="border-t border-gray-700 hover:bg-gray-700/50">
                                <td className="px-6 py-4">{ticket.ticketName}</td>
                                <td className="px-6 py-4">${ticket.ticketPrice.toLocaleString()}</td>
                                <td className="px-6 py-4">{ticket.ticketQuantity.toLocaleString()}</td>
                                <td className="px-6 py-4 text-center">
                                    <span className={`inline-flex h-3 w-3 rounded-full ${ticket.ticketIsAvailable ? 'bg-green-500' : 'bg-red-500'
                                        }`} />
                                </td>
                                <td className="px-6 py-4">
                                    {ticket.remaining !== undefined ?
                                        ticket.remaining.toLocaleString() :
                                        "載入中..."}
                                </td>
                                <td className="px-6 py-4">
                                    <button
                                        onClick={() => handleLockToggle(ticket.ticketName, ticket.ticketIsAvailable)}
                                        className={`
                                            px-4 py-2 rounded-lg text-white w-full
                                            ${ticket.ticketIsAvailable ?
                                                "bg-red-500 hover:bg-red-600" :
                                                "bg-blue-500 hover:bg-blue-600"}
                                            ${ticket.remaining === 0 ? "opacity-50 cursor-not-allowed" : ""}
                                            transition-colors duration-200
                                        `}
                                        disabled={ticket.remaining === 0}
                                    >
                                        {ticket.ticketIsAvailable ? "鎖票" : "放票"}
                                    </button>
                                </td>
                                <td className="px-6 py-4">
                                    <button
                                        onClick={() => handleBalanceTicket(ticket.ticketName)}
                                        className="w-full bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition-colors duration-200"
                                    >
                                        整理
                                    </button>
                                </td>
                                <td className="px-6 py-4">
                                    <button
                                        onClick={() => handleClearTicket(ticket.ticketName)}
                                        className="w-full bg-orange-700 hover:bg-orange-800 text-white px-4 py-2 rounded-lg transition-colors duration-200"
                                    >
                                        清票
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* 更新時間指示器 */}
            <div className="fixed bottom-4 right-4 bg-gray-800 px-4 py-2 rounded-full shadow-lg">
                <div className="flex items-center gap-2">
                    <div className="animate-pulse w-2 h-2 bg-green-500 rounded-full" />
                    <span className="text-sm">
                        最後更新: {lastUpdate.toLocaleTimeString()}
                    </span>
                </div>
            </div>

            {/* 錯誤提示 */}
            {error && (
                <div className="fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-xl">
                    <div className="flex items-center gap-2">
                        <span>⚠️</span>
                        <span>{error}</span>
                    </div>
                </div>
            )}
        </div>
    );
}

export default RealTimeTicket;