import axios from "axios";

// 建立 Axios 實例 //這會在請求上加token
const apiClient = axios.create({
    baseURL: "http://localhost:8080", // 後端 API 的基礎 URL
});

// 設置請求攔截器
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// 設置響應攔截器
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            console.error("Token 過期或無效");

            // 清除 Token 並跳轉到登入頁
            localStorage.removeItem("token");

        }
        return Promise.reject(error);
    }
);

export default apiClient;
