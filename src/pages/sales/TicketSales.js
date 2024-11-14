import React, { useEffect, useState } from "react";
import ApiService from "../../api/ApiService";
import LoadingSpinner from "../../components/LoadingSpinner";
import { useLocation } from "react-router-dom";


function TicketSales() {
    const location = useLocation();
    const { eventId, ticketSectionQuantity } = location.state || {};

    // const [tickets, setTickets] = useState(null); // 初始值為 null
    const [loading, setLoading] = useState(true);
    const userName = localStorage.getItem("userName");

    console.log("eventId是:" + eventId + " ticketPrice是:" + JSON.stringify(ticketSectionQuantity));


    console.log(ticketSectionQuantity[0].zone);

    const salesTicket = async () => {

        try {
            const response = await ApiService.buyTicket(userName, eventId,ticketSectionQuantity);
            console.log("購票成功:", response);
        } catch (error) {
            console.log("購票失敗:", error);
        } finally {
            setLoading(false);
        }

    };


    useEffect(() => {
        salesTicket();

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [eventId]); // 正確加入依賴項



    if (loading) {

        return <LoadingSpinner />
    }


    return (
            <div>s</div>

    );
}

export default TicketSales;
