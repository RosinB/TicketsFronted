import React, { useEffect, useState, useCallback } from "react";
import ApiService from "../../api/ApiService";
import LoadingSpinner from "../../components/LoadingSpinner";
import { useLocation } from "react-router-dom";


function TicketSales() {
    const location = useLocation();
    const { eventId } = location.state || {};
    const [tickets, setTickets] = useState(null); // 初始值為 null
    const [loading, setLoading] = useState(true);
    const userName = localStorage.getItem("userName");

    let quantity = 1;



    const salesTicket = useCallback(async () => {
        try {
            const response = await ApiService.buyTicket(userName, eventId, quantity);
            console.log("購票成功:", response);
        } catch (error) {
            console.log("購票失敗:", error);
        }
    }, [userName, eventId, quantity]); // 確保依賴項穩定

    const fetchTicket = useCallback(async () => {
        try {
            console.log("這是請求一次");
            const response = await ApiService.fetchTicket(eventId);
            setTickets(response.data.data);
            console.log("票務資料:", response);
        } catch (error) {
            console.error("TicketSales的資料沒有get到", error);
        } finally {
            setLoading(false);
        }
    }, [eventId]); // 確保依賴項穩定

    useEffect(() => {
        salesTicket();
        fetchTicket();
    }, [salesTicket, fetchTicket,eventId]); // 正確加入依賴項

    if (loading) {
        return <LoadingSpinner />
    }

    console.log(tickets)
    return (
        <div className="container mx-auto mt-8">
            <h1 className="text-2xl font-bold mb-4">銷售資訊</h1>
            <table className="table-auto border-collapse border border-gray-300 w-full text-left">
                <thead>
                    <tr className="bg-gray-100">
                        <th className="border border-gray-300 px-4 py-2">欄位名稱</th>
                        <th className="border border-gray-300 px-4 py-2">欄位資訊</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td className="border border-gray-300 px-4 py-2">銷售紀錄 ID</td>
                        <td className="border border-gray-300 px-4 py-2">{tickets.salesId}</td>
                    </tr>
                    <tr>
                        <td className="border border-gray-300 px-4 py-2">活動ID</td>
                        <td className="border border-gray-300 px-4 py-2">{tickets.eventId}</td>
                    </tr>
                    <tr>
                        <td className="border border-gray-300 px-4 py-2">活動總票數</td>
                        <td className="border border-gray-300 px-4 py-2">{tickets.eventTotalTickets}</td>
                    </tr>
                    <tr>
                        <td className="border border-gray-300 px-4 py-2">剩餘票數</td>
                        <td className="border border-gray-300 px-4 py-2">{tickets.salesRemaining}</td>
                    </tr>
                    <tr>
                        <td className="border border-gray-300 px-4 py-2">活動狀態</td>
                        <td className="border border-gray-300 px-4 py-2">{tickets.salesStatus}</td>
                    </tr>


                </tbody>
            </table>
        </div>
    );
}

export default TicketSales;
