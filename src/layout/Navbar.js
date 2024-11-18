import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";


function Navbar() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    // 檢查 localStorage 中是否存在 token
    const navigate = useNavigate();

    useEffect(() => {

        const token = localStorage.getItem("token");
        setIsLoggedIn(!!token);
        // 如果有 token，設置為已登錄
    }, []);

    // 登出功能
    const handleLogout = () => {
        // 清除 token
        localStorage.removeItem("token");
        setIsLoggedIn(false); // 登出後更新狀態

        navigate("/login"); // 跳轉到登入頁

    };





    return (
        <nav className="bg-gradient-to-r  from-black via-gray-800 to-gray-900  shadow-2xl sticky top-0 z-10">
            <div className="container mx-auto flex justify-between items-center py-4 px-6">
                <h1 className="text-2xl font-bold text-white">
                    <Link to="/">售票網站</Link>
                </h1>
                <ul className="flex space-x-6 text-white font-semibold">
                    <li>
                        <Link to="/" className="hover:opacity-75 transition">
                            首頁
                        </Link>
                    </li>
                    <li>
                        <Link to="/user/orders" className="hover:opacity-75 transition">
                            訂單列表
                        </Link>
                    </li>

                    <li>
                        <Link to="/event/list" className="hover:opacity-75 transition">
                            購票列表
                        </Link>
                    </li>
                    <li>
                        <Link to="/register" className="hover:opacity-75 transition">
                            註冊
                        </Link>
                    </li>
                    <li>
                        <Link to="/user/update" className="hover:opacity-75 transition">
                            更新會員資料
                        </Link>
                    </li>

                    <li>
                        {isLoggedIn ? (
                            <button
                                onClick={handleLogout}
                                className="hover:opacity-75 transition"
                            >
                                登出
                            </button>
                        ) : (
                            <Link to="/login" className="hover:opacity-75 transition">
                                登入
                            </Link>
                        )}
                    </li>
                </ul>
            </div>
        </nav>
    );

};

export default Navbar;
