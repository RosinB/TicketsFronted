import React, { useEffect, useState } from "react";
import ApiService from "../api/ApiService";
import LoadingSpinner from "../components/ui/LoadingSpinner";
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

        ApiService.buyTicket(ticketInfo)
            .then(({data:{data}})=>{
                console.log("購票請求已提交，RequestID:", data);
                navigate("/event/ticket/pending", { state: { data} });
            })
            .catch((error)=>{
                console.error("購票請求失敗:", error);
                alert("購票失敗，請稍後再試！");
                navigate("/");
            })
            .finally(()=>{setLoading(false);
            })

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
