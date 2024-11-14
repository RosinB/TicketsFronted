import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "../pages/Homes"
import Register from "../pages/user/Register";
import Members from "../pages/user/Members";
import Login from "../pages/user/Login";
import ProtectedRoute from "../api/ProtectedRoute";
import UserUpdate from "../pages/user/UserUpdate";
import EventTicket from "../pages/sales/EventTicket"
import EventList from "../pages/event/EventList";
import TicketSales from "../pages/sales/TicketSales";
import TicketSection from "../pages/sales/TicketSection";

function Body() {
    return (
        <main className="flex-grow bg-gray-50 py-8">
            <div className="w-full">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/eventticket/" element={<EventTicket />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/eventlist/" element={<EventList />} />
                    <Route path="/goticket" element={
                            <ProtectedRoute>
                                <TicketSales />
                            </ProtectedRoute>

                    } />
                    <Route path="/ticktsection" element={
                            <ProtectedRoute>
                                <TicketSection />
                            </ProtectedRoute>

                    } />


                    <Route path="/members"
                        element={
                            <ProtectedRoute>
                                <Members />
                            </ProtectedRoute>
                        } />
                    <Route path="/userupdate"
                        element={
                            <ProtectedRoute>
                                <UserUpdate />
                            </ProtectedRoute>

                        } />
                    <Route path="/login" element={<Login />} />
                </Routes>
            </div>
        </main>
    );
};

export default Body;
