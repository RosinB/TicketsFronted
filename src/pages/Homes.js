import React from "react";
import TicketCarouse from '../components/home/TicketCarousel'
import NewsSection from "../components/home/NewsSection";
function Home() {

    return (
        <div className="text-center">
            {/* 放圖片的區域 */}
            <div className="w-screen aspect-[16/9] max-h-[300px]  -mt-1 relative">
                <div className="absolute top-0 left-0 w-full h-full">
                    <TicketCarouse />
                </div>
            </div>

            <NewsSection />
        </div>
    );
}

export default Home;
