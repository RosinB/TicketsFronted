import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "../pages/Homes"
import Register from "../pages/Register";
import Members from "./Members";

const Body = () => {
    return (
        <main className="flex-grow bg-gray-50 py-10">
            <div className="container mx-auto px-6">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/members" element={<Members />} />
                </Routes>
            </div>
        </main>
    );
};

export default Body;
