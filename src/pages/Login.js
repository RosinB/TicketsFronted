import React, { useState } from "react";
import axios from "axios";
// import { useNavigate } from "react-router-dom";

const Login = () => {
    const [userName, setUserName] = useState(""); // 儲存帳號
    const [password, setPassword] = useState(""); // 儲存密碼
    const [errorMessage, setErrorMessage] = useState(""); // 錯誤訊息
    

    const handleSubmit = async (e) => {
        e.preventDefault(); // 防止默認表單提交行為

        try {
            // 發送 POST 請求到後端
            const response = await axios.post("http://localhost:8080/user/login", {
                userName,
                password,
            });

            // 提取 Token 和其他數據
            const { token, userName: tokenUserName } = response.data.data;
            console.log("登入的使用者UserName:", tokenUserName);
            localStorage.setItem("token", token);

            window.location.href = "/";


        }
        catch (err) {
            // 處理登入失敗
            if (err.response) {
                console.error("登入失敗：", err.response.data.message);
                setErrorMessage(err.response.data.message); // 顯示後端返回的錯誤訊息
                setPassword("");//清空密碼input
            } else {
                console.error("請求失敗：", err);
                setErrorMessage("系統錯誤，請稍後再試！");
            }
        }
    };

    return (
        <div className="bg-white shadow-md rounded-lg p-8 max-w-lg mx-auto">
            <h2 className="text-3xl font-bold text-center text-gray-800">登入</h2>

            {/* 顯示錯誤消息 */}
            {errorMessage && <div className="text-red-500 text-center">{errorMessage}</div>}

            <form className="mt-6" onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-semibold mb-2">
                        帳號
                    </label>
                    <input
                        type="text"
                        className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)} // 更新狀態
                        placeholder="請輸入帳號"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-semibold mb-2">
                        密碼
                    </label>
                    <input
                        type="password" // 設定為密碼類型
                        className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)} // 更新狀態
                        placeholder="請輸入密碼"
                        required
                    />
                </div>
                <button className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition">
                    登入
                </button>
            </form>
        </div>
    );
};

export default Login;
