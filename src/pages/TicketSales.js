import React, { useEffect, useState } from "react";
import ApiService from "../api/ApiService";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import { useLocation, useNavigate } from "react-router-dom";


function TicketSales() {
  const location = useLocation();
  const ticketInfo = location.state || {};
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const salesTicket = async () => {
      if (!ticketInfo) {
          console.error("ticketInfo 不存在！");
          navigate("/");
          return;
      }

      console.log("發送的數據:", JSON.stringify(ticketInfo));
      try {
          const response = await ApiService.buyTicket(ticketInfo);
          const requestId = response.data.data; // 獲取返回的 requestId
          console.log("購票請求已提交，RequestID:", requestId);

          // 跳轉到購票處理中頁面
          navigate("/event/ticket/pending", { state: { requestId } });
      } catch (error) {
          console.error("購票請求失敗:", error);
          alert("購票失敗，請稍後再試！");
          navigate("/");
      } finally {
          setLoading(false);
      }
  };

  useEffect(() => {
      salesTicket();
       // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) return <LoadingSpinner />;
  return <div className="overflow-x-auto">購票請求中...</div>;
}


export default TicketSales;
