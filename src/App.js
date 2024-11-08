import React from "react";
import Navbar from "./components/Navbar";
import Body from "./components/Body";
import Footer from "./components/Footer";

const App = () => {
    return (
            <div className="flex flex-col min-h-screen">
                <Navbar />
                <Body />
                <Footer />
            </div>
    );
};

export default App;
