import React, { useState, useEffect } from "react";
import ApiService from "../../api/ApiService";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import EventManagement from "../components/event/EventManagement";
import TicketInfo from "../components/event/TicketInfo";
import ImageGallery from "../components/event/ImageGallery";
function AdminEvent() {
    const [selectedTab, setSelectedTab] = useState("event");
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchEvent = async () => {
        try {
            const response = await ApiService.fetchAdminAllEvent();
            setData(response.data.data); // 提取 JSON 中的 data
        } catch (error) {
            console.error("後台演唱會資訊沒有抓到", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEvent();
    }, []);

    if (loading) return <LoadingSpinner />;

    const renderContent = () => {
        switch (selectedTab) {
            case "event":
                return <EventManagement data={data} />;
            case "ticket":
                return <TicketInfo data={data} />;
            case "image":
                return <ImageGallery data={data} />;
            default:
                return null;
        }
    };

    return (
        <div className="flex h-full min-h-screen bg-gray-900 text-white">

          {/* 側邊欄 */}
            <aside className="w-64 bg-gray-800 text-white py-6 px-4 shadow-lg">
                <h2 className="text-lg font-bold mb-6 text-center border-b border-gray-700 pb-4">
                    後台管理
                </h2>
                <nav className="space-y-4">
                    <button
                        onClick={() => setSelectedTab("event")}
                        className={`block w-full py-2 px-4 rounded-md text-left transition ${selectedTab === "event"
                                ? "bg-blue-600 hover:bg-blue-500"
                                : "bg-gray-700 hover:bg-gray-600"
                            }`}
                    >
                        後台演唱會管理
                    </button>
                    <button
                        onClick={() => setSelectedTab("ticket")}
                        className={`block w-full py-2 px-4 rounded-md text-left transition ${selectedTab === "ticket"
                                ? "bg-blue-600 hover:bg-blue-500"
                                : "bg-gray-700 hover:bg-gray-600"
                            }`}
                    >
                        票務資訊
                    </button>
                    <button
                        onClick={() => setSelectedTab("image")}
                        className={`block w-full py-2 px-4 rounded-md text-left transition ${selectedTab === "image"
                                ? "bg-blue-600 hover:bg-blue-500"
                                : "bg-gray-700 hover:bg-gray-600"
                            }`}
                    >
                        圖片
                    </button>
                </nav>
            </aside>

            {/* 主內容 */}
            <div className="flex-grow bg-gray-900 p-6">{renderContent()}</div>
        </div>
    );
}

export default AdminEvent;








