import ProtectedRoute from "../../api/ProtectedRoute";
import AdminHosts from "../pages/Host/AdminHosts";
import AdminHome from "../pages/AdminHome";
import { Routes, Route } from "react-router-dom";
import AdminMembers from "../pages/AdminMembers"
import AdminEvent from "../pages/event/AdminEvent";

function AdminBody() {

    return (
        <div className="bg-gray-900  py-8 h-full 	  flex-grow">
            <div className="w-9/12 h-full 	 mx-auto">
                <Routes>
                    <Route path="/admin" element={
                        <ProtectedRoute>
                            <AdminHome />
                        </ProtectedRoute>} />

                    <Route path="/admin/hosts" element={
                        <ProtectedRoute>
                            <AdminHosts />
                        </ProtectedRoute>} />

                    <Route path="/admin/members" element={
                        <ProtectedRoute>
                            <AdminMembers />
                        </ProtectedRoute>} />
                    <Route path="/admin/event" element={
                        <ProtectedRoute>
                            <AdminEvent />
                        </ProtectedRoute>} />



                </Routes>
            </div>
        </div>
    )




}

export default AdminBody;