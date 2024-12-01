import { useEffect, useState } from "react";
import {
    Music2,
    Calendar,
    Clock,
    MapPin,
    User,
    DollarSign,
    Ticket,
    Building,
    ChevronDown,
    ChevronUp,
    AlertTriangle,
    FileText,
    Search,
    SlidersHorizontal
} from "lucide-react";
import ApiService from "../api/ApiService";
import LoadingSpinner from "../components/modal/LoadingSpinner";

function UserOrder() {
    const userName = localStorage.getItem("userName");
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedOrderId, setExpandedOrderId] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState("all");


    useEffect(() => {
        
    const fetchOrder = async () => {
        try {
            const response = await ApiService.fetchUserOrder(userName);
            setOrders(response.data.data);
        } catch (error) {
            console.log("訂單查詢失敗");
        } finally {
            setLoading(false);
        }
    };
        fetchOrder();
    }, [userName]);

    if (loading) {
        return <LoadingSpinner />;
    }

    const toggleExpand = (orderId) => {
        setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
    };

 

    const getStatusColor = (status) => {
        switch (status) {
            case 'COMPLETED':
                return 'text-green-600';
            case 'PENDING':
                return 'text-yellow-600';
            case 'CANCELLED':
                return 'text-red-600';
            default:
                return 'text-gray-600';
        }
    };

    const filteredOrders = orders.filter(order => {
        const matchesSearch = order.eventName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.orderId.toString().includes(searchTerm) ||
            order.eventPerformer.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = filterStatus === 'all' || order.orderStatus === filterStatus;

        return matchesSearch && matchesStatus;
    });

    return (
        <div className="bg-gray-50 min-h-screen p-6 -mt-8">
            <div className="max-w-4xl mx-auto">
                {/* 頁面標題 */}
                <div className="flex items-center gap-2 mb-8">
                    <FileText className="w-8 h-8 text-blue-600" />
                    <h1 className="text-2xl font-bold text-gray-800">
                        我的訂單紀錄
                    </h1>
                </div>

                {/* 搜尋和篩選區 */}
                <div className="bg-white p-4 rounded-lg shadow-sm mb-6 flex flex-wrap gap-4 items-center">
                    <div className="flex-1 min-w-[200px]">
                        <div className="relative">
                            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                            <input
                                type="text"
                                placeholder="搜尋演唱會名稱、訂單編號..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                            />
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <SlidersHorizontal className="w-5 h-5 text-gray-500" />
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                        >
                            <option value="all">全部訂單</option>
                            <option value="COMPLETED">已完成</option>
                            <option value="PENDING">待付款</option>
                            <option value="CANCELLED">已取消</option>
                        </select>
                    </div>
                </div>

                {/* 訂單列表 */}
                <div className="space-y-4">
                    {filteredOrders.length === 0 ? (
                        <div className="text-center py-8 bg-white rounded-lg">
                            <AlertTriangle className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                            <p className="text-gray-500">沒有找到相關訂單</p>
                        </div>
                    ) : (
                        filteredOrders.map((order) => (
                            <div
                                key={order.orderId}
                                className="bg-white shadow-sm hover:shadow-md rounded-lg overflow-hidden border border-gray-200 transition-shadow duration-200"
                            >
                                <div className="p-4">
                                    {/* 縮略信息 */}
                                    <div className="flex justify-between items-center">
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2">
                                                <Music2 className="w-5 h-5 text-blue-500" />
                                                <h2 className="text-lg font-semibold text-gray-800">
                                                    {order.eventName}
                                                </h2>
                                            </div>
                                            <div className="flex items-center gap-4 text-sm text-gray-600">
                                                <div className="flex items-center gap-1">
                                                    <FileText className="w-4 h-4" />
                                                    <span>訂單編號：{order.orderId}</span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <Clock className="w-4 h-4" />
                                                    <span>訂單時間：{order.orderDateTime.replace("T", " ")}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <span className={`${getStatusColor(order.orderStatus)} font-medium`}>
                                                {order.orderStatus}
                                            </span>
                                            <button
                                                onClick={() => toggleExpand(order.orderId)}
                                                className="text-blue-600 hover:text-blue-700 transition-colors"
                                            >
                                                {expandedOrderId === order.orderId ? (
                                                    <ChevronUp className="w-5 h-5" />
                                                ) : (
                                                    <ChevronDown className="w-5 h-5" />
                                                )}
                                            </button>
                                        </div>
                                    </div>

                                    {/* 詳細信息 */}
                                    {expandedOrderId === order.orderId && (
                                        <div className="mt-4 pt-4 border-t border-gray-100 space-y-3">
                                            <div className="grid grid-cols-2 gap-4">
                                                <InfoItem
                                                    icon={<User className="w-4 h-4 text-blue-500" />}
                                                    label="表演者"
                                                    value={order.eventPerformer}
                                                />
                                                <InfoItem
                                                    icon={<DollarSign className="w-4 h-4 text-green-500" />}
                                                    label="票價"
                                                    value={`$${order.ticketPrice}`}
                                                />
                                                <InfoItem
                                                    icon={<Calendar className="w-4 h-4 text-orange-500" />}
                                                    label="演出日期"
                                                    value={order.eventDate}
                                                />
                                                <InfoItem
                                                    icon={<Clock className="w-4 h-4 text-orange-500" />}
                                                    label="演出時間"
                                                    value={order.eventTime}
                                                />
                                                <InfoItem
                                                    icon={<MapPin className="w-4 h-4 text-red-500" />}
                                                    label="訂票區域"
                                                    value={order.orderSection}
                                                />
                                                <InfoItem
                                                    icon={<Ticket className="w-4 h-4 text-purple-500" />}
                                                    label="訂票數量"
                                                    value={order.orderQuantity}
                                                />
                                                <InfoItem
                                                    icon={<Building className="w-4 h-4 text-gray-500" />}
                                                    label="主辦方"
                                                    value={order.hostName}
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}

const InfoItem = ({ icon, label, value }) => (
    <div className="flex items-center gap-2">
        {icon}
        <span className="text-gray-600 text-sm">{label}：</span>
        <span className="text-gray-800 font-medium">{value}</span>
    </div>
);

export default UserOrder;