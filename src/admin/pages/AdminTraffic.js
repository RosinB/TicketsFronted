import React, { useState, useEffect } from "react";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from 'recharts';
import { Users, Activity, LineChart as LineChartIcon } from 'lucide-react';
import LoadingSpinner from "../../components/modal/LoadingSpinner";
import { useNavigate } from "react-router-dom";
import ApiService from "../../api/ApiService";

function AdminTraffic() {
    const [loading, setLoading] = useState(true);
    const [realTimeStats, setRealTimeStats] = useState({
        totalTraffic: 0,
        qps: 0
    });
    const [blockUser, setBlockUser] = useState("")
    const [userName, setUserName] = useState("");
    const [wsStatus, setWsStatus] = useState('connecting');
    const [realtimeQPS, setRealtimeQPS] = useState([]);

    const navigate = useNavigate();



    // 生成即時 QPS 數據
    useEffect(() => {
        const generateRealtimeData = () => {
            const now = new Date();
            const newData = {
                time: now.toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
                value: realTimeStats.qps
            };

            setRealtimeQPS(prev => {
                const updatedData = [...prev, newData];
                if (updatedData.length > 30) updatedData.shift();
                return updatedData;
            });
        };

        const interval = setInterval(generateRealtimeData, 1000);
        return () => clearInterval(interval);
    }, [realTimeStats.qps]);

    const fetchBlockUser = async () => {

        try {
            const response = await ApiService.getBlockUser();
            setBlockUser(response.data.data);
            console.log("被封鎖的:" + response.data.data);


        } catch (error) {
            console.log(error);
        }


    }

    useEffect(() => {
        fetchBlockUser();

        const ws = new WebSocket('ws://localhost/ws/traffic');

        ws.onopen = () => {
            console.log('WebSocket Connected');
            setLoading(false);
            setWsStatus('connected');

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
            setWsStatus('error');

        };

        ws.onclose = () => {
            console.log('WebSocket Disconnected');
            setWsStatus('closed');

        };

        // 清理函數
        return () => {
            if (ws.readyState === WebSocket.OPEN) {
                ws.close();
            }
        };
    }, []);




    const handleViewActiveUsers = () => {
        navigate('/admin/traffic/requests');
    };
    if (loading) return <LoadingSpinner />;


    // 合併即時數據和模擬數據
    const combinedStats = {
        totalTraffic: realTimeStats.totalTraffic,
        qps: realTimeStats.qps
    };

    const handleSendName = async () => {
        try {
            await ApiService.unBlockUser(userName);
            alert("解封成功");
            // 重新獲取被封鎖用戶列表
            fetchBlockUser();
            // 清空輸入框
            setUserName("");
        } catch (error) {
            console.error("解封失敗:", error);
            alert("解封失敗，請稍後再試");
        }
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
                {/* 即時 QPS 圖表 */}
                <div className="bg-gray-800 p-6 rounded-lg">
                    <h2 className="text-xl font-bold text-white mb-4">即時 QPS 變化</h2>
                    <div className="h-[200px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={realtimeQPS}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                                <XAxis dataKey="time" stroke="#9CA3AF" />
                                <YAxis stroke="#9CA3AF" />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: '#1F2937',
                                        border: 'none',
                                        borderRadius: '0.5rem',
                                        color: '#fff'
                                    }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="value"
                                    stroke="#10B981"
                                    dot={false}
                                    strokeWidth={2}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
                

                {/* 手動輸入解封區域 */}
                <div className="bg-gray-800 p-6 rounded-lg">
                    <h2 className="text-xl font-bold text-white mb-4">手動解封用戶</h2>
                    <div className="flex gap-2 items-center">
                        <input
                            type="text"
                            value={userName}
                            onChange={(e) => setUserName(e.target.value)}
                            className="w-1/3 p-2 text-sm bg-gray-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
                            placeholder="輸入用戶名"
                        />
                        <button
                            onClick={handleSendName}
                            className="px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
                        >
                            解封
                        </button>
                    </div>
                </div>
                {/* 被封鎖用戶列表 */}
                <div className="bg-gray-800 p-6 rounded-lg">
                    <h2 className="text-xl font-bold text-white mb-4">被封鎖用戶列表</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {Array.isArray(blockUser) && blockUser.map((user, index) => (
                            <div key={index} className="bg-gray-700 p-4 rounded-lg flex justify-between items-center">
                                <span className="text-white">{user}</span>
                                {/* <button
                                    onClick={() => {
                                        setUserName(user);
                                        handleSendName();
                                    }}
                                    className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors"
                                >
                                    解封
                                </button> */}
                            </div>
                        ))}
                    </div>
                </div>
            </main>
            <div className="fixed bottom-4 right-4 bg-gray-800 px-4 py-2 rounded-full shadow-lg">
                <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${wsStatus === 'connected'
                        ? 'animate-pulse bg-green-500'
                        : wsStatus === 'connecting'
                            ? 'animate-pulse bg-yellow-500'
                            : 'bg-red-500'
                        }`} />
                    <span className="text-sm text-white">
                        {wsStatus === 'connected'
                            ? ' 已連接'
                            : wsStatus === 'connecting'
                                ? '連接中...'
                                : ' 已斷開'}
                    </span>
                </div>
            </div>
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
            title="今日總請求數"
            value={stats.totalTraffic}
            textColor="text-green-500"
            icon={<LineChartIcon className="w-8 h-8" />} 
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
        className={`bg-gray-800 p-6 rounded-lg ${isClickable ?
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




export default AdminTraffic;