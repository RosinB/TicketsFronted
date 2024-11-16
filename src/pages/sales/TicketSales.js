import React, { useEffect, useState } from "react";
import ApiService from "../../api/ApiService";
import LoadingSpinner from "../../components/LoadingSpinner";
import { useLocation, useNavigate } from "react-router-dom";


function TicketSales() {
  const location = useLocation();
  const ticketInfo = location.state || {};
  // const [repo,setRepo] =useState("");
  const [orderId, setOrderId] = useState(null); // 初始值為 null
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const userName = localStorage.getItem("userName");




  const salesTicket = async () => {
    console.log('發送的數據:' + JSON.stringify(ticketInfo));


    try {
      const response = await ApiService.buyTicket(ticketInfo);
      console.log("購票成功:", response);
      setOrderId(response.data.data);
      console.log("我的orderId"+orderId);
      navigate("/goticketorders",{  state:{ orderId: response.data.data  } }  );

    } catch (error) {
      console.log("購票失敗:", error);
    } finally {
      setLoading(false);
    }

  };
  console.log("我的訂單號碼"+orderId);

  useEffect(() => {
    salesTicket();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // 正確加入依賴項



  if (loading) {

    return <LoadingSpinner />
  }


  return (
    <div className="overflow-x-auto">
     
    </div>

  );
}

export default TicketSales;
