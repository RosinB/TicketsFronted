import React from "react";
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "../../api/ProtectedRoute";
import AdminHome from "../pages/AdminHome";
import AdminHosts from "../pages/AdminHosts";
import AdminMembers from "../pages/AdminMembers";
import AdminEvent from "../pages/AdminEvent";

function AdminBody() {
    // 路由配置
    const adminRoutes = [
        { path: "/admin", element: <AdminHome /> },
        { path: "/admin/hosts", element: <AdminHosts /> },
        { path: "/admin/members", element: <AdminMembers /> },
        { path: "/admin/event", element: <AdminEvent /> },
    ];

    return (
        <main className="bg-gray-900 py-8 h-full flex-grow">
            <div className="w-9/12 h-full mx-auto">

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
