import React, { useState } from "react";
import ApiService from "../../api/ApiService";
import { useNavigate } from "react-router-dom";
import { User, Lock, AlertCircle, XCircle } from 'lucide-react';

function LoginModal({ isOpen, onClose, onSuccess }) {
    const [userName, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();

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

    const handleForgotPassword = () => {
        onClose(); // 關閉模態框
        navigate("/forgetpassword"); // 跳轉到忘記密碼頁面
    };

    if (!isOpen) return null; // 如果模態框未打開，返回 null

    return (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white shadow-lg rounded-lg p-8 max-w-2xl min-w-[400px] mx-auto">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                        <User className="w-6 h-6 text-blue-500" />
                        登入
                    </h2>
                    <button
                        type="button"
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition"
                    >
                        <XCircle className="w-6 h-6" />
                    </button>
                </div>

                {errorMessage && (
                    <div className="bg-red-100 text-red-700 border-l-4 border-red-500 p-4 mb-6 flex items-center gap-2">
                        <AlertCircle className="w-5 h-5" />
                        {errorMessage}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="flex flex-col items-center">
                    <div className="mb-6 w-full">
                        <label className="block text-gray-700 text-sm font-semibold mb-2 flex items-center gap-2">
                            <User className="w-5 h-5 text-blue-500" />
                            帳號
                        </label>
                        <input
                            type="text"
                            className="w-full border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                            value={userName}
                            onChange={(e) => setUserName(e.target.value)}
                            placeholder="請輸入帳號"
                            required
                        />
                    </div>

                    <div className="mb-6 w-full">
                        <label className="block text-gray-700 text-sm font-semibold mb-2 flex items-center gap-2">
                            <Lock className="w-5 h-5 text-blue-500" />
                            密碼
                        </label>
                        <input
                            type="password"
                            className="w-full border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="請輸入密碼"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="px-8 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition w-full"
                    >
                        登入
                    </button>
                </form>
                <div className="text-center mt-4">
                    <button
                        onClick={handleForgotPassword}
                        className="text-blue-600 hover:text-blue-800 text-sm"
                    >
                        忘記密碼？
                    </button>
                </div>
            </div>
        </div>
    );
}

export default LoginModal;