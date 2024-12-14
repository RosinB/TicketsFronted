import React from "react";
import {  Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./layout/Navbar";
import Body from "./layout/Body";
import Footer from "./layout/Footer";
import AdminBody from "./admin/layout/AdminBody";
import AdminNavbar from "./admin/layout/AdminNavbar";
import BlockList from "./admin/components/event/BlockList";
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
  // 封鎖頁面布局
    const BlockLayout = () => (
    <div className="flex flex-col min-h-screen">
        <BlockList />
    </div>

);
    return (
        <Routes>
            <Route path="/block" element={<BlockLayout />} />

            {/* 管理員路由 */}
            <Route path="/admin/*" element={<AdminLayout />} />

            {/* 用戶路由 */}
            <Route path="/*" element={<UserLayout />} />
        </Routes>
    );
}


export default App;