import React, { useEffect, useState } from "react";
import ApiService from "../api/ApiService";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import { useLocation, useNavigate } from "react-router-dom";

function TicketPending() {
    const location = useLocation();
    const navigate = useNavigate();
    const { requestId } = location.state || {};
    const [loading, setLoading] = useState(true);

    const checkTicketStatus = async () => {
        try {
            const response = await ApiService.checkTicketStatus(requestId); // 查詢購票狀態
            const status = response.data.data.status; // 假設後端返回的狀態字段
            console.log(requestId)
            console.log(response)
            console.log(status);
            if (status === "付款中") {
                // 購票成功，跳轉到訂單摘要頁面
                navigate("/event/ticket/pay", { state: { orderId: response.data.data.orderId } });
                setLoading(false)
            } else if (status === "錯誤") {
                // 購票失敗，提示用戶並跳轉到首頁
                alert("購票失敗：票務不足"  );
                navigate("/");
            } else {
                // 狀態仍然是 PENDING，繼續輪詢
                console.log("正在輪尋中")
                setTimeout(checkTicketStatus, 1000);
            }
        } catch (error) {
            console.error("查詢購票狀態失敗:", error);
            alert("伺服器錯誤，請稍後再試！");
            navigate("/");
        }
    };

    useEffect(() => {
        if (requestId) {
            checkTicketStatus(); // 啟動輪詢
        } else {
            alert("無效的購票請求！");
            navigate("/");
        }

               // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [requestId]);

    if (loading) return <LoadingSpinner />;
    return <div className="overflow-x-auto">購票處理中...</div>;
}

export default TicketPending;
