import React, { useState, useEffect } from "react";
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from "react-router-dom";

function TrafficRequest() {
    const [requests, setRequests] = useState(() => {
        const savedRequests = sessionStorage.getItem('trafficRequests');
        return savedRequests ? JSON.parse(savedRequests) : [];
    });    
    const navigate = useNavigate();

    useEffect(() => {
        const ws = new WebSocket('ws://localhost/ws/request');

        ws.onopen = () => {
            console.log('連接成功');
        };

        ws.onmessage = (event) => {
            try {
                const newRequest = JSON.parse(event.data);
                setRequests(prev => {
                    const updatedRequests = [newRequest, ...prev].slice(0, 100);
                    sessionStorage.setItem('trafficRequests', JSON.stringify(updatedRequests));
                    return updatedRequests;
                });
            } catch (error) {
                console.error('連接失敗:', error);
            }
        };
        ws.onclose = () => {
            console.log("websock關閉");
        };

        return () => {
            if (ws.readyState === WebSocket.OPEN) {
                ws.close();
            }
        };
    }, []);
    console.log("請求是:",requests)

    return (
        <div className="min-h-screen bg-gray-900 px-4 py-6">
            <header className="max-w-7xl mx-auto mb-6">
                <div className="flex items-center gap-3 mb-6">
                    <button 
                        onClick={() => navigate('/admin/traffic')}
                        className="text-teal-500 hover:text-teal-400"
                    >
                        <ArrowLeft className="w-8 h-8" />
                    </button>
                    <h1 className="text-2xl font-bold text-white">即時請求監控</h1>
                </div>
            </header>

            <main className="max-w-7xl mx-auto">
                <div className="bg-gray-800 rounded-lg p-6">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="text-gray-400 text-sm">
                                <tr>
                                    <th className="text-left p-2">時間</th>
                                    <th className="text-left p-2">用戶</th>
                                    <th className="text-left p-2">請求方式</th>
                                    <th className="text-left p-2">API路徑</th>
                                    <th className="text-left p-2">IP</th>
                                    <th className="text-left p-2">執行時間</th>
                                    <th className="text-left p-2">設備</th>
                                    <th className="text-left p-2">狀態</th>
                                    <th className="text-left p-2">錯誤</th>
                                </tr>
                            </thead>
                            <tbody className="text-white">
                                {requests.map((request) => (
                                    <tr key={request.requestId} className="border-t border-gray-700 hover:bg-gray-700/50">
                                        <td className="p-2">
                                            {new Date(request.timestamp).toLocaleTimeString()}
                                        </td>
                                        <td className="p-2">{request.userName}</td>
                                        <td className="p-2">
                                            <span className={`px-2 py-1 rounded text-xs ${
                                                getMethodColor(request.requestMethod)
                                            }`}>
                                                {request.requestMethod}
                                            </span>
                                        </td>
                                        <td className="p-2">{request.requestUrl}</td>
                                        <td className="p-2">{request.ipAddress}</td>
                                        <td className="p-2">
                                            {request.executionTime}ms
                                        </td>
                                        <td className="p-2">
                                            <span className="text-xs bg-gray-700 px-2 py-1 rounded">
                                                {request.deviceType}
                                            </span>
                                        </td>
                                        <td className={`p-2 ${request.success ? 'text-green-500' : 'text-red-500'}`}>
                                            {request.success ? '成功' : '失敗'}
                                            {request.errorMessage && 
                                                <span className="text-xs ml-1">({request.errorMessage})</span>
                                            }
                                        </td>
                                        <td className="p-2">{request.errorMessage}</td>

                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </div>
    );
}

// 輔助函數：根據請求方法返回不同的顏色
function getMethodColor(method) {
    switch (method?.toUpperCase()) {
        case 'GET':
            return 'bg-blue-500/20 text-blue-400';
        case 'POST':
            return 'bg-green-500/20 text-green-400';
        case 'PUT':
            return 'bg-yellow-500/20 text-yellow-400';
        case 'DELETE':
            return 'bg-red-500/20 text-red-400';
        default:
            return 'bg-gray-500/20 text-gray-400';
    }
}

export default TrafficRequest;