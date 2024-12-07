import React, { useEffect, useState } from "react";
import ApiService from "../api/ApiService";
import LoadingSpinner from "../components/modal/LoadingSpinner";
import { useLocation, useNavigate } from "react-router-dom";

function TicketPending() {
    const location = useLocation();
    const navigate = useNavigate();
    const { requestId } = location.state || {};

    const [loading, setLoading] = useState(true);

    const checkTicketStatus = async () => {
        try {
            // 查詢購票狀態
            const response = await ApiService.checkTicketStatus(requestId); 
            const status = response.data.data.status; 
            console.log("RequestId是:"+requestId+" 狀態是:"+status );
        
            if (status === "付款中") {
                // 購票成功，跳轉到訂單摘要頁面
                navigate(`/event/ticket/pay/${requestId}`, { state:  
                    { orderId: response.data.data.orderId, 
                    requestId
                } });
                setLoading(false)
            } else if (status === "錯誤") {
                // 購票失敗，提示用戶並跳轉到首頁
                alert("購票失敗：票務不足"  );
                navigate("/");
            } else {
                console.log("正在輪尋中")
                setTimeout(checkTicketStatus, 1000);
            }
        } catch (error) {
            alert("伺服器錯誤，請稍後再試！");
            navigate("/");
        }
    };

    useEffect(() => {
        console.log(requestId)
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
