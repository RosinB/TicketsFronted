import React, { useState } from "react";
import ApiService from "../../api/ApiService";

function ForgetPassword() {
    const [userName, setUserName] = useState(""); // 儲存帳號
    const [email, setEmail] = useState(""); // 儲存電子郵件
    const [errorMessage, setErrorMessage] = useState(""); // 儲存錯誤訊息
    const [successMessage, setSuccessMessage] = useState(""); // 儲存成功訊息

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // 清除錯誤訊息
        setErrorMessage("");
        setSuccessMessage("");
        
        try {
            const response = await ApiService.forgetPassword(userName, email);
            setSuccessMessage("寄送成功請查詢Email")
            // alert("寄送成功請查詢Email");
            console.log(response.data.data);
        
        } catch (err) {
            console.error("密碼不匹配", err);
            setErrorMessage("請確認userName和Email有沒有正確");
        }
    };

    return (
    <div className="flex justify-center items-start min-h-screen bg-gray-100">
        <div className="bg-white shadow-lg rounded-lg p-6 max-w-lg w-full">
                <h2 className="text-2xl font-bold text-center mb-4">忘記密碼</h2>
                
                {/* 顯示錯誤訊息 */}
                {errorMessage && <div className="text-red-500 text-center mb-4">{errorMessage}</div>}

                {/* 顯示成功訊息 */}
                {successMessage && <div className="text-green-500 text-center mb-4">{successMessage}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-semibold mb-2">帳號</label>
                        <input
                            type="text"
                            className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                            value={userName}
                            onChange={(e) => setUserName(e.target.value)}
                            placeholder="請輸入帳號"
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-semibold mb-2">電子郵件</label>
                        <input
                            type="email"
                            className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="請輸入電子郵件"
                            required
                        />
                    </div>

                    <div className="flex justify-end gap-4">
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                        >
                            驗證
                        </button>
                        <button
                            type="button"
                            className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition"
                            onClick={() => window.history.back()} // 返回上一頁
                        >
                            取消
                        </button>

                    
                    </div>
                </form>
            </div>
        </div>
    );
}

export default ForgetPassword;
