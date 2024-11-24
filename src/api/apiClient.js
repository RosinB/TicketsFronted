import axios from "axios";

// 建立 Axios 實例 //這會在請求上加token
const ApiClient = axios.create({
    baseURL: "http://localhost:8080", // 後端 API 的基礎 URL
});

// 設置請求攔截器
ApiClient.interceptors.request.use(
    (config) => {
        //獲得token 
        const token = localStorage.getItem("token");
        if (token) {
            //在token前面加入Bearer 讓後端判斷
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        console.error("請求攔截器異常：", error);
        return Promise.reject(error);
    }
);

//請求攔截器
ApiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response) {
            if (error.response.status === 401) {
                console.warn("未授權：可能是 Token 無效或過期");

                // 提示用戶並清除 Token
                alert("請重新登入");
                localStorage.removeItem("token");

                // 跳轉到登入頁
                window.location.href = "/login";
            } else {
                console.error("API 錯誤響應：", error.response);
            }
        } else {
            console.error("無法連接到後端伺服器：", error.message);
        }

        return Promise.reject(error);
    }
);

export default ApiClient;
