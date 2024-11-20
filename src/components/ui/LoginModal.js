import React, { useState } from "react";
import ApiService from "../../api/ApiService";

function LoginModal({ isOpen, onClose, onSuccess }) {
    const [userName, setUserName] = useState(""); // 儲存帳號
    const [password, setPassword] = useState(""); // 儲存密碼
     const [errorMessage, setErrorMessage] = useState(""); // 錯誤訊息

    
    const handleSubmit = async (e) => {
        e.preventDefault();
    
        try {
            const response = await ApiService.loginUser(userName, password);
    
            const { token, userName: tokenUserName } = response.data.data;
            localStorage.setItem("token", token);
            localStorage.setItem("userName", tokenUserName);
    
            const role = userName === "admin" ? "admin" : "user";
            localStorage.setItem("role", role);
    

            if (onSuccess) {
                onSuccess(role);
            }
        } catch (err) {
            console.error("登入失敗", err); 

            setErrorMessage("登入失敗，請檢查帳號或密碼！");

        }
    };

    if (!isOpen) return null; // 如果模態框未打開，返回 null

    return (
        <div 
        className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white shadow-lg rounded-lg p-6 max-w-lg min-w-[300px] mx-auto">
                
                <h2 className="text-2xl font-bold text-center mb-4">登入</h2>

                {errorMessage && <div className="text-red-500 text-center mb-4">{errorMessage}</div>}
                
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
                        <label className="block text-gray-700 text-sm font-semibold mb-2">密碼</label>
                        <input
                            type="password"
                            className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="請輸入密碼"
                            required
                        />
                    </div>

                    <div className="flex justify-end gap-4">
                        <button
                            type="button"
                            className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition"
                            onClick={onClose} // 按「取消」關閉模態框
                        >
                            取消
                        </button>

                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                        >
                            登入
                        </button>
                        
                    </div>
                </form>
            </div>
        </div>
    );
}

export default LoginModal;
