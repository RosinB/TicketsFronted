import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "../pages/Homes";
import Register from "../pages/UserRegister";
import ProtectedRoute from "../api/ProtectedRoute";
import UserUpdate from "../pages/UserUpdate";
import TicketShow from "../pages/TicketShow";
import EventList from "../pages/TicketList";
import TicketSales from "../pages/TicketSales";
import TicketSection from "../pages/TicketSection";
import TicketOrders from "../pages/TicketOrders";
import UserOrder from "../pages/UserOrder";
import Login from "../pages/Login";
import TicketPending from "../pages/TicketPending";
import ForgetPassword from "../components/forgetpwd/ForgetPassword";
import ResestPassword from "../components/forgetpwd/ResestPassword"
import TicketPay from "../pages/TicketPay"
function Body() {

    // 非保護路由配置
    const publicRoutes = [
        { path: "/", element: <Home /> },
        { path: "/event/show", element: <TicketShow /> },
        { path: "/register", element: <Register /> },
        { path: "/event/list", element: <EventList /> },
        { path: "/login", element: <Login /> },
        { path: "/forgetpassword", element: <ForgetPassword /> },
        { path: "/forgetpassword/reset/:token", element: <ResestPassword /> },

    ];

    
    // 受保護路由配置
    const protectedRoutes = [
        { path: "/event/ticket/section/buy", element: <TicketSales /> },
        { path: "/event/ticket/pending", element: <TicketPending/> },
        { path: "/event/ticket/orderabs", element: <TicketOrders /> },
        { path: "/event/ticket/pay/:requestId", element: <TicketPay /> },
        { path: "/event/ticket/section", element: <TicketSection /> },
        { path: "/user/update", element: <UserUpdate /> },
        { path: "/user/orders", element: <UserOrder /> },

    
    ];


    return (
        <main className="flex-grow bg-gray-100 py-8">
            <div className="w-full">

                <Routes>
                    {publicRoutes.map(({ path, element }) => (
                        <Route key={path} path={path} element={element} />
                    ))}
                    {protectedRoutes.map(({ path, element }) => (
                        <Route key={path} path={path} element={<ProtectedRoute>{element}</ProtectedRoute>} />
                    ))}
                </Routes>

            </div>
        </main>
    );
}

export default Body;
