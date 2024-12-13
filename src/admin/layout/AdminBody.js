import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "../../api/ProtectedRoute";
import AdminHosts from "../pages/AdminHosts";
import AdminMembers from "../pages/AdminMembers";
import AdEventDetail from "../components/event/AdEventDetail"
import AdminOrder from "../pages/AdminOrder";
import RealTimeTicket from "../pages/ticketStatus/RealTimeTicket"
import AdminDashboard from "../pages/AdminDashBoard";
import AdminRefund from "../pages/AdminRefund";
import AdminTraffic from "../pages/AdminTraffic"
import TrafficRecord from "../components/traffic/TrafficRecord";
import TrafficRequest from "../components/traffic/TrafficRequest";
function AdminBody() {
    // 路由配置
    const adminRoutes = [
        { path: "hosts", element: <AdminHosts /> },
        { path: "members", element: <AdminMembers /> },
        { path: "order", element: <AdminOrder /> },
        { path: "event/details/:eventId", element: <AdEventDetail /> },
        { path: "status/realtime/:eventId", element: <RealTimeTicket /> },
        { path: "traffic", element: <AdminTraffic /> },
        { path: "dashboard", element: <AdminDashboard /> },
        { path: "refund", element: <AdminRefund /> },
        { path: "traffic/record/:eventId", element: <TrafficRecord /> },
        { path: "traffic/requests", element: <TrafficRequest /> },

    ];

    return (
        <main className="bg-gray-900 flex-grow h-full">
            <div className="w-9/12 h-full mx-auto">
            <Routes>
                    {/* 添加預設路由 */}
                    <Route path="/" element={<Navigate to="dashboard" replace />} />
                    
                    {adminRoutes.map(({ path, element }) => (
                        <Route 
                            key={path}  
                            path={path} 
                            element={<ProtectedRoute>{element}</ProtectedRoute>}
                        />
                    ))}
                </Routes>
            </div>
        </main>
    );
}

export default AdminBody;
