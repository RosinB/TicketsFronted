import React from "react";
import {  Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./layout/Navbar";
import Body from "./layout/Body";
import Footer from "./layout/Footer";
import AdminBody from "./admin/layout/AdminBody";
import AdminNavbar from "./admin/layout/AdminNavbar";

function App() {
    // 檢查用戶角色的函數
    const checkRole = () => localStorage.getItem("role") || "user";

    // 管理員頁面布局
    const AdminLayout = () => {
        return checkRole() === "admin" ? (
            <div className="flex flex-col min-h-screen">
                <AdminNavbar />
                <AdminBody />
            </div>
        ) : (
            <Navigate to="/" replace />
        );
    };

    // 用戶頁面布局
    const UserLayout = () => (
        <div className="flex flex-col min-h-screen">
            <Navbar />
            <Body />
            <Footer />
        </div>
    );

    return (
        <Routes>
            {/* 管理員路由 */}
            <Route path="/admin/*" element={<AdminLayout />} />

            {/* 用戶路由 */}
            <Route path="/*" element={<UserLayout />} />
        </Routes>
    );
}

export default App;