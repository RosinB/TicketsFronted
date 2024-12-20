import ApiClient from "./ApiClient";

const ApiService = {
    // ==============================活動相關===========================
    // 獲取所有活動的圖片，寫在輪播圖，TicketList
    fetchAllPic: () => ApiClient.get("/event/ticketAllPic"),



    //獲取購票網站的資訊  EventTicket.js /event/ticket/
    fetchTicketsEvent: (eventId) => ApiClient.get(`/event/ticket/${eventId}`),

    //==============================使用者相關===============================
    //獲取全部使用者資料
    fetchAllMember: () => ApiClient.get("/user/all"),

    //===============================登入註冊相關=====================================
    //登入使用者
    loginUser: (userName, password) => ApiClient.post("/user/login", { userName, password }),
    //註冊使用者
    registerUser: (submitData) => ApiClient.post("/user/register",submitData),
    //獲取需要更新使用者的資料
    fetchUserUpdate: () => ApiClient.get("/user/userUpdate"),

    updateUser: (submitData) => ApiClient.post("/user/userUpdate", submitData),




//=================================驗證信箱==========================
    //獲得信箱
    getEmail:(userName)=>ApiClient.get(`/user/email/get/${userName}`),
    //獲得驗證碼
    getCAPTCHA:(userName)=>ApiClient.get(`/user/email/getCAPTCHA/${userName}`),

    verifEmail:(userName,code)=>ApiClient.post(`/user/email/verification`, null,{params: {userName,code}}),


//=============================忘記密碼===================================
   //忘記密碼 
    forgetPassword:(userName,email)=>ApiClient.post(`/user/forget/password`,null,{params:{userName,email}}),
    //驗證網址token 
    checkToken:(token)=>ApiClient.get(`/user/forget/password/${token}`),




    //===============================銷售相關=====================================



    //透過 使用者名子，演唱會id，數量，票價區位去購票
    buyTicket: (ticketInfo) => ApiClient.post("/sales/goticket/area/buy", ticketInfo),

    buyTicketWithSeat:(ticketInfo) => ApiClient.post("/sales/goticket/area/buy/seat", ticketInfo),



    //透過演唱會id去顯示票種區域和價位
    getTicketSection: (eventId) => ApiClient.get(`/sales/goticket/area/${eventId}`),

    checkTicketStatus:(requestId) =>ApiClient.get(`/sales/goticket/area/status/${requestId}`),

    getSeatStatus:(eventId,section)=>ApiClient.get(`/sales/goticket/area/seat`,  {params:{eventId,section} } ),


    //======================================= 訂單相關===================================
    fetchOrder: (orderId,userName,requestId) => ApiClient.get(`/sales/goticket/orders`, {params: { orderId, userName,requestId }}),

    fetchAsbOrder: (orderId) => ApiClient.get(`/sales/goticket/asborders/${orderId}`),


    fetchUserOrder:()=>ApiClient.get("/user/order"),

    //庫款後更新訂單狀況
    updateOrderStatus:(orderId)=> ApiClient.post(`/sales/goticket/pay/${orderId}`),

    //取消訂單
    cancelOrder:(orderId)=>ApiClient.post(`/sales/goticket/pay/cancel/${orderId}`),


    //寄送訂單到信箱
    

    //處理退票相關
    refundticket:(orderId)=>ApiClient.get(`/user/order/refund/${orderId}`),

    refundform:(formData)=>ApiClient.post("/user/order/refund/form",formData),

// =======================================後台管理者相關================================


// ======================================後台host相關====================================
    fetchAdminHost :()=> ApiClient.get("/admin/host/all"),

    postAdminHost:(hostData)=>ApiClient.post("/admin/host/add",hostData),

    updateHost:(hostData)=>ApiClient.post("/admin/hosts/update",hostData),
//=========================================後台演唱會=====================================
    fetchAdminAllEvent:()=>ApiClient.get("/admin/event/all"),

    fetchAdminEventById:(eventId)=>ApiClient.get(`/admin/event/${eventId}`),

    addEvent:(postTicket)=>ApiClient.post("/admin/event/add",postTicket),

    updateEventById:(eventData)=>ApiClient.post("/admin/event/update",eventData),
//=========================================後台訂單查詢=====================================
    fetchOrdersById:(eventId)=>ApiClient.get(`/admin/orders/${eventId}`),

//=========================================後台票務狀況查詢=================================
    fetchOnSaleEvent:()=>ApiClient.get("/admin/event/onsale"),

    fetchRealTimeTicket:(eventId)=>ApiClient.get(`/admin/event/onsale/${eventId}`),


//========================================後台退票處理=====================================

    fetchRefundSubmit:()=>ApiClient.get("/admin/orders/refund"),

    rejectRefund:(refundId)=>ApiClient.post(`/admin/orders/reject/${refundId}`),

    approveRefund:(refundId)=>ApiClient.post(`/admin/orders/success/${refundId}`),




//=========================================後台APi=================================
    lockTicket: (locked) =>ApiClient.post(`/admin/event/api/lock`, locked),
    
    blanceTicket:(eventId,section)=>ApiClient.post("/admin/event/api/balance", null,{params: {eventId,section}}),
    
    clearTicket:(eventId,section)=>ApiClient.post("/admin/event/api/clear",null,{params: {eventId,section}}),

//========================================流量分析================================ 
    fetchTrafficPerSecond: (start, end) =>  ApiClient.get("/api/traffic/per-second", {params: { start, end }}),

    fetchTrafficAllRecord:(eventId,start,end)=>ApiClient.get("/admin/traffic/all",{params:{eventId,start,end}}),


    blockUser:(userName)=>ApiClient.get(`/admin/traffic/block/${userName}`),
    unBlockUser:(userName)=>ApiClient.get(`/admin/traffic/unblock/${userName}`),
    getBlockUser:()=>ApiClient.get("/admin/traffic/block/all"),
    blockIp:(ipAddress)=>ApiClient.get(`/admin/traffic/block/ip/${ipAddress}`),



//=========================================工具================================================
    fetchCAPTCHA:()=>ApiClient.get("/captcha")

};

export default ApiService;
