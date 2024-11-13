import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import LoadingSpinner from "../components/LoadingSpinner";

const ProtectedRoute = ({ children }) => {
    const [isLoading, setIsLoading] = useState(true); // 標記檢查是否完成
    const [isAuthenticated, setIsAuthenticated] = useState(false); // 標記是否有 Token

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            setIsAuthenticated(true);
        }
        setIsLoading(false); // 完成檢查
    }, []);

    if (isLoading) {
        // 檢查過程中顯示 Loading 狀態
        return<LoadingSpinner/>;
    }

    if (!isAuthenticated) {
        // 如果沒有 Token，跳轉到登入頁
        return <Navigate to="/login" replace />;
    }

    // 如果有 Token，渲染子組件
    return children;
};

export default ProtectedRoute;