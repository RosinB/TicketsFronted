import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "../pages/Homes"
import Register from "../pages/user/Register";
import Login from "../pages/user/Login";
import ProtectedRoute from "../api/ProtectedRoute";
import UserUpdate from "../pages/user/UserUpdate";
import EventTicket from "../pages/sales/EventTicket"
import EventList from "../pages/event/EventList";
import TicketSales from "../pages/sales/TicketSales";
import TicketSection from "../pages/sales/TicketSection";
import TicketOrders from "../pages/orders/TicketOrders";
import UserOrder from "../pages/orders/UserOrder";
function Body() {









    return (
        <main className="flex-grow bg-gray-100 py-8">
            <div className="w-full">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/event/ticket" element={<EventTicket />} />
                    <Route path="/register" element={<Register />} />

                    <Route path="/event/list" element={<EventList />} />

                    <Route path="/event/ticket/section/buy" element={
                        <ProtectedRoute>
                            <TicketSales />
                        </ProtectedRoute>
                    } />
                    <Route path="/event/ticket/orderabs" element={
                        <ProtectedRoute>
                            <TicketOrders />
                        </ProtectedRoute>
                    } />

                    <Route path="/event/ticket/section" element={
                        <ProtectedRoute>
                            <TicketSection />
                        </ProtectedRoute>

                    } />


                    <Route path="/user/update"
                        element={
                            <ProtectedRoute>
                                <UserUpdate />
                            </ProtectedRoute>

                        } />
                    <Route path="/user/orders"
                        element={
                            <ProtectedRoute>
                                <UserOrder />
                            </ProtectedRoute>
                        }




                    />


                    <Route path="/login" element={<Login />} />
                </Routes>
            </div>
        </main>
    );
};

export default Body;
