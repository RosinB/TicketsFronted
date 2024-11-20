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
    
      console.log('發送的數據:' + JSON.stringify(ticketInfo));
      try {
          const response = await ApiService.buyTicket(ticketInfo);
          console.log("購票成功:", response);
          navigate("/event/ticket/orderabs",{  state:{ orderId: response.data.data  } }  );

      } catch (error) {
          console.log("購票失敗:", error);
          alert("票卷餘票不足，即將跳轉到首頁");
          navigate("/");
      } finally {
          setLoading(false);
      }
    };


    useEffect(() => {
      salesTicket();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); 




    if (loading)return <LoadingSpinner />
  return (
    <div className="overflow-x-auto">購票轉移中</div>
  );
}

export default TicketSales;
