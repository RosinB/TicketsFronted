import React, { useState } from "react";
import axios from "axios";

const Register = () => {
    const [userName, setuserName] = useState("");
    const [userPhone, setuserPhone] = useState("");
    const [password, setpassword] = useState("");
    const [userIdCard, setuserIdCard] = useState("");
    const [userEmail, setuserEmail] = useState("");
    const [userBirthDate, setuserBirthDate] = useState("");

    const [fieldErrors, setFieldErrors] = useState({}); // 儲存各欄位的錯誤訊息
    const [successMessage, setSuccessMessage] = useState(""); // 用於儲存成功消息

    const errors = {};

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
                userEmail,
                userBirthDate
            });
            console.log(response);
            // 如果請求成功，顯示成功消息
            setSuccessMessage("註冊成功");
            setuserName(""); // 清空輸入框
            setuserPhone(""); // 清空輸入框
        } catch (err) {
            if (err.response) {
                console.error("這是後端返回的錯誤！"); // 明確標明來源
                console.error("錯誤訊息:", err.response.data.message); // 打印 "註冊失敗"
                console.error("詳細錯誤資訊:", err.response.data.data); // 打印具體錯誤
                setFieldErrors(err.response.data.data || {}); // 將錯誤存入狀態
                setSuccessMessage("註冊失敗");

            } else {
                console.error("這是請求失敗（非後端錯誤）:", err);
            }
        }

  // 驗證電話號碼
    if (!/^\d{10}$/.test(userPhone)) {
        errors.userPhone = "電話必須是 10 位數字";
    }
    // 如果有錯誤，更新錯誤狀態並阻止提交
    if (Object.keys(errors).length > 0) {
        setFieldErrors(errors);
        return;
    }
    };




    return (
        <div className="bg-white shadow-md rounded-lg p-8 max-w-lg mx-auto">
            <h2 className="text-3xl font-bold text-center text-gray-800">會員註冊</h2>

            {/* 顯示成功或錯誤消息 && 這是判斷式*/}
            {successMessage && <div className="text-green-500 text-center">{successMessage}</div>}

            <form className="mt-6" onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-semibold mb-2">
                        帳號
                    </label>
                    <input
                        type="text"
                        className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                        value={userName}
                        onChange={(e) => setuserName(e.target.value)} // 更新狀態
                        placeholder="請輸入帳號"
                        required
                    />
                    {fieldErrors.userName && <p className="text-red-500 text-sm">{fieldErrors.userName}</p>}

                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-semibold mb-2">
                        密碼
                    </label>
                    <input
                        type="text"
                        className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
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
                        type="text"
                        className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                        value={userPhone}
                        onChange={(e) => {
                            const value = e.target.value;
                            if (/^\d{0,10}$/.test(value)) { // 允許 0 到 10 位數字
                                setuserPhone(value);
                            }
                        }}
                        placeholder="請輸入電話"
                        required
                    />
                    {fieldErrors.userPhone && <p className="text-red-500 text-sm">{fieldErrors.userPhone}</p>}

                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-semibold mb-2">
                        電子信箱
                    </label>
                    <input
                        type="email"
                        className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                        value={userEmail}
                        onChange={(e) => setuserEmail(e.target.value)} // 更新狀態
                        placeholder="請輸入電子信箱"
                        required
                    />
                    {fieldErrors.userEmail && <p className="text-red-500 text-sm">{fieldErrors.userEmail}</p>}

                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-semibold mb-2">
                        身分證
                    </label>
                    <input
                        type="text"
                        className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                        value={userIdCard}
                        onChange={(e) => {
                            const value = e.target.value.toUpperCase(); // 自動轉為大寫
                            if (/^[A-Z\d]{0,10}$/.test(value)) { // 允許 0 到 10 位字母或數字
                                setuserIdCard(value);
                            }
                        }}
                        placeholder="請輸入身分證"
                        required
                    />
                    {fieldErrors.userIdCard && <p className="text-red-500 text-sm">{fieldErrors.userIdCard}</p>}

                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-semibold mb-2">
                        出生日期
                    </label>
                    <input
                        type="date"
                        className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                        value={userBirthDate}
                        onChange={(e) => setuserBirthDate(e.target.value)} // 更新狀態
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
