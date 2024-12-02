import React from "react";
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "../../api/ProtectedRoute";
import AdminHosts from "../pages/AdminHosts";
import AdminMembers from "../pages/AdminMembers";
import AdEventDetail from "../components/event/AdEventDetail"
import AdminOrder from "../pages/AdminOrder";
import AdminTicket from "../pages/AdminTicket";
import RealTimeTicket from "../pages/ticketStatus/RealTimeTicket"
import TrafficStatsChart from "../traffic/TrafficStatsChart";
import AdminDashboard from "../pages/AdminDashBoard";

function AdminBody() {
    // 路由配置
    const adminRoutes = [
        { path: "/admin", element: <AdminTicket /> },
        { path: "/admin/hosts", element: <AdminHosts /> },
        { path: "/admin/members", element: <AdminMembers /> },
        { path: "/admin/order", element: <AdminOrder /> },
        { path: "/admin/event/details/:eventId", element: <AdEventDetail /> },
        { path: "/admin/status/realtime/:eventId", element: <RealTimeTicket /> },
        { path: "/admin/traffic", element: <TrafficStatsChart /> },
        { path: "/admin/dashboard", element: <AdminDashboard /> },

        

    ];

    return (
        <main className="bg-gray-900 flex-grow h-full ">
            <div className="w-9/12 h-full mx-auto ">

                <Routes>
                    {adminRoutes.map(({ path, element }) => (
                        <Route key={path}  path={path} element={ <ProtectedRoute> {element} </ProtectedRoute>}/>
                    ))}

                </Routes>
            </div>
        </main>
    );
}

export default AdminBody;
