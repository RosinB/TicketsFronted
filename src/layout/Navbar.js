import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import LoginModal from "../components/LoginModal"; // 引入模態框

function Navbar() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [showPopover, setShowPopover] = useState(false); // 控制 Popover 的顯示狀態
    const [isLoginOpen, setIsLoginOpen] = useState(false); // 控制模態框顯示
    const navigate = useNavigate();
    let hideTimeout = null;
    const [role, setRole] = useState(localStorage.getItem("role") || "user");

    console.log(role);
    useEffect(() => {
        const token = localStorage.getItem("token");
        setIsLoggedIn(!!token);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        setIsLoggedIn(false);
        navigate("/"); // 登出後回到首頁
    };

    const handleMouseEnter = () => {
        if (hideTimeout) {
            clearTimeout(hideTimeout);
        }
        setShowPopover(true);
    };

    const handleMouseLeave = () => {
        hideTimeout = setTimeout(() => {
            setShowPopover(false);
        }, 200);
    };

    const handleLoginSuccess = (newRole) => {
        setRole(newRole); // 更新角色
        localStorage.setItem("role", newRole); // 同步本地存儲
        setIsLoginOpen(false); // 關閉模態框

        if (newRole === "admin") {
            window.location.href = "/admin";
        } else {
            navigate("/"); // 導航到普通用戶首頁
            window.location.href = "/"; // 普通用戶跳轉並刷新
        }
    };

    return (
        <nav className="bg-gradient-to-r from-blue-700 via-teal-600 to-teal-800 sticky top-0 z-10 shadow-lg">
            <div className="container mx-auto flex justify-between items-center py-4 px-6">
                {/* Logo */}
                <h1 className="text-2xl font-bold text-white">
                    <Link to="/">售票網站</Link>
                </h1>

                {/* 主選單 */}
                <ul className="hidden md:flex space-x-6 text-white font-semibold">
                    <li>
                        <Link to="/" className="hover:opacity-75 transition">
                            首頁
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

                    {/* 會員專區 */}
                    {isLoggedIn && (
                        <li
                            className="relative"
                            onMouseEnter={handleMouseEnter}
                            onMouseLeave={handleMouseLeave}
                        >
                            <button className="hover:opacity-75 transition">會員專區</button>
                            {showPopover && (
                                <div
                                    className="absolute z-10 mt-2 w-48 bg-white shadow-lg rounded-md ring-1 ring-black ring-opacity-5"
                                    style={{ left: "50%", transform: "translateX(-50%)" }} // 水平居中
                                    onMouseEnter={handleMouseEnter}
                                    onMouseLeave={handleMouseLeave}
                                >
                                    <div className="p-2">
                                        <Link
                                            to="/user/orders"
                                            className="block px-4 py-2 text-sm text-gray-800 hover:bg-gray-100 rounded-md"
                                        >
                                            訂單列表
                                        </Link>
                                        <Link
                                            to="/user/update"
                                            className="block px-4 py-2 text-sm text-gray-800 hover:bg-gray-100 rounded-md"
                                        >
                                            更新會員資料
                                        </Link>
                                    </div>
                                </div>
                            )}
                        </li>
                    )}

                    {isLoggedIn ? (
                        <li>
                            <button
                                onClick={handleLogout}
                                className="hover:opacity-75 transition text-white font-semibold"
                            >
                                登出
                            </button>
                        </li>
                    ) : (
                        <li>
                            <button
                                onClick={() => setIsLoginOpen(true)} // 點擊顯示模態框
                                className="hover:opacity-75 transition text-white font-semibold"
                            >
                                登入
                            </button>
                        </li>
                    )}
                </ul>

                {/* 手機選單 */}
                <div className="md:hidden">{/* 手機漢堡選單可根據需求加上 */}</div>
            </div>

            {/* 登入模態框 */}
            <LoginModal
                isOpen={isLoginOpen}
                onClose={() => setIsLoginOpen(false)} // 點擊關閉模態框
                onSuccess={(role) => {
                    console.log("onSuccess called with role989856:", role); // 確認回調是否被觸發
                     handleLoginSuccess(role); // 確保進入 handleLoginSuccess
                }}
            />
        </nav>
    );
}

export default Navbar;
