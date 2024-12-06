import React, { useState } from "react";
import { Users, UserPlus, Building } from "lucide-react";
import HostList from "../components/host/HostList";
import HostAdd from "../components/host/HostAdd";

function AdminHosts() {
    const [selectedTab, setSelectedTab] = useState("list");

    const tabs = [
        {
            id: "list",
            label: "主辦列表",
            icon: <Users className="w-5 h-5" />,
            component: <HostList />
        },
        {
            id: "add",
            label: "新增主辦",
            icon: <UserPlus className="w-5 h-5" />,
            component: <HostAdd />
        }
    ];

    return (
        <div className="min-h-screen bg-gray-900 px-4 py-6">
            {/* Header */}
            <header className="max-w-7xl mx-auto mb-6">
                <div className="flex items-center gap-3 mb-6">
                    <Building className="w-8 h-8 text-teal-500" />
                    <h1 className="text-2xl font-bold text-white">主辦方管理</h1>
                </div>

                {/* Navigation Tabs */}
                <div className="border-b border-gray-700">
                    <nav className="flex   space-x-4" aria-label="Tabs">
                        {tabs.map((tab, index) => (
                            <button
                                key={index}
                                onClick={() => setSelectedTab(tab.id)}
                                className={`
                                    ${selectedTab === tab.id
                                        ? 'border-teal-500 text-white'
                                        : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'
                                    }
                                    px-4 py-4 text-sm font-medium border-b-2
                                    flex items-center gap-2 transition-colors duration-200
                                `}
                            >
                                {tab.icon}
                                <span>{tab.label}</span>
                            </button>
                        ))}
                    </nav>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto">
                <div className=" rounded-lg p-6">
                    <div className="transition-all duration-200 ease-in-out">
                        {tabs.find(tab => tab.id === selectedTab)?.component}
                    </div>
                </div>
            </main>
        </div>
    );
}

export default AdminHosts;