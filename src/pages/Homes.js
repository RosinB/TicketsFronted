import React from "react";
import TicketCarouse from '../components/TicketCarousel'
import NewsSection from "./home/NewsSection";
function Home() {
    // console.log("當前路徑:", window.location.pathname);
    return (
        <div className="text-center">
            {/* 放圖片的區域 */}
            <div className="w-screen aspect-[16/9] max-h-[300px]  -mt-1 relative">
                <div className="absolute top-0 left-0 w-full h-full">
                    <TicketCarouse />
                </div>
                
            </div>
            <div className="w-full h-2 bg-gray-700 mx-auto -mt-4 "></div>

    
            {/* 消息區 */}
                <NewsSection  />

               

        </div>
    );
}

export default Home;
