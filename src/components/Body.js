import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "../pages/Homes"
import Register from "../pages/Register";
import Members from "../pages/Members";
import Login from "../pages/Login";
import ProtectedRoute from "../api/ProtectedRoute";
import UserUpdate from "../pages/UserUpdate";
import Event from "../components/Event"
const Body = () => {
    return (
        <main className="flex-grow bg-gray-50 py-10">
            <div className="container mx-auto px-6">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/event" element={<Event />} />
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
