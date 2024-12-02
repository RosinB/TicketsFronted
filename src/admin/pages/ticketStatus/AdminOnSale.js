import { useEffect, useState } from "react";
import ApiService from "../../../api/ApiService";
import LoadingSpinner from "../../../components/modal/LoadingSpinner";
import { useNavigate } from "react-router-dom";
import { Calendar, Clock, Tag, Search } from "lucide-react";

function AdminOnSale() {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeStatus, setActiveStatus] = useState('all'); // 新增狀態過濾
    const navigate = useNavigate();
    const [currentTime, setCurrentTime] = useState(new Date());

    const fetchOnSale = async () => {
        try {
            const response = await ApiService.fetchOnSaleEvent();
            setEvents(response.data.data);
        } catch (error) {
            console.log("抓取資料錯誤", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOnSale();
        // 更新時間
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const handleRealTimeQuery = (eventId) => {
        navigate(`/admin/status/realtime/${eventId}`);
    };

    // 根據銷售狀態過濾事件
    const getFilteredEvents = () => {
        if (activeStatus === 'all') return events;
        return events.filter(event => event.salesStatus === activeStatus);
    };

    // 獲取每個狀態的數量
    const getStatusCounts = () => ({
        all: events.length,
        '開賣中': events.filter(event => event.salesStatus === '開賣中').length,
        '已完售': events.filter(event => event.salesStatus === '已完售').length,
        '未開賣': events.filter(event => event.salesStatus === '未開賣').length
    });

    const statusCounts = getStatusCounts();
    const filteredEvents = getFilteredEvents();

    if (loading) return <LoadingSpinner />;

    // 狀態標籤顏色映射
    const statusColors = {
        '開賣中': 'text-green-400',
        '已完售': 'text-red-400',
        '未開賣': 'text-yellow-400'
    };
    const formatTime = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');

        return `${year}/${month}/${day} ${hours}:${minutes}:${seconds}`;
    };

    return (
        <div className=" rounded-lg shadow-lg p-6">
            {/* <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                    <Tag className="w-6 h-6" />
                    演唱會售票資訊
                </h1>
            </div> */}

            {/* 狀態過濾器 */}
            <div className="flex gap-4 mb-6 -mt-6">
                {[
                    { id: 'all', label: '全部活動' },
                    { id: '開賣中', label: '開賣中' },
                    { id: '已完售', label: '已完售' },
                    { id: '未開賣', label: '未開賣' }
                ].map(status => (
                    <button
                        key={status.id}
                        onClick={() => setActiveStatus(status.id)}
                        className={`px-4 py-2 rounded-lg transition-all duration-200 ${activeStatus === status.id
                            ? 'bg-teal-500 text-white'
                            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                            }`}
                    >
                        {status.label} ({statusCounts[status.id]})
                    </button>
                ))}
                <div className="flex items-center gap-2 px-4 py-2 rounded-lg text-gray-200">
                    <Clock className="w-4 h-4 text-teal-500" />
                    <span className="font-medium">{formatTime(currentTime)}</span>
                </div>
            </div>

            <div className="overflow-x-auto text-white rounded-lg border border-gray-700">
                <table className="w-full">
                    <thead className="bg-gray-800">
                        <tr>
                            <th className="px-6 py-3 text-left">
                                <div className="flex items-center gap-2">
                                    <Tag className="w-4 h-4" />
                                    活動名稱
                                </div>
                            </th>
                            <th className="px-6 py-3 text-left">
                                <div className="flex items-center gap-2">
                                    <Calendar className="w-4 h-4" />
                                    售票日期
                                </div>
                            </th>
                            <th className="px-6 py-3 text-left">
                                <div className="flex items-center gap-2">
                                    <Clock className="w-4 h-4" />
                                    售票時間
                                </div>
                            </th>
                            <th className="px-6 py-3 text-left">銷售狀態</th>
                            <th className="px-6 py-3 text-left">操作</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700">
                        {filteredEvents.length > 0 ? (
                            filteredEvents.map((event) => (
                                <tr key={event.eventId} className="hover:bg-gray-700/50 transition-colors">
                                    <td className="px-6 py-4">{event.eventName}</td>
                                    <td className="px-6 py-4 text-white">{event.eventSalesDate}</td>
                                    <td className="px-6 py-4 text-white">{event.eventSalesTime}</td>
                                    <td className={`px-6 py-4 ${statusColors[event.salesStatus]}`}>
                                        {event.salesStatus}
                                    </td>
                                    <td className="px-6 py-4">
                                        <button
                                            onClick={() => handleRealTimeQuery(event.eventId)}
                                            className="flex items-center gap-2 bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-lg transition-colors"
                                        >
                                            <Search className="w-4 h-4" />
                                            查詢票務
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="px-6 py-4 text-center text-gray-400">
                                    無活動數據
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default AdminOnSale;