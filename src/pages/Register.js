import React, { useState } from "react";
import axios from "axios";

const Register = () => {
    // 使用狀態來管理表單輸入
    const [userName, setuserName] = useState("");
    const [userPhone, setuserPhone] = useState("");
    const [password, setpassword] = useState("");
    const [userIdCard, setuserIdCard] = useState("");
    const [userEmail, setuserEmail] = useState("");
    const [error, setError] = useState(null); // 用於儲存錯誤信息
    const [successMessage, setSuccessMessage] = useState(""); // 用於儲存成功消息

    // 提交表單的處理函數
    const handleSubmit = async (e) => {
        e.preventDefault(); // 防止默認表單提交行為
        try {
            // 發送 POST 請求到後端
            const response = await axios.post("http://localhost:8080/user/register", {
                userName,
                userPhone,
                password,
                userIdCard,
                userEmail
            });
            // 如果請求成功，顯示成功消息
            setSuccessMessage("註冊成功");
            setuserName(""); // 清空輸入框
            setuserPhone(""); // 清空輸入框
        } catch (err) {
            // 處理錯誤
            console.error(err);
        }
    };



    

    return (
        <div className="bg-white shadow-md rounded-lg p-8 max-w-lg mx-auto">
            <h2 className="text-3xl font-bold text-center text-gray-800">會員註冊</h2>

            {/* 顯示成功或錯誤消息 && 這是判斷式*/}
            {successMessage && <div className="text-green-500 text-center">{successMessage}</div>}
            {error && <div className="text-red-500 text-center">{error}</div>}

            <form className="mt-6" onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-semibold mb-2">
                        帳號
                    </label>
                    <input
                        type="text"
                        className="w-full border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                        value={userName}
                        onChange={(e) => setuserName(e.target.value)} // 更新狀態
                        placeholder="請輸入帳號"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-semibold mb-2">
                        密碼
                    </label>
                    <input
                        type="text"
                        className="w-full border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                        value={password}
                        onChange={(e) => setpassword(e.target.value)} // 更新狀態
                        placeholder="請輸入密碼"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-semibold mb-2">
                        電話
                    </label>
                    <input
                        type="number"
                        className="w-full border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                        value={userPhone}
                        onChange={(e) => setuserPhone(e.target.value)} // 更新狀態
                        placeholder="請輸入電話"
                        required
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-semibold mb-2">
                        電郵
                    </label>
                    <input
                        type="email"
                        className="w-full border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                        value={userEmail}
                        onChange={(e) => setuserEmail(e.target.value)} // 更新狀態
                        placeholder="請輸入電郵"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-semibold mb-2">
                        身分證
                    </label>
                    <input
                        type="text"
                        className="w-full border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                        value={userIdCard}
                        onChange={(e) => setuserIdCard(e.target.value)} // 更新狀態
                        placeholder="請輸入身分證"
                        required
                    />
                </div>
                <button className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition">
                    註冊
                </button>
            </form>
        </div>
    );
};

export default Register;
