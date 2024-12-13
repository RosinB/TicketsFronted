import React, { useState, useEffect } from "react";
import { LineChart, Users, AlertTriangle, Activity } from 'lucide-react';
import LoadingSpinner from "../../components/modal/LoadingSpinner";
import { useNavigate } from "react-router-dom";

function AdminTraffic() {
    const [loading, setLoading] = useState(true);
    const [realTimeStats, setRealTimeStats] = useState({
        totalTraffic: 0,
        qps: 0
    });
    const navigate = useNavigate();

    // 其他非即時數據
    const mockStats = {
        suspiciousUsers: 5,
        activeUsers: 1234
    };

    useEffect(() => {
        const ws = new WebSocket('ws://localhost/ws/traffic');

        ws.onopen = () => {
            console.log('WebSocket Connected');
            setLoading(false);
        };

        ws.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                if (data.type === 'trafficStats') {
                    setRealTimeStats({
                        totalTraffic: data.totalTraffic,
                        qps: data.qps
                    });
                }
            } catch (error) {
                console.error('Failed to parse WebSocket message:', error);
            }
        };

        ws.onerror = (error) => {
            console.error('WebSocket Error:', error);
        };

        ws.onclose = () => {
            console.log('WebSocket Disconnected');
        };

        // 清理函數
        return () => {
            if (ws.readyState === WebSocket.OPEN) {
                ws.close();
            }
        };
    }, []);

    const mockEventTraffic = [
        {
            eventId: "Event-001",
            totalRequests: 1234,
            suspiciousRequests: 12,
            normalRequests: 1222
        },
        {
            eventId: "Event-002",
            totalRequests: 2345,
            suspiciousRequests: 45,
            normalRequests: 2300
        }
    ];

    const mockSuspiciousUsers = [
        {
            userName: "user123",
            lastIp: "192.168.1.1",
            reason: "多IP訪問",
            requestCount: 150,
            lastDetected: "2024-12-10 15:30"
        },
        {
            userName: "user456",
            lastIp: "192.168.1.2",
            reason: "高頻訪問",
            requestCount: 220,
            lastDetected: "2024-12-10 15:45"
        }
    ];

    const handleViewDetails = (eventId) => {
        navigate(`/admin/traffic/record/${eventId}`);
    };
    const handleViewActiveUsers = () => {
        navigate('/admin/traffic/requests');
    };
    if (loading) return <LoadingSpinner />;

    // 合併即時數據和模擬數據
    const combinedStats = {
        ...mockStats,
        totalTraffic: realTimeStats.totalTraffic,
        qps: realTimeStats.qps
    };

    return (
        <div className="min-h-screen bg-gray-900 px-4 py-6">
            <header className="max-w-7xl mx-auto mb-6">
                <div className="flex items-center gap-3 mb-6">
                    <Activity className="w-8 h-8 text-teal-500" />
                    <h1 className="text-2xl font-bold text-white">流量監控中心</h1>
                </div>
            </header>

            <main className="max-w-7xl mx-auto space-y-6">
                <StatsCards stats={combinedStats}                     
                            onViewActiveUsers={handleViewActiveUsers}
                />
                <SuspiciousUserList users={mockSuspiciousUsers} />
                <EventTrafficList events={mockEventTraffic} onViewDetails={handleViewDetails} />
            </main>
        </div>
    );
}
const StatsCards = ({ stats, onViewActiveUsers }) => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
            title="當前 QPS"
            value={stats.qps}
            icon={<Activity className="w-8 h-8" />}
        />
        <StatCard
            title="可疑用戶數"
            value={stats.suspiciousUsers}
            textColor="text-red-500"
            icon={<AlertTriangle className="w-8 h-8" />}
        />
        <StatCard
            title="即時請求監控"
            titleSize="text-lg"
            icon={<Users className="w-12 h-12 text-blue-400" />}
            isClickable={true}
            onClick={onViewActiveUsers}
            customContent={
                <div className="mt-2 text-gray-400 text-sm">
                    點擊查看即時請求記錄
                </div>
            }
        />
        <StatCard
            title="今日總請求數"
            value={stats.totalTraffic}
            textColor="text-green-500"
            icon={<LineChart className="w-8 h-8" />}
        />
    </div>
);

// 修改 StatCard 組件使其可點擊
const StatCard = ({ 
    title, 
    value, 
    textColor = "text-white", 
    icon, 
    onClick, 
    isClickable,
    titleSize = "text-sm",
    customContent 
}) => (
    <div 
        className={`bg-gray-800 p-6 rounded-lg ${
            isClickable ? 
            'cursor-pointer hover:bg-gray-700 hover:shadow-lg transform hover:-translate-y-1 transition-all duration-200' 
            : ''
        }`}
        onClick={onClick}
    >
        <div className="flex items-center justify-between mb-3">
            <h3 className={`text-gray-200 ${titleSize} font-medium`}>{title}</h3>
            <span className="text-gray-400">{icon}</span>
        </div>
        {customContent ? (
            customContent
        ) : (
            <p className={`text-2xl font-bold ${textColor} transition-all duration-300`}>
                {typeof value === 'number' ? value.toLocaleString() : value}
            </p>
        )}
    </div>
);
const SuspiciousUserList = ({ users }) => (
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
                    {users.map((user) => (
                        <tr key={user.userName} className="border-t border-gray-700">
                            <td className="p-2">{user.userName}</td>
                            <td className="p-2">{user.lastIp}</td>
                            <td className="p-2">{user.reason}</td>
                            <td className="p-2">{user.requestCount}</td>
                            <td className="p-2">{user.lastDetected}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
);

const EventTrafficList = ({ events, onViewDetails }) => (
    <div className="bg-gray-800 rounded-lg p-6">
        <h2 className="text-white text-lg font-semibold mb-4">活動流量統計</h2>
        <div className="overflow-x-auto">
            <table className="w-full">
                <thead className="text-gray-400 text-sm">
                    <tr>
                        <th className="text-left p-2">活動ID</th>
                        <th className="text-left p-2">總請求數</th>
                        <th className="text-left p-2">可疑請求數</th>
                        <th className="text-left p-2">正常請求數</th>
                        <th className="text-left p-2">操作</th>
                    </tr>
                </thead>
                <tbody className="text-white">
                    {events.map((event) => (
                        <tr key={event.eventId} className="border-t border-gray-700">
                            <td className="p-2">{event.eventId}</td>
                            <td className="p-2">{event.totalRequests}</td>
                            <td className="p-2 text-red-500">{event.suspiciousRequests}</td>
                            <td className="p-2 text-green-500">{event.normalRequests}</td>
                            <td className="p-2">
                                <button
                                    onClick={() => onViewDetails(event.eventId)}
                                    className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                                >
                                    詳細記錄
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
);

export default AdminTraffic;