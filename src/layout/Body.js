import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Home from "../pages/Homes";
import Register from "../pages/UserRegister";
import ProtectedRoute from "../api/ProtectedRoute";
import UserUpdate from "../pages/UserUpdate";
import EventTicket from "../pages/TicketShow";
import EventList from "../pages/TicketList";
import TicketSales from "../pages/TicketSales";
import TicketSection from "../pages/TicketSection";
import TicketOrders from "../pages/TicketOrders";
import UserOrder from "../pages/UserOrder";
import LoginModal from "../components/LoginModal";
import Login from "../components/Login";

function Body() {
    const [isLoginOpen, setIsLoginOpen] = useState(false); // 控制模態框的顯示狀態

    const handleLoginOpen = () => {
        setIsLoginOpen(true); // 打開模態框
    };

    const handleLoginClose = () => {
        setIsLoginOpen(false); // 關閉模態框
    };

    const handleLoginSuccess = (role) => {
        console.log("登入成功，角色：", role);
        handleLoginClose(); // 登入成功後關閉模態框
    };

    return (
        <main className="flex-grow bg-gray-100 py-8">
            <div className="w-full">
                <Routes>
                    <Route path="/" element={<Home onLoginClick={handleLoginOpen} />} />
                    <Route path="/event/ticket" element={<EventTicket />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/event/list" element={<EventList />} />
                    <Route path="/login" element={<Login/>} />

                    
                    <Route
                        path="/event/ticket/section/buy"
                        element={
                            <ProtectedRoute>
                                <TicketSales />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/event/ticket/orderabs"
                        element={
                            <ProtectedRoute>
                                <TicketOrders />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/event/ticket/section"
                        element={
                            <ProtectedRoute>
                                <TicketSection />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/user/update"
                        element={
                            <ProtectedRoute>
                                <UserUpdate />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/user/orders"
                        element={
                            <ProtectedRoute>
                                <UserOrder />
                            </ProtectedRoute>
                        }
                    />
                </Routes>

                {/* 登入模態框 */}
                <LoginModal
                    isOpen={isLoginOpen}
                    onClose={handleLoginClose} // 點擊取消關閉模態框
                    onSuccess={handleLoginSuccess} // 登入成功後的回調
                />
            </div>
        </main>
    );
}

export default Body;
