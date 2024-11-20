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
                return (<HostList />)
            case "add":
                return (<HostAdd />)
            default:
                return null;
        }
    };

    return (
        <div className="flex h-full">
            {/* 側邊欄 */}
            <aside className="w-40 bg-gray-900 text-white flex flex-col py-6 px-4 shadow-lg border border-gray-700 bg-gray-800">
                <nav className="space-y-4">
                    <button
                        onClick={() => setSelectedTab("list")}
                        className={`block py-2 px-4 rounded-md transition border border-gray-700 bg-gray-800 text-white hover:bg-gray-700 ${selectedTab === "list" ? "bg-gray-700" : ""
                            }`}
                    >
                        主辦列表
                    </button>
                    <button
                        onClick={() => setSelectedTab("add")}
                        className={`block py-2 px-4 rounded-md transition border border-gray-700 bg-gray-800 text-white hover:bg-gray-700 ${selectedTab === "add" ? "bg-gray-700" : ""
                            }`}
                    >
                        新增主辦
                    </button>
                </nav>
            </aside>

            {/* 主內容 */}
            <div className="flex-grow h-96 bg-gray-900 h-full p-6 border border-gray-700 bg-gray-800">

                {renderContent()}
            </div>
        </div>
    );
}

export default AdminHosts;
