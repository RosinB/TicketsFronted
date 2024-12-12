import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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
    const navigate = useNavigate();


    useEffect(() => {

        const fetchOrder = async () => {
            try {
                const response = await ApiService.fetchUserOrder();
                setOrders(response.data.data);
                console.log(response.data.data)
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
            case '訂單完成':
                return 'text-green-600';
            case '付款中':
                return 'text-yellow-600';
            case '訂單取消':
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
                <HeaderTitle />

                {/* 搜尋和篩選區 */}
                <SearctFilter  searchTerm={searchTerm} filterStatus={filterStatus} setSearchTerm={setSearchTerm} setFilterStatus={setFilterStatus} />

                {/* 訂單列表 */}
                <OrderLists filteredOrders={filteredOrders} 
                            toggleExpand={toggleExpand} 
                            expandedOrderId={expandedOrderId} 
                            navigate={navigate} 
                            getStatusColor={getStatusColor}/>
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

const OrderLists = ({filteredOrders,toggleExpand,expandedOrderId,navigate,getStatusColor}) => {
    return(
        <div className="space-y-4">
        {filteredOrders.length === 0 
        ? (<NoOrder />) 
        : (filteredOrders.map((order) => (
                <div
                    key={order.orderId}
                    className="bg-white shadow-sm hover:shadow-md rounded-lg overflow-hidden border border-gray-200 transition-shadow duration-200">
                    {/* 新增的圖片橫幅區域 */}
                    <div className="relative h-48 w-full overflow-hidden">
                        <img
                            src={order.picEventTicket}
                            alt={order.eventName}
                            className="w-full h-full object-cover"
                        />
                        {/* 漸層遮罩效果 */}
                        <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-black/40" />
                    </div>

                    <div className="p-4">
                        {/* 保留原本的標題和狀態顯示區域 */}
                        <div className="flex justify-between items-center">
                            {/* 訂單的標題 */}
                            <ToggleTittle order={order} />
                            {/* 訂單狀態顯示 */}
                            <ToggleStatus 
                                toggleExpand={toggleExpand} 
                                getStatusColor={getStatusColor} 
                                order={order} 
                                expandedOrderId={expandedOrderId} 
                            />
                        </div>

                        {/* 詳細信息 */}
                        {expandedOrderId === order.orderId && (
                            <div className="mt-4 pt-4 border-t border-gray-100 space-y-3">
                                {/* 資料顯示 */}
                                <OrderData order={order} />
                                {/* 付款按鈕區域 */}
                                <Pay order={order}  navigate={navigate}/>
                                <Refund order={order} navigate={navigate}/>
                            </div>
                        )}
                    </div>
                </div>
            ))
        )}
    </div>
    );
}

const SearctFilter =({searchTerm,filterStatus,setSearchTerm,setFilterStatus})=>{

    return( 
        
        <div className="bg-white p-4 rounded-lg shadow-sm mb-6 flex flex-wrap gap-4 items-center">
        {/* 搜尋 */}
        <SearchData searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        {/* 篩選狀態 */}
        <FilterStatus filterStatus={filterStatus} setFilterStatus={setFilterStatus} />
        </div>
    )
     
}











const HeaderTitle = () => {
    return (<div className="flex items-center gap-2 mb-8">
        <FileText className="w-8 h-8 text-blue-600" />
        <h1 className="text-2xl font-bold text-gray-800">
            我的訂單紀錄
        </h1>
    </div>)

}

const SearchData = ({ searchTerm, setSearchTerm }) => {
    return (<div className="flex-1 min-w-[200px]">
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
    </div>)


}
const FilterStatus = ({ filterStatus, setFilterStatus }) => {

    return (<div className="flex items-center gap-2">
        <SlidersHorizontal className="w-5 h-5 text-gray-500" />
        <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
        >
            <option value="all">全部訂單</option>
            <option value="頂單完成">已完成</option>
            <option value="付款中">待付款</option>
            <option value="訂單取消">已取消</option>
        </select>
    </div>)


}
const NoOrder = () => {

    return (<div className="text-center py-8 bg-white rounded-lg">
        <AlertTriangle className="w-12 h-12 text-gray-400 mx-auto mb-2" />
        <p className="text-gray-500">沒有找到相關訂單</p>
    </div>)
}
const ToggleTittle = ({ order }) => {

    return (<div className="space-y-2">
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
    </div>)
}


const ToggleStatus = ({ toggleExpand, order, getStatusColor, expandedOrderId }) => {

    return (<div className="flex items-center gap-4">
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
    </div>)
}

const OrderData = ({ order }) => {

    return (<div className="grid grid-cols-2 gap-4">
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
            icon={<User className="w-4 h-4 text-green-500" />}
            label="座位"
            value={`${order.seatsDisplay}`}
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
    </div>)
}

const Pay = ({order,navigate}) => {

    return (
        order.orderStatus === '付款中' && (
            <div className="mt-4 flex justify-end">
                <button
                    onClick={() => navigate(`/event/ticket/pay/${order.requestId}`, {
                        state: {
                            orderId: order.orderId,
                            requestId: order.requestId
                        }
                    })}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 
                        transition-colors duration-200 flex items-center gap-2"
                >
                    <DollarSign className="w-4 h-4" />
                    立即付款
                </button>
            </div>
        )
    );
}
    const Refund = ({order,navigate}) => {

        return (
            order.orderStatus === '訂單完成' && (
                <div className="mt-4 flex justify-end">
                    <button
                        onClick={
                            () => navigate("/user/orders/refund/", {state: {orderId: order.orderId}})
                        }
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 
                            transition-colors duration-200 flex items-center gap-2"
                    >
                        <DollarSign className="w-4 h-4" />
                        申請退票
                    </button>
                </div>
            )
        );
    

}