import ApiClient from "./ApiClient";

const ApiService = {
    // ==============================活動相關===========================
    // 獲取所有活動的圖片，寫在輪播圖，TicketList
    fetchAllPic: () => ApiClient.get("/event/ticketAllPic"),

    // 獲取所有活動
    fetchAllEvents: () => ApiClient.get("/event/all"),

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

    //===============================銷售相關=====================================

    //透過演唱會id抓取票種資訊
    fetchTicket: (eventId) => ApiClient.get(`/sales/goticket/${eventId}`),

    //透過 使用者名子，演唱會id，數量，票價區位去購票
    buyTicket: (ticketInfo) => ApiClient.post("/sales/goticket/area/buy", ticketInfo),

    //透過演唱會id去顯示票種區域和價位
    getTicketSection: (eventId,userName) => ApiClient.get(`/sales/goticket/area`,{params:{eventId,userName}}),

    checkTicketStatus:(requestId) =>ApiClient.get(`/sales/goticket/area/status/${requestId}`),
    //======================================= 訂單相關===================================
    fetchOrder: (orderId,userName) => ApiClient.get(`/sales/goticket/orders`, {params: { orderId, userName }}),

    fetchUserOrder:(userName)=>ApiClient.get(`/user/order/${userName}`),




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
    fetchOrdersById:(eventId)=>ApiClient.get(`/admin/orders/${eventId}`)


};

export default ApiService;
