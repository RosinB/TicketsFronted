import ApiClient from "./ApiClient";

const ApiService = {
    // ==============================活動相關===========================
    // 獲取所有活動的圖片，寫在輪播圖，TicketList
    fetchAllPic   :()  => ApiClient.get("/event/ticketAllPic"),

    // 獲取所有活動的圖片，寫在
    fetchAllEvents: () => ApiClient.get("/event/all"),
    
    //獲取購票網站的資訊 裡面啥都有
    fetchTicketsEvent :(eventName) =>ApiClient.get(`/event/ticket/${eventName}`),


    //==============================使用者相關===============================
    //獲取全部使用者資料
    fetchAllMember:()=> ApiClient.get("/user/all"), 





    //===============================登入註冊相關=====================================
    //登入使用者
    loginUser: (userName, password) => ApiClient.post("/user/login", { userName, password }),
    //註冊使用者
    registerUser:({ userName, userPhone, password, userIdCard, userEmail, userBirthDate }) => ApiClient.post("/user/register", 
                {userName, userPhone, password, userIdCard, userEmail, userBirthDate}),
    //獲取需要更新使用者的資料
    fetchUserUpdate:() => ApiClient.get("/user/userUpdate"),

    updateUser:({userName,userPhone,userEmail,userBirthDate} ) => ApiClient.post("/user/userUpdate",
        {userName,userPhone,userEmail,userBirthDate}),



    //===============================銷售相關=====================================
    
    fetchTicket: (eventId) => ApiClient.get(`/sales/goticket/${eventId}`),

    buyTicket:(userId,eventId,quantity) => ApiClient.post("/goticket/buy",{userId,eventId,quantity})




};

export default ApiService;
