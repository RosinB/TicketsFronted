import ProtectedRoute from "../../api/ProtectedRoute";
import AdminHosts from "../pages/Host/AdminHosts";
import AdminHome from "../pages/AdminHome";
import { Routes, Route, Outlet } from "react-router-dom";
import AdminMembers from "../pages/AdminMembers";
import AdminEvent from "../pages/event/AdminEvent";

function AdminLayout() {
    return (
        <div className="bg-gray-900 py-8 h-full flex-grow">
            <div className="w-9/12 h-full mx-auto">
                <Outlet /> {/* 用於渲染子路由 */}
            </div>
        </div>
    );
}

function AdminBody() {
    return (
        <Routes>
            {/* 父路由 */}
            <Route
                path="/admin"
                element={
                    <ProtectedRoute>
                        <AdminLayout />
                    </ProtectedRoute>
                }
            >
                {/* 子路由 */}
                <Route index element={<AdminHome />} />
                <Route path="hosts" element={<AdminHosts />} />
                <Route path="members" element={<AdminMembers />} />
                <Route path="event" element={<AdminEvent />} />
            </Route>
        </Routes>
    );
}

export default AdminBody;
