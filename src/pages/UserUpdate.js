import React, { useEffect, useState } from "react";
import apiClient from "../api/apiClient";

const UserUpdate = () => {
    const [User, setUser] = useState({}); // 儲存從後端獲取的資料
    const [loading, setLoading] = useState(true); // 加載狀態
    const [error, setError] = useState(null); // 錯誤訊息


    useEffect(() => {

        const fetchUser = async () => {

            try {
                const response = await apiClient.get("http://localhost:8080/user/userUpdate"); // 請求後端 API
                console.log("user data:", response.data);
                setUser(response.data.data); // 將回應資料存入 state

            }  catch (err) {
                setError("Failed to fetch members."); // 捕獲錯誤
                console.error(err);
            } finally {
                setLoading(false); // 結束加載
            }
        };

        fetchUser(); // 呼叫函式
    }, []); // 只在組件掛載時執行一次


    if (loading) {
        return <div>加載中...</div>;
    }
    // 當發生錯誤時顯示
    if (error) {
        return <div>Error: {error}</div>;
    }
   

    return (
        <div className="bg-white shadow-md rounded-lg p-8 max-w-lg mx-auto">
            <h2 className="text-3xl font-bold text-center text-gray-800">會員更新</h2>


            <form className="mt-6" >
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-semibold mb-2">
                        帳號
                    </label>
                    <input
                        type="text"
                        className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                        value={User.userName || ""}
                        readOnly
                    />

                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-semibold mb-2">
                        密碼
                    </label>
                    <input
                        type="text"
                        className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                        placeholder="請輸入密碼"
                        readOnly
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-semibold mb-2">
                        電話
                    </label>
                    <input
                        type="text"
                        className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                        value={User.userPhone || ""}

                        readOnly
                    />

                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-semibold mb-2">
                        電子信箱
                    </label>
                    <input
                        type="email"
                        className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                        value={User.userEmail || ""}
                        readOnly
                    />

                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-semibold mb-2">
                        身分證
                    </label>
                    <input
                        type="text"
                        className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                        value={User.userIdCard || ""}

                        readOnly
                    />

                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-semibold mb-2">
                        出生日期
                    </label>
                    <input
                        type="date"
                        className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                        value={User.userBirthDate ? User.userBirthDate.split('T')[0] : ""}
                        readOnly
                        />
                </div>
                <button className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition">
                    註冊
                </button>
            </form>
        </div>
    );
};

export default UserUpdate;