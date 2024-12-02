import { useState } from "react";
import AdminOnSale from "./ticketStatus/AdminOnSale";



function AdminTicket() {
    const [selectedTab, setSelectedTab] = useState("onsale");






    const renderContent = () => {
        switch (selectedTab) {
            case "onsale":
                return <AdminOnSale />;
            case "history":
            default:
                return null;
        }
    };


    return (
        <div className="container flex  mx-auto px-4 py-6 text-white">

          {/* 側邊欄 */}
            <aside className="w-64 bg-gray-800 text-white py-6 px-4 shadow-lg">
                <h2 className="text-lg font-bold mb-6 text-center border-b border-gray-700 pb-4">
                    後台管理
                </h2>
                <nav className="space-y-4">
                    <button
                        onClick={() => setSelectedTab("onsale")}
                        className={`block w-full py-2 px-4 rounded-md text-left transition ${selectedTab === "event"
                                ? "bg-blue-600 hover:bg-blue-500"
                                : "bg-gray-700 hover:bg-gray-600"
                            }`}
                    >
                        演唱會售票資訊
                    </button>
                    <button
                        onClick={() => setSelectedTab("history")}
                        className={`block w-full py-2 px-4 rounded-md text-left transition ${selectedTab === "ticket"
                                ? "bg-blue-600 hover:bg-blue-500"
                                : "bg-gray-700 hover:bg-gray-600"
                            }`}
                    >
                    歷史演唱會資訊
                    </button>
        
                </nav>
            </aside>

            {/* 主內容 */}
            <div className="flex-grow bg-gray-900 p-6">{renderContent()}</div>
        </div>
    );
}

export default  AdminTicket;