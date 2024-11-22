import { useState } from "react";
import ApiService from "../../api/ApiService";

const AdminOrder = () => {
    const [eventId, setEventId] = useState("");
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1); // 當前頁碼
    const itemsPerPage = 10; // 每頁顯示的訂單數量
    const columnName = [
        "訂單編號",
        "用戶名稱",
        "演唱會名稱",
        "表演者",
        "訂票區域",
        "數量",
        "狀態",
        "更新時間",
    ];


    // 從後端獲取訂單資料
    const fetchOrders = async () => {
        setLoading(true);
        try {
            const response = await ApiService.fetchOrdersById(eventId);
            setOrders(response.data.data); // 使用從後端獲取的資料
            setCurrentPage(1); // 重置到第一頁
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

    // 計算分頁資料
    const totalPages = Math.ceil(orders.length / itemsPerPage);
    const paginatedOrders = orders.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );


    return (
        <div className="container mx-auto px-4 py-6 text-white">
            <h1 className="text-3xl font-bold mb-4">演唱會訂單管理</h1>

            {/* 輸入框與按鈕 */}
            <div className="flex items-center gap-4 mb-6">
                <input
                    type="text"
                    className="w-1/3 px-4 py-2 rounded-md bg-gray-800 border border-gray-700 text-white"
                    placeholder="輸入演唱會 ID"
                    value={eventId}
                    onChange={(e) => setEventId(e.target.value)}
                />
                <button
                    className="bg-blue-500 text-white px-4 py-2 rounded-md"
                    onClick={handleSearch}
                >
                    查詢
                </button>
                <h1 className="text-xl font-bold text-orange-300  ">查詢演唱會:{eventId}號</h1>

            </div>

            {/* 訂單表格 */}
            {loading ? (
                <p className="text-gray-300">正在加載訂單資料...</p>
            ) : paginatedOrders.length > 0 ? (
                <>
                    <table className="table-auto w-full bg-gray-800 rounded-lg shadow-lg">
                        <TableColumn columns={columnName}/>


                        <tbody>
                            {paginatedOrders.map((order, index) => (
                                <tr key={index}>
                                    <ColumnData value={order.orderId}/>
                                    <ColumnData value={order.userName}/>
                                    <ColumnData value={order.eventName}/>

                                    <ColumnData value={order.eventPerformer}/>
                                    <ColumnData value={order.orderSection}/>
                                    <ColumnData value={order.orderQuantity}/>
                                    <td
                                        className={`px-4 py-2 border border-gray-600 ${
                                            order.orderStatus === "已完成"
                                                ? "text-green-400"
                                                : "text-red-400"
                                        }`}
                                    >
                                        {order.orderStatus}
                                    </td>
                                    <ColumnData value={new Date(order.orderUpdate).toLocaleString()}/>

                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* 分頁按鈕 */}
                    <div className="flex justify-center mt-4">
                        <button
                            className="px-4 py-2 mx-1 bg-gray-700 text-white rounded-md"
                            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                        >
                            上一頁
                        </button>
                        <span className="px-4 py-2 bg-gray-800 text-white rounded-md">
                            {currentPage} / {totalPages}
                        </span>
                        <button
                            className="px-4 py-2 mx-1 bg-gray-700 text-white rounded-md"
                            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
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