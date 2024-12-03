import React, { useEffect, useState } from "react";
import ApiService from "../api/ApiService";
import LoadingSpinner from "../components/modal/LoadingSpinner";
import { useLocation, useNavigate } from "react-router-dom";


function TicketSales() {
    const location = useLocation();
    const navigate = useNavigate();
    const ticketInfo = location.state || {};

    const [loading, setLoading] = useState(true);

    //APi
    const salesTicket = () => {
        if (!ticketInfo) {
            console.error("ticketInfo 不存在！");
            navigate("/");
            return;
        }
        if (ticketInfo.poolNumber != null) {
            // 呼叫座位票的 API
            ApiService.buyTicketWithSeat(ticketInfo)
                .then((res) => {
                    const requestId = res.data.data;
                    console.log("座位購票請求已提交，RequestID:", requestId);
                    navigate("/event/ticket/pending", { state: { requestId } });
                })
                .catch((error) => {
                    console.error("座位購票請求失敗:", error);
                    alert("購票失敗，請稍後再試！");
                    navigate("/");
                })
                .finally(() => {
                    setLoading(false);
                });
        } else {
            // 原一般購票 API
            ApiService.buyTicket(ticketInfo)
                .then((res) => {
                    const requestId = res.data.data;
                    console.log("購票請求已提交，RequestID:", requestId);
                    navigate("/event/ticket/pending", { state: { requestId } });
                })
                .catch((error) => {
                    console.error("購票請求失敗:", error);
                    alert("購票失敗，請稍後再試！");
                    navigate("/");
                })
                .finally(() => {
                    setLoading(false);
                });
        }

        console.log("發送的數據:", JSON.stringify(ticketInfo));

    };

    useEffect(() => {
        salesTicket();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (loading) return <LoadingSpinner />;

    return <div className="overflow-x-auto">購票請求中...</div>;
}


export default TicketSales;
