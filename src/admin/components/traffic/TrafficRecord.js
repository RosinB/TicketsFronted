import { useParams } from "react-router-dom";
import ApiService from "../../../api/ApiService";
import { useState } from "react";
import { useEffect } from "react";
import LoadingSpinner from "../../../components/modal/LoadingSpinner";


function TrafficRecord() {
    const [trafficData, setTrafficData] = useState(null);
    const { eventId } = useParams();
    const [loading,setLoading]=useState(true);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalRecords, setTotalRecords] = useState(0);
    const pageSize = 10; // 每頁顯示10條記錄

    useEffect(() => {
        const start = currentPage * pageSize;
        const end = start + pageSize - 1;
        fetchTrafficData(eventId, start, end);
    }, [eventId, currentPage]);
    
    const totalPages = Math.ceil(totalRecords / pageSize);

    const fetchTrafficData = async (eventId, start, end) => {
        try {
            setLoading(true);
            console.log("獲取數據 - eventId:", eventId, "start:", start, "end:", end);
            const response = await ApiService.fetchTrafficAllRecord(eventId, start, end);
            setTrafficData(response.data.data);
            setTotalRecords(response.data.data.length); // 假設後端返回總記錄數
        } catch (error) {
            console.error("獲取數據失敗:", error);
            alert("獲取數據失敗");
        } finally {
            setLoading(false);
        }
    };


    if(loading) <LoadingSpinner/>
 
    return (
        <div className="min-h-screen bg-gray-900 px-4 py-6">
            <div className="max-w-7xl mx-auto">
                {/* 數據表格 */}
                <div className="bg-gray-800 rounded-lg overflow-hidden">
                    {loading ? (
                        <div className="text-center p-4 text-white">載入中...</div>
                    ) : (
                        <>
                            <table className="w-full">
                                <thead className="text-gray-400 text-sm">
                                    <tr>
                                        <th className="text-left p-2">活動ID</th>
                                        <th className="text-left p-2">用戶名</th>
                                        <th className="text-left p-2">請求類型</th>
                                        <th className="text-left p-2">設備類型</th>
                                        <th className="text-left p-2">時間</th>
                                        <th className="text-left p-2">IP</th>
                                        <th className="text-left p-2">狀態</th>
                                    </tr>
                                </thead>
                                {trafficData && trafficData.length > 0 ? (
                                    <tbody className="text-white">
                                        {trafficData.map((record, index) => (
                                            <tr key={index} className="border-t border-gray-700">
                                                <td className="p-2">{record.eventId}</td>
                                                <td className="p-2">{record.userName}</td>
                                                <td className="p-2">{record.requestType}</td>
                                                <td className="p-2">{record.deviceType}</td>
                                                <td className="p-2">
                                                    {new Date(record.timestamp).toLocaleString()}
                                                </td>
                                                <td className="p-2">{record.ip}</td>
                                                <td className="p-2">
                                                    <span className={`px-2 py-1 rounded-full text-sm ${
                                                        record.isProxy || record.isRobot 
                                                            ? "bg-red-500/20 text-red-500" 
                                                            : "bg-green-500/20 text-green-500"
                                                    }`}>
                                                        {record.isProxy || record.isRobot ? "可疑" : "正常"}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                ) : (
                                    <tbody>
                                        <tr>
                                            <td colSpan="7" className="text-center text-gray-500 p-4">
                                                無數據
                                            </td>
                                        </tr>
                                    </tbody>
                                )}
                            </table>

                            {/* 分頁控制 */}
                            <div className="flex justify-between items-center p-4 border-t border-gray-700">
                                <div className="text-gray-400">
                                    顯示第 {currentPage * pageSize + 1} - {Math.min((currentPage + 1) * pageSize, totalRecords)} 筆，共 {totalRecords} 筆
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setCurrentPage(p => Math.max(0, p - 1))}
                                        disabled={currentPage === 0}
                                        className="px-4 py-2 bg-gray-700 text-white rounded disabled:opacity-50"
                                    >
                                        上一頁
                                    </button>
                                    <div className="flex items-center px-4 text-white">
                                        第 {currentPage + 1} / {totalPages} 頁
                                    </div>
                                    <button
                                        onClick={() => setCurrentPage(p => p + 1)}
                                        disabled={currentPage >= totalPages - 1}
                                        className="px-4 py-2 bg-gray-700 text-white rounded disabled:opacity-50"
                                    >
                                        下一頁
                                    </button>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
 }


export default TrafficRecord;