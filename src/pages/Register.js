import React from "react";

const Register = () => {
    return (
        <div className="bg-white shadow-md rounded-lg p-8 max-w-lg mx-auto">
            <h2 className="text-3xl font-bold text-center text-gray-800">會員註冊</h2>
            <form className="mt-6">
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-semibold mb-2">
                        電子郵件
                    </label>
                    <input
                        type="email"
                        className="w-full border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                        placeholder="請輸入電子郵件"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-semibold mb-2">
                        密碼
                    </label>
                    <input
                        type="password"
                        className="w-full border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                        placeholder="請輸入密碼"
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
