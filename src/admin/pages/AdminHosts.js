import React, { useState } from "react";

import HostList from "../components/host/HostList";
import HostAdd from "../components/host/HostAdd";

function AdminHosts() {
    // 狀態管理當前顯示的內容
    const [selectedTab, setSelectedTab] = useState("list");

    // 根據當前選中的標籤渲染內容
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
        <div className="container flex  mx-auto px-4 py-6 text-white">
            {/* 側邊欄 */}
            <aside className="w-64 bg-gray-800 text-white py-6 px-4 shadow-lg">
                <h2 className="text-lg font-bold mb-6 text-center border-b border-gray-700 pb-4">
                    主辦方管理
                </h2>
                <nav className="space-y-4">
                    <button
                        onClick={() => setSelectedTab("list")}
                        className={`block w-full py-2 px-4 rounded-md text-left transition ${
                            selectedTab === "list"
                                ? "bg-blue-600 hover:bg-blue-500"
                                : "bg-gray-700 hover:bg-gray-600"
                        }`}
                    >
                        主辦列表
                    </button>
                    <button
                        onClick={() => setSelectedTab("add")}
                        className={`block w-full py-2 px-4 rounded-md text-left transition ${
                            selectedTab === "add"
                                ? "bg-blue-600 hover:bg-blue-500"
                                : "bg-gray-700 hover:bg-gray-600"
                        }`}
                    >
                        新增主辦
                    </button>
                </nav>
            </aside>

            {/* 主內容 */}
            <div className="flex-grow bg-gray-900 p-6">{renderContent()}</div>
        </div>
    );
}

export default AdminHosts;
