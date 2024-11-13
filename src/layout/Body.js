import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "../pages/Homes"
import Register from "../pages/user/Register";
import Members from "../pages/user/Members";
import Login from "../pages/user/Login";
import ProtectedRoute from "../api/ProtectedRoute";
import UserUpdate from "../pages/user/UserUpdate";
import EventTicket from "../pages/event/EventTicket"
import EventList from "../pages/event/EventList";


function Body() {
    return (
        <main className="flex-grow bg-gray-50 py-8">
            <div className="w-full">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/eventticket/" element={<EventTicket />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/eventlist/" element={<EventList />} />
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
