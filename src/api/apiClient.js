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
        if (error.response && error.response.status === 401) {
            // 靜默處理，不顯示警告
            localStorage.removeItem("token");

            // 使用 setTimeout 確保當前的錯誤處理完成後再跳轉
            setTimeout(() => {
                window.location.href = "/login";
                // 等頁面開始跳轉後再顯示提示
                alert("請重新登入");
            }, 0);

            // 直接返回被拒絕的 Promise，不再繼續處理錯誤
            return Promise.reject(new Error("silent")); // 使用特殊錯誤訊息
        } else {
            console.error("無法連接到後端伺服器：", error.message);
        }

        return Promise.reject(error);
    }
);

export default ApiClient;
