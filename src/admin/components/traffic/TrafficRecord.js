import { useParams } from "react-router-dom";
import ApiService from "../../../api/ApiService";
import LoadingSpinner from "../../../components/modal/LoadingSpinner";
import { useState, useEffect } from "react";
import React from 'react';  // 添加這行

function TrafficRecord() {
    const [trafficData, setTrafficData] = useState([]);
    const [expandedRows, setExpandedRows] = useState({});
    const { eventId } = useParams();
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(0);
    const pageSize = 10;

    useEffect(() => {
        const start = currentPage * pageSize;
        const end = start + pageSize - 1;
        fetchTrafficData(eventId, start, end);
    }, [eventId, currentPage]);

    const fetchTrafficData = async (eventId, start, end) => {
        try {
            setLoading(true);
            const response = await ApiService.fetchTrafficAllRecord(eventId, start, end);
            setTrafficData(response.data.data);
            console.log("當前頁數據:", response.data.data);
        } catch (error) {
            console.error("獲取數據失敗:", error);
            alert("獲取數據失敗");
        } finally {
            setLoading(false);
        }
    };

    const toggleRow = (index) => {
        setExpandedRows(prev => ({
            ...prev,
            [index]: !prev[index]
        }));
    };

    // 檢查是否有下一頁
    const hasNextPage = trafficData && trafficData.length === pageSize;

    // 計算當前頁顯示範圍
    const currentStartIndex = currentPage * pageSize + 1;
    const currentEndIndex = currentStartIndex + (trafficData?.length || 0) - 1;

    if(loading) return <LoadingSpinner/>;
 
    return (
        <div className="min-h-screen bg-gray-900 px-4 py-6">
            <div className="max-w-7xl mx-auto">
                <div className="bg-gray-800 rounded-lg overflow-hidden">
                    <table className="w-full">
                        <thead className="text-gray-400 text-sm">
                            <tr>
                                <th className="text-left p-2">用戶名</th>
                                <th className="text-left p-2">時間</th>
                                <th className="text-left p-2">請求URL</th>
                                <th className="text-left p-2">執行時間</th>
                                <th className="text-left p-2">狀態</th>
                                <th className="text-left p-2">操作</th>
                            </tr>
                        </thead>
                        <tbody className="text-white">
                            {trafficData && trafficData.map((record, index) => (
                                <React.Fragment key={index}>
                                    <tr className="border-t border-gray-700 hover:bg-gray-700/50">
                                        <td className="p-2">{record.userName}</td>
                                        <td className="p-2">{new Date(record.timestamp).toLocaleString()}</td>
                                        <td className="p-2">{record.requestUrl}</td>
                                        <td className="p-2"> {record.executionTime}ms</td>

                                        <td className="p-2">
                                            <span className={`px-2 py-1 rounded-full text-sm ${
                                                record.success ? "bg-green-500/20 text-green-500" : "bg-red-500/20 text-red-500"
                                            }`}>
                                                {record.success ? "成功" : "失敗"}
                                            </span>
                                        </td>
                                        <td className="p-2">
                                            <button 
                                                onClick={() => toggleRow(index)}
                                                className="px-3 py-1 text-sm bg-blue-500/20 text-blue-500 rounded-full hover:bg-blue-500/30"
                                            >
                                                {expandedRows[index] ? '收起' : '詳情'}
                                            </button>
                                        </td>
                                    </tr>
                                    {expandedRows[index] && (
                                        <tr className="bg-gray-800/50">
                                            <td colSpan="6">
                                                <div className="p-4 grid grid-cols-3 gap-4 text-sm">
                                                    <div className="space-y-2">
                                                        <h3 className="font-semibold text-gray-400">請求詳情</h3>
                                                        <p>IP位址: {record.ip}</p>
                                                        <p>請求類型: {record.requestType}</p>
                                                        <p>請求方法: {record.requestMethod}</p>
                                                        <p>來源頁面: {record.referrer}</p>
                                                    </div>
                                                    <div className="space-y-2">
                                                        <h3 className="font-semibold text-gray-400">設備資訊</h3>
                                                        <p>設備類型: {record.deviceType}</p>
                                                        <p>用戶代理: {record.userAgent}</p>
                                                        <p>會話ID: {record.sessionId}</p>
                                                    </div>
                                                    <div className="space-y-2">
                                                        <h3 className="font-semibold text-gray-400">風險控制</h3>
                                                        <p>代理IP: <span className={record.isProxy ? "text-red-500" : "text-green-500"}>
                                                            {record.isProxy ? "是" : "否"}
                                                        </span></p>
                                                        <p>機器人: <span className={record.isRobot ? "text-red-500" : "text-green-500"}>
                                                            {record.isRobot ? "是" : "否"}
                                                        </span></p>
                                                        <p>請求頻率: {record.requestFrequency}</p>
                                                    </div>
                                                    {record.eventId && (
                                                        <div className="space-y-2">
                                                            <h3 className="font-semibold text-gray-400">票務資訊</h3>
                                                            <p>活動ID: {record.eventId}</p>
                                                            <p>票種: {record.ticketType}</p>
                                                            <p>票數: {record.ticketQuantity}</p>
                                                            <p>價格: {record.price}</p>
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </React.Fragment>
                            ))}
                        </tbody>
                    </table>

                    {/* 分頁控制 */}
                    <div className="flex justify-between items-center p-4 border-t border-gray-700">
                        <div className="text-gray-400">
                            顯示第 {currentStartIndex} - {currentEndIndex} 筆
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setCurrentPage(p => p - 1)}
                                disabled={currentPage === 0}
                                className="px-4 py-2 bg-gray-700 text-white rounded disabled:opacity-50"
                            >
                                上一頁
                            </button>
                            <div className="flex items-center px-4 text-white">
                                第 {currentPage + 1} 頁
                            </div>
                            <button
                                onClick={() => setCurrentPage(p => p + 1)}
                                disabled={!hasNextPage}
                                className="px-4 py-2 bg-gray-700 text-white rounded disabled:opacity-50"
                            >
                                下一頁
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default TrafficRecord;