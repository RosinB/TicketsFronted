import ProtectedRoute from "../../api/ProtectedRoute";
import AdminHosts from "../pages/AdminHosts";
import AdminHome from "../pages/AdminHosts";
import { Routes, Route } from "react-router-dom";

function AdminBody() {



    return (


        <div className="bg-white">



            <Routes>
                
                <Route path="/admin/hosts" element={
                    <ProtectedRoute>
                    <AdminHosts />
                    </ProtectedRoute>
                    }/>
                    
                <Route path="/admin"       element={
                    <ProtectedRoute>
                    <AdminHome/>
                    </ProtectedRoute>
                    } />

            </Routes>

        </div>
        )




}

export default AdminBody;