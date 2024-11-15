import React from "react";
import TicketCarouse from '../components/TicketCarousel'

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
    
            {/* 註冊按鈕 */}
            <div className="mt-4">
                <button className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition">
                    註冊會員 
                </button>
            </div>
    
            {/* 消息區 */}
            <div className="bg-gray-100 text-gray-800 p-6 mt-8 rounded-md shadow-lg max-w-4xl mx-auto">
                <h3 className="text-2xl font-semibold mb-4">最新消息</h3>
                <p className="text-lg">
                    這裡還不知道要幹嘛
                    lottie-react
                    tsParticles
                </p>
            </div>
        </div>
    );
}

export default Home;
