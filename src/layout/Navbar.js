import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import LoginModal from "../components/modal/LoginModal";
import { Home, Calendar, LogIn, LogOut, User, UserPlus } from 'lucide-react';

function Navbar() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [showPopover, setShowPopover] = useState(false);
    const [isLoginOpen, setIsLoginOpen] = useState(false);
    const [role, setRole] = useState(localStorage.getItem("role") || "user");
    const navigate = useNavigate();
    const [popoverTimeout, setPopoverTimeout] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem("token");
        console.log("目前使用者權限:",role)
        setIsLoggedIn(!!token);
    }, [role]);

    const handleLogout = () => {
        localStorage.removeItem("token");
        setIsLoggedIn(false);
        navigate("/");
    };

    const handleMouseEnter = () => {
        clearTimeout(popoverTimeout);
        setShowPopover(true);
    };

    const handleMouseLeave = () => {
        const timeout = setTimeout(() => {
            setShowPopover(false);
        }, 100);
        setPopoverTimeout(timeout);
    };

    const handleLoginSuccess = (newRole) => {
        setRole(newRole);
        localStorage.setItem("role", newRole);
        setIsLoginOpen(false);

        if (newRole === "admin") {
            window.location.href = "/admin";
        } else {
            navigate("/");
            window.location.href = "/";
        }
    };

    return (
        <nav className="bg-gradient-to-r from-blue-700 via-teal-600 to-teal-800 sticky top-0 z-10 shadow-lg">
            <div className="container mx-auto flex justify-between items-center py-4 px-6">
                <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                    <Home className="w-6 h-6" />
                    <Link to="/">售票網站</Link>
                </h1>
                <ul className="hidden md:flex space-x-6 text-white font-semibold">
                    <li><Link to="/" className="flex items-center gap-2 hover:opacity-75 transition"><Home className="w-5 h-5" /> 首頁</Link></li>
                    <li><Link to="/event/list" className="flex items-center gap-2 hover:opacity-75 transition"><Calendar className="w-5 h-5" /> 購票列表</Link></li>
                    <li><Link to="/register" className="flex items-center gap-2 hover:opacity-75 transition"><UserPlus className="w-5 h-5" /> 註冊</Link></li>
                    <li
                        className="relative"
                        onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave}
                    >
                        <button className="flex items-center gap-2 hover:opacity-75 transition"><User className="w-5 h-5" /> 會員專區</button>
                        {showPopover && (
                            <div
                                className="absolute z-10 mt-2 w-48 bg-white shadow-lg rounded-md ring-1 ring-black ring-opacity-5"
                                style={{ left: "50%", transform: "translateX(-50%)" }}
                            >
                                <div className="p-2">
                                    <MemberLink to="/user/orders" title="訂單列表" />
                                    <MemberLink to="/user/update" title="更新會員資料" />
                                </div>
                            </div>
                        )}
                    </li>
                    {isLoggedIn
                        ? (
                            <li>
                                <button onClick={handleLogout} className="flex items-center gap-2 hover:opacity-75 transition"><LogOut className="w-5 h-5" /> 登出</button>
                            </li>
                        )
                        : (
                            <li>
                                <button onClick={() => setIsLoginOpen(true)} className="flex items-center gap-2 hover:opacity-75 transition"><LogIn className="w-5 h-5" /> 登入</button>
                            </li>
                        )
                    }
                </ul>
            </div>
            <LoginModal
                isOpen={isLoginOpen}
                onClose={() => setIsLoginOpen(false)}
                onSuccess={(role) => {
                    handleLoginSuccess(role);
                }}
            />
        </nav>
    );
}

export default Navbar;

const MemberLink = ({ to, title }) => {
    return (
        <Link to={to} className="block px-4 py-2 text-sm text-gray-800 hover:bg-gray-100 rounded-md flex items-center gap-2">
            <User className="w-4 h-4" />
            {title}
        </Link>
    )
}