import React, { useState, useEffect } from "react";
import { LineChart } from 'lucide-react';
import LoadingSpinner from "../../components/modal/LoadingSpinner";
import { useNavigate } from "react-router-dom";

function AdminTraffic() {
    const [loading, setLoading] = useState(true);
    const navigate=useNavigate();
    useEffect(() => {
        // 獲取數據的邏輯
        setLoading(false);
    }, []);

    if (loading) return <LoadingSpinner />;


    const handleViewDetails = (eventId) => {
        navigate(`/admin/traffic/record/${eventId}`);
    };



    return (
        <div className="min-h-screen bg-gray-900 px-4 py-6">
            {/* 頭部標題 */}
            <header className="max-w-7xl mx-auto mb-6">
                <div className="flex items-center gap-3 mb-6">
                    <LineChart className="w-8 h-8 text-teal-500" />
                    <h1 className="text-2xl font-bold text-white">流量監控中心</h1>
                </div>
            </header>
 
            {/* 主要內容 */}
            <main className="max-w-7xl mx-auto space-y-6">
                {/* 統計卡片區 */}
                <StatsCards />
 
                {/* 可疑用戶列表 */}
                <SuspiciousUserList />
 
                {/* 活動流量統計 */}
                <div className="bg-gray-800 rounded-lg p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-white text-lg font-semibold">活動流量統計</h2>
                       
                    </div>
 
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="text-gray-400 text-sm">
                                <tr>
                                    <th className="text-left p-2">活動ID</th>
                                    <th className="text-left p-2">請求數</th>
                                    <th className="text-left p-2">可疑請求數</th>
                                    <th className="text-left p-2">正常請求數</th>
                                </tr>
                            </thead>
                            <tbody className="text-white">
                                <tr className="border-t border-gray-700">
                                    <td className="p-2">Event-001</td>
                                    <td className="p-2">1,234</td>
                                    <td className="p-2 text-red-500">12</td>
                                    <td className="p-2 text-green-500">1,222</td>
                                    <button
                            onClick={() => handleViewDetails(1)}
                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                        >
                            查詢詳細請求
                        </button>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </div>
    );
 }
 
 // 統計卡片組件
 const StatsCards = () => (
    <div className="grid grid-cols-4 gap-4">
        <StatCard title="當前 QPS" value="123" />
        <StatCard title="可疑用戶數" value="5" textColor="text-red-500" />
        <StatCard title="活躍用戶數" value="1,234" textColor="text-blue-500" />
        <StatCard title="總請求數" value="45,678" textColor="text-green-500" />
    </div>
 );
 
 // 單個統計卡片
 const StatCard = ({ title, value, textColor = "text-white" }) => (
    <div className="bg-gray-800 p-4 rounded-lg">
        <h3 className="text-gray-400 text-sm">{title}</h3>
        <p className={`text-2xl font-bold ${textColor}`}>{value}</p>
    </div>
 );
 
 // 可疑用戶列表組件
 const SuspiciousUserList = () => (
    <div className="bg-gray-800 rounded-lg p-6">
        <h2 className="text-white text-lg font-semibold mb-4">可疑用戶列表</h2>
        <div className="overflow-x-auto">
            <table className="w-full">
                <thead className="text-gray-400 text-sm">
                    <tr>
                        <th className="text-left p-2">用戶名</th>
                        <th className="text-left p-2">最後IP</th>
                        <th className="text-left p-2">可疑原因</th>
                        <th className="text-left p-2">請求次數</th>
                        <th className="text-left p-2">最後活動時間</th>
                    </tr>
                </thead>
                <tbody className="text-white">
                    <tr className="border-t border-gray-700">
                        <td className="p-2">user123</td>
                        <td className="p-2">192.168.1.1</td>
                        <td className="p-2">多IP訪問</td>
                        <td className="p-2">150</td>
                        <td className="p-2">2024-12-10 15:30</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
 );

export default AdminTraffic;