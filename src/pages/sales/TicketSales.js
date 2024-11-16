import React, { useEffect, useState } from "react";
import ApiService from "../../api/ApiService";
import LoadingSpinner from "../../components/LoadingSpinner";
import { useLocation, useNavigate } from "react-router-dom";


function TicketSales() {
  const location = useLocation();
  const ticketInfo = location.state || {};
  // const [repo,setRepo] =useState("");
  const [tickets, setTickets] = useState(null); // 初始值為 null
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const userName = localStorage.getItem("userName");




  const salesTicket = async () => {
    console.log('發送的數據:' + JSON.stringify(ticketInfo));


    try {
      const response = await ApiService.buyTicket(ticketInfo);
      console.log("購票成功:", response);
      setTickets(response.data.data);
      navigate("/goticketorders",{  state : ticketInfo }  );

    } catch (error) {
      console.log("購票失敗:", error);
    } finally {
      setLoading(false);
    }

  };


  useEffect(() => {
    salesTicket();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // 正確加入依賴項



  if (loading) {

    return <LoadingSpinner />
  }


  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100 text-gray-700 uppercase text-sm leading-normal">
            <th className="py-3 px-6 text-left border border-gray-300">使用者名字</th>
            <th className="py-3 px-6 text-left border border-gray-300">活動ID</th>
            <th className="py-3 px-6 text-left border border-gray-300">區域</th>

            <th className="py-3 px-6 text-left border border-gray-300">剩餘票卷</th>
            <th className="py-3 px-6 text-left border border-gray-300">還可不可以購票</th>
          </tr>
        </thead>
        <tbody className="text-gray-600 text-sm">
          <tr>
            <td className="py-3 px-6 border border-gray-300">{userName}</td>
            <td className="py-3 px-6 border border-gray-300">{tickets.eventId}</td>
            <td className="py-3 px-6 border border-gray-300">{tickets.section}</td>
            <td className="py-3 px-6 border border-gray-300">{tickets.ticketRemaining}</td>
            <td className="py-3 px-6 border border-gray-300">{tickets.ticketIsAvailable}</td>

          </tr>

        </tbody>
      </table>
    </div>

  );
}

export default TicketSales;
