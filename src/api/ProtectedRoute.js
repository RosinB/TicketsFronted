import React, { useState, useEffect, } from "react";
import { useNavigate } from "react-router-dom";
import LoginModal from "../components/ui/LoginModal";
import LoadingSpinner from "../components/ui/LoadingSpinner";

const ProtectedRoute = ({ children }) => {
    const [isLoading, setIsLoading] = useState(true); // 標記檢查是否完成
    const [isAuthenticated, setIsAuthenticated] = useState(false); // 標記是否有 Token
    const [isLoginOpen, setIsLoginOpen] = useState(false); // 控制模態框顯示
    const navigate = useNavigate(); // 初始化導航功能
    const [role, setRole] = useState(localStorage.getItem("role") || "user");

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            setIsAuthenticated(true);
        } else {
            setIsLoginOpen(true); // 沒有 Token 時顯示模態框
        }
        setIsLoading(false); 
    }, []);

    const handleLoginCancel = () => {
        setIsLoginOpen(false); // 關閉模態框
        navigate("/"); // 跳轉回首頁
    };



    const handleLoginSuccess = (newRole) => {
        setRole(newRole); // 更新角色
        localStorage.setItem("role", newRole); // 同步本地存儲
        setIsLoginOpen(false); // 關閉模態框

        if (role === "admin") {
            navigate("/admin"); // 導航到管理員頁面
            window.location.reload()
        } else {
            navigate("/"); // 導航到普通用戶首頁
            window.location.reload()
        }
    };




    if (isLoading) {
        // 檢查過程中顯示 Loading 狀態
        return <LoadingSpinner />;
    }

    if (!isAuthenticated) {
        // 如果未登入，顯示模態框，暫時不渲染子內容
        return (
        <LoginModal
                isOpen={isLoginOpen}
                onClose={handleLoginCancel} // 點擊關閉模態框時跳轉到首頁
                onSuccess={(role) => {
                     handleLoginSuccess(role); // 確保進入 handleLoginSuccess
                }}
            />
        );
    }

    // 如果有 Token，渲染子組件
    return children;
};

export default ProtectedRoute;
