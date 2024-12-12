import React, { useEffect, useState, useRef } from "react";
import LoadingSpinner from "../components/modal/LoadingSpinner";
import { useLocation, useNavigate } from "react-router-dom";

function TicketWebSocket() {
    const location = useLocation();
    const navigate = useNavigate();
    const { requestId } = location.state || {};
    const [loading, setLoading] = useState(true);
    const wsRef = useRef(null);

    useEffect(() => {
        if (!requestId) {
            alert("無效的購票請求！");
            navigate("/");
            return;
        }

        const connectWebSocket = () => {
            
            const ws = new WebSocket(`ws://localhost:8080/ws/order/status`);
            wsRef.current = ws;

            ws.onopen = () => {
                console.log("WebSocket 連接已建立");
                ws.send(JSON.stringify({ requestId }));
            };

            ws.onmessage = (event) => {
                try {
                    const response = JSON.parse(event.data);
                    console.log("正在使用:RequestId是:", requestId, "狀態是:", response.status);

                    switch (response.status) {
                        case "付款中":
                            navigate(`/event/ticket/pay/${requestId}`, {
                                state: {
                                    orderId: response.orderId,
                                    requestId
                                }
                            });
                            setLoading(false);
                            ws.close();
                            break;

                        case "錯誤":
                            alert("購票失敗：票務不足");
                            navigate("/");
                            ws.close();
                            break;

                        default:
                            console.log("等待訂單處理中...");
                    }
                } catch (error) {
                    console.error("處理訊息時發生錯誤:", error);
                }
            };

            ws.onerror = (error) => {
                console.error("WebSocket 錯誤:", error);
                alert("連接發生錯誤，請稍後再試！");
                navigate("/");
            };

            ws.onclose = (event) => {
                console.log("WebSocket 連接已關閉", event.code, event.reason);
                if (event.code !== 1000) {  
                    setTimeout(connectWebSocket, 3000);
                }
            };
        };

        connectWebSocket();

        // 清理函數
        return () => {
            if (wsRef.current) {
                wsRef.current.close(1000, "Component unmounting");
                wsRef.current = null;
            }
        };
    }, [requestId, navigate]);


    
    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen">
                <LoadingSpinner />
                <div className="mt-4 text-lg">訂單處理中，請稍候...</div>
            </div>
        );
    }

    return null;
}

export default TicketWebSocket;