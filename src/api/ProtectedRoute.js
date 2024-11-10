import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {

    const token = localStorage.getItem("token");
    console.log("網頁經過ProtectedRoute驗證token")
    if (!token) {
        // 如果沒有 Token，跳轉到登入頁
        return <Navigate to="/login" replace />;
    }

    // 如果有 Token，渲染子組件
    return children;
};

export default ProtectedRoute;
