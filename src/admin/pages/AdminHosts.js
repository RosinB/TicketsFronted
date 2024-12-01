import React, { useState } from "react";
import { Users, UserPlus } from "lucide-react";
import HostList from "../components/host/HostList";
import HostAdd from "../components/host/HostAdd";

function AdminHosts() {
    const [selectedTab, setSelectedTab] = useState("list");

    const renderContent = () => {
        switch (selectedTab) {
            case "list":
                return <HostList />;
            case "add":
                return <HostAdd />;
            default:
                return null;
        }
    };

    return (
        <div className="container flex mx-auto px-4 py-6 text-white">
            {/* 側邊欄 */}
            <aside className="w-64 bg-gray-800 text-white py-8 px-4 shadow-lg">
                <h2 className="text-xl font-bold mb-8 text-center border-b border-gray-700 pb-4">
                    主辦方管理
                </h2>
                <nav className="space-y-6">
                    <button
                        onClick={() => setSelectedTab("list")}
                        className={`block w-full py-3 px-4 rounded-md text-left transition flex items-center ${
                            selectedTab === "list"
                                ? "bg-blue-600 hover:bg-blue-500"
                                : "bg-gray-700 hover:bg-gray-600"
                        }`}
                    >
                        <Users className="w-5 h-5 mr-3" />
                        <span>主辦列表</span>
                    </button>
                    <button
                        onClick={() => setSelectedTab("add")}
                        className={`block w-full py-3 px-4 rounded-md text-left transition flex items-center ${
                            selectedTab === "add"
                                ? "bg-blue-600 hover:bg-blue-500"
                                : "bg-gray-700 hover:bg-gray-600"
                        }`}
                    >
                        <UserPlus className="w-5 h-5 mr-3" />
                        <span>新增主辦</span>
                    </button>
                </nav>
            </aside>

            {/* 主內容 */}
            <div className="flex-grow bg-gray-900 p-8 rounded-lg">
                {renderContent()}
            </div>
        </div>
    );
}

export default AdminHosts;