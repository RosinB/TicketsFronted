import React from "react";
import Navbar from "./layout/Navbar";
import Body from "./layout/Body";
import Footer from "./layout/Footer";

function App(){
    return (
            <div className="flex flex-col min-h-screen">
                <Navbar />
                <Body />
                <Footer />
            </div>
    );
};

export default App;
