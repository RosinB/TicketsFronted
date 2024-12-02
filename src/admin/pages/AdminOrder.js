import { useState } from "react";
import ApiService from "../../api/ApiService";

const AdminOrder = () => {
    const [eventId, setEventId] = useState("");
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [activeTab, setActiveTab] = useState("all"); // 新增：當前選中的訂單狀態
    const itemsPerPage = 10;

    const columnName = [
        "訂單編號", "用戶名稱", "演唱會名稱", "表演者", 
        "訂票區域","座位", "數量", "狀態", "更新時間",
    ];

    // 過濾訂單狀態
    const filterOrdersByStatus = (status) => {
        if (status === "all") return orders;
        return orders.filter(order => order.orderStatus === status);
    };

    // 根據狀態統計訂單數量
    const getOrderCounts = () => {
        const counts = {
            all: orders.length,
            付款中: orders.filter(order => order.orderStatus === "付款中").length,
            訂單取消: orders.filter(order => order.orderStatus === "訂單取消").length,
            訂單完成: orders.filter(order => order.orderStatus === "訂單完成").length
        };
        return counts;
    };

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const response = await ApiService.fetchOrdersById(eventId);
            setOrders(response.data.data);
            console.log(response.data.data)
            setCurrentPage(1);
        } catch (error) {
            console.error("無法獲取訂單資料", error);
            setOrders([]);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = () => {
        if (eventId.trim() === "") {
            alert("請輸入演唱會 ID");
            return;
        }
        fetchOrders(eventId);
    };

    // 取得當前狀態的訂單
    const filteredOrders = filterOrdersByStatus(activeTab);
    const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
    const paginatedOrders = filteredOrders.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );
    
    const orderCounts = getOrderCounts();

    const TabButton = ({ status, label }) => (
        <button
            onClick={() => {
                setActiveTab(status);
                setCurrentPage(1);
            }}
            className={`px-4 py-2 rounded-t-lg transition-colors ${
                activeTab === status 
                    ? "bg-gray-800 text-white border-t-2 border-teal-500" 
                    : "bg-gray-700 text-gray-300 hover:bg-gray-600"
            }`}
        >
            {label} ({orderCounts[status]})
        </button>
    );

    return (
        <div className="container mx-auto px-4 py-6 -mt-6 text-white">
            <h1 className="text-3xl font-bold mb-4">演唱會訂單管理</h1>

            <div className="flex items-center gap-4 mb-6">
                <input
                    type="text"
                    className="w-1/3 px-4 py-2 rounded-md bg-gray-800 border border-gray-700 text-white"
                    placeholder="輸入演唱會 ID"
                    value={eventId}
                    onChange={(e) => setEventId(e.target.value)}
                />
                <button
                    className="bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-md transition-colors"
                    onClick={handleSearch}
                >
                    查詢
                </button>
                {eventId && <h1 className="text-xl font-bold text-orange-300">查詢演唱會: {eventId}號</h1>}
            </div>

            {/* 訂單狀態分頁 */}
            {orders.length > 0 && (
                <div className="flex gap-2 mb-4">
                    <TabButton status="all" label="全部訂單" />
                    <TabButton status="訂單完成" label="訂單完成" />
                    <TabButton status="付款中" label="付款中" />
                    <TabButton status="訂單取消" label="訂單取消" />
                </div>
            )}

            {loading ? (
                <p className="text-gray-300">正在加載訂單資料...</p>
            ) : paginatedOrders.length > 0 ? (
                <>
                    <table className="table-auto w-full border-collapse border border-gray-700">
                        <TableColumn columns={columnName} />
                        <tbody>
                            {paginatedOrders.map((order, index) => (
                                <tr key={index} className="bg-gray-900 hover:bg-gray-800">
                                    <ColumnData value={order.orderId} />
                                    <ColumnData value={order.userName} />
                                    <ColumnData value={order.eventName} />
                                    <ColumnData value={order.eventPerformer} />
                                    <ColumnData value={order.orderSection} />
                                    <ColumnData value={order.seatsDisplay} />

                                    <ColumnData value={order.orderQuantity} />
                                    <td className={`px-4 py-2 border border-gray-700 ${
                                        order.orderStatus === "訂單完成" 
                                            ? "text-green-400"
                                            : order.orderStatus === "訂單取消"
                                            ? "text-red-400"
                                            : "text-yellow-400"
                                    }`}>
                                        {order.orderStatus}
                                    </td>
                                    <ColumnData value={new Date(order.orderUpdate).toLocaleString()} />
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <div className="flex justify-center mt-4">
                        <button
                            className="px-4 py-2 mx-1 bg-gray-700 hover:bg-gray-600 text-white rounded-md disabled:opacity-50"
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                        >
                            上一頁
                        </button>
                        <span className="px-4 py-2 bg-gray-800 text-white rounded-md">
                            {currentPage} / {totalPages}
                        </span>
                        <button
                            className="px-4 py-2 mx-1 bg-gray-700 hover:bg-gray-600 text-white rounded-md disabled:opacity-50"
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                        >
                            下一頁
                        </button>
                    </div>
                </>
            ) : (
                <p className="text-gray-400">尚無訂單資料</p>
            )}
        </div>
    );
};

export default AdminOrder;



const TableColumn = ({ columns }) => {
    return (
        <thead>
            <tr className="bg-gray-700">
                {columns.map((column, index) => (
                    <th key={index} className="px-4 py-2 border border-gray-600">
                        {column}
                    </th>
                ))}
            </tr>
        </thead>
    );
};


const ColumnData =({value})=>{

    return(     
    <td    className="px-4 py-2 border border-gray-600">
        {value}</td>
        )

}