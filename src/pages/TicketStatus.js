import React, { useState, useEffect } from 'react';

const TicketStatus = () => {
    const [remaining, setRemaining] = useState(null); // 存儲票數
    const [socket, setSocket] = useState(null); // 存儲 WebSocket 實例
    const [isConnected, setIsConnected] = useState(false); // 是否已連接
    const [error, setError] = useState(null); // 儲存錯誤信息

    // 建立 WebSocket 連接
    const connectWebSocket = () => {
        if (socket) {
            console.log('已有 WebSocket 連接，請勿重複連接');
            return;
        }
        const ws = new WebSocket('ws://localhost:8080/ws/tickets'); // 建立連接

        ws.onopen = () => {
            console.log('WebSocket 已連接');
            setIsConnected(true); // 更新連接狀態
            setError(null); // 清除之前的錯誤

            // 發送訂閱條件（EventId 和 Section）
            const subscriptionData = {
                eventId: 1, // 示例 EventId
                section: 'A區', // 示例 Section
            };
            ws.send(JSON.stringify(subscriptionData));
            console.log('已發送訂閱條件:', subscriptionData);
        };

        ws.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data); // 解析數據
                if (data.remainingTickets !== undefined) {
                    setRemaining(data.remainingTickets); // 更新票數
                } else {
                    console.error('推送的數據中缺少 remainingTickets 欄位:', data);
                    setError('後端數據缺少字段');
                }
            } catch (e) {
                console.error('數據解析失敗:', e.message);
                setError('數據解析失敗，請檢查後端數據格式');
            }
        };

        ws.onerror = (e) => {
            console.error('WebSocket 發生錯誤:', e.message);
            setError('WebSocket 發生錯誤，請檢查後端連接');
        };

        ws.onclose = () => {
            console.log('WebSocket 已斷開');
            setSocket(null);
            setIsConnected(false);
        };

        setSocket(ws); // 存儲 WebSocket 實例
    };

    // 主動斷開 WebSocket 連接
    const disconnectWebSocket = () => {
        if (socket) {
            socket.close();
            console.log('主動斷開 WebSocket 連接');
        }
    };

    // 自動清理 WebSocket 連接
    useEffect(() => {
        return () => {
            if (socket) {
                socket.close();
            }
        };
    }, [socket]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen text-white">
            <h1 className="text-4xl font-bold mb-6">實時票務狀況</h1>
            <div className="text-2xl mb-8">
                {remaining !== null ? (
                    <p>
                        剩餘票數:{' '}
                        <span className="text-green-600 font-semibold">
                            {remaining}
                        </span>
                    </p>
                ) : isConnected ? (
                    <p className="text-yellow-500">載入中...</p>
                ) : (
                    <p className="text-gray-500">尚未連接</p>
                )}
            </div>
            {error && (
                <div className="bg-red-100 text-red-600 p-3 rounded-lg mb-4 shadow">
                    錯誤: {error}
                </div>
            )}
            {!isConnected ? (
                <button
                    className="px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg shadow-lg hover:bg-blue-600 transition duration-300"
                    onClick={connectWebSocket}
                >
                    連接 WebSocket
                </button>
            ) : (
                <button
                    className="px-6 py-3 bg-red-500 text-white font-semibold rounded-lg shadow-lg hover:bg-red-600 transition duration-300"
                    onClick={disconnectWebSocket}
                >
                    斷開連接
                </button>
            )}
        </div>
    );
};

export default TicketStatus;
