import React, { useState, useEffect } from "react";
import Navbar from "./layout/Navbar";
import Body from "./layout/Body";
import Footer from "./layout/Footer";
import AdminBody from "./admin/layout/AdminBody";
import AdminNavbar from "./admin/layout/AdminNavbar";

function App() {
    const [role, setRole] = useState(localStorage.getItem("role")); // 使用狀態來管理角色

    // 監控 localStorage 的變化
    useEffect(() => {
        const handleStorageChange = () => {
            setRole(localStorage.getItem("role"));
        };

        // 監聽 localStorage 的變化
        window.addEventListener("storage", handleStorageChange);

        // 清除事件監聽
        return () => {
            window.removeEventListener("storage", handleStorageChange);
        };
    }, []);




    if (role === "admin") {
        return (
            <div className="flex flex-col min-h-screen">
                <AdminNavbar />
                <AdminBody />

            </div>
        );
    }


    
    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />
            <Body />
            <Footer />
        </div>
    );
};

export default App;
