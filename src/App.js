import React, { useState, useEffect } from "react";
import Navbar from "./layout/Navbar";
import Body from "./layout/Body";
import Footer from "./layout/Footer";
import AdminBody from "./admin/layout/AdminBody";
import AdminNavbar from "./admin/layout/AdminNavbar";


function App() {

    const [role, setRole] = useState(localStorage.getItem("role") || "user");

    useEffect(() => {
        localStorage.setItem("role", role);
    }, [role]);

    useEffect(() => {
        const handleStorageChange = (event) => {
            if (event.key === "role") {
                setRole(event.newValue || "user");
            }
        };

        window.addEventListener("storage", handleStorageChange);

        return () => {
            window.removeEventListener("storage", handleStorageChange);
        };
    }, []);



    const renderContent = () => {
        if (role === "admin") {
            return (
                <>
                    <AdminNavbar />
                    <AdminBody />
                </>
            );
        }
        return (
            <>
                <Navbar />
                <Body />
                <Footer />
            </>
        );
    };

    return (
        <div className="flex flex-col min-h-screen">
            {renderContent()}
        </div>
    );
}

export default App;
