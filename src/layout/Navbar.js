import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import LoginModal from "../components/ui/LoginModal"; // 引入模態框

function Navbar() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [showPopover, setShowPopover] = useState(false); // 控制 Popover 的顯示狀態
    const [isLoginOpen, setIsLoginOpen] = useState(false); // 控制模態框顯示
    const [role, setRole] = useState(localStorage.getItem("role") || "user");
    const navigate = useNavigate();
    const [popoverTimeout, setPopoverTimeout] = useState(null); // 保存延遲計時器

    useEffect(() => {
        const token = localStorage.getItem("token");
        console.log("目前使用者權限:",role)
        setIsLoggedIn(!!token);
    }, [role]);


    //登出
    const handleLogout = () => {
        localStorage.removeItem("token");
        setIsLoggedIn(false);
        navigate("/"); // 登出後回到首頁
    };
    const handleMouseEnter = () => {
        clearTimeout(popoverTimeout); // 清除隱藏的延遲計時器
        setShowPopover(true); // 立即顯示
    };
    const handleMouseLeave = () => {
        const timeout = setTimeout(() => {
            setShowPopover(false);
        }, 100); 
        setPopoverTimeout(timeout);
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
                <h1 className="text-2xl font-bold text-white">
                    <Link to="/">售票網站</Link>
                </h1>
                {/* 主選單 */}
                <ul className="hidden md:flex space-x-6 text-white font-semibold">
                    <li><Link to="/" className="hover:opacity-75 transition">首頁</Link></li>
                    <li><Link to="/event/list" className="hover:opacity-75 transition">購票列表</Link></li>
                    <li><Link to="/register" className="hover:opacity-75 transition">註冊</Link></li>


                    {/* 會員專區 */}              
                        <li
                            className="relative"
                            onMouseEnter={handleMouseEnter} 
                            onMouseLeave={handleMouseLeave} 
                        >
                            <button className="hover:opacity-75 transition">會員專區</button>
                            {showPopover && (
                                <div
                                    className="absolute z-10 mt-2 w-48 bg-white shadow-lg rounded-md ring-1 ring-black ring-opacity-5"
                                    style={{ left: "50%", transform: "translateX(-50%)" }}>

                                    <div className="p-2">
                                        <MemberLink to="/user/orders" title="訂單列表"/>
                                        <MemberLink to="/user/update" title="更新會員資料"/>
                                        <MemberLink to="/user/email" title= "驗證信箱"/>

                                    </div>

                                </div>
                            )}
                        </li>
                    
                    {/* 登入按鈕切換 */}
                    {isLoggedIn 
                    ? (
                        <li>
                            <button onClick={handleLogout} className="hover:opacity-75 transition text-white font-semibold"> 登出</button>
                        </li>) 
                    : (
                        <li>
                            <button onClick={() => setIsLoginOpen(true)} className="hover:opacity-75 transition text-white font-semibold">登入</button>
                        </li>)
                    }

                </ul>
            </div>

            {/* 登入模態框 */}
            <LoginModal
                isOpen={isLoginOpen}
                onClose={() => setIsLoginOpen(false)} 
                onSuccess={(role) => {
                handleLoginSuccess(role); 
                }}/>
        </nav>
    );
}

export default Navbar;


const MemberLink=({to,title})=>{

    return(<Link to={to} className="block px-4 py-2 text-sm text-gray-800 hover:bg-gray-100 rounded-md">{title}</Link>)


}