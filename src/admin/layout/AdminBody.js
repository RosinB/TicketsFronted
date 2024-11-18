import ProtectedRoute from "../../api/ProtectedRoute";
import AdminHosts from "../pages/AdminHosts";
import AdminHome from "../pages/AdminHome";
import { Routes, Route } from "react-router-dom";
import Members from "../../pages/user/Members";
function AdminBody() {

    return (
        <div className="bg-white">

            <Routes>
                <Route path="/admin" element={
                    <ProtectedRoute>
                        <AdminHome/>
                    </ProtectedRoute>} />

                <Route path="/admin/hosts" element={
                    <ProtectedRoute>
                        <AdminHosts/>
                    </ProtectedRoute>} />

                <Route path="/admin/members"element={
                        <ProtectedRoute>
                            <Members />
                        </ProtectedRoute>} />
            </Routes>

        </div>
    )




}

export default AdminBody;