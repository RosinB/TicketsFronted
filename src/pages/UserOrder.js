import { useEffect, useState } from "react";
import ApiService from "../api/ApiService";
import LoadingSpinner from "../components/ui/LoadingSpinner";

function UserOrder() {
    const userName = localStorage.getItem("userName");
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedOrderId, setExpandedOrderId] = useState(null); // 控制展開的訂單ID

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

    useEffect(() => {
        fetchOrder();
        
            // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userName]);
    console.log(orders);

    if (loading) {
        return <LoadingSpinner />;
    }

    const toggleExpand = (orderId) => {
        setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
    };
    console.log(userName);

    return (
        <div className="bg-gray-50 min-h-screen  flex flex-col items-center ">
            <h1 className="text-4xl font-extrabold text-orange-600 mb-6">
                {userName}的演唱會訂單
            </h1>         
            <div className="w-full max-w-3xl space-y-6">
                {orders.map((order) => (
                    <div
                        key={order.orderId}
                        className="bg-gradient-to-r from-gray-100 to-white shadow-lg hover:shadow-xl rounded-lg p-6 border border-gray-200"
                    >
                        {/* 縮略信息 */}
                        <div className="flex justify-between items-center">
                            <div>
                                <h2 className="text-xl font-semibold bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-600 bg-clip-text text-transparent">
                                    {order.eventName}
                                </h2>
                                <p className="text-sm text-gray-600">
                                    日期：{order.eventDate} | 時間：{order.eventTime}
                                </p>
                                <p className="text-sm text-gray-600">
                                    地點：{order.eventLocation}
                                </p>
                            </div>
                            <button
                                className="bg-gradient-to-r from-green-800 via-green-700 to-green-600 bg-clip-text text-transparent font-medium"
                                onClick={() => toggleExpand(order.orderId)}
                            >
                                {expandedOrderId === order.orderId
                                    ? "隱藏訂單"
                                    : "查看完整訂單"}
                            </button>
                        </div>

                        {/* 詳細信息 */}
                        {expandedOrderId === order.orderId && (
                            <div className="mt-4 text-gray-700 text-sm space-y-2">
                                <p className="text-gray-800 font-medium font-semibold">
                                    表演者：<span className="text-blue-500">{order.eventPerformer}</span>
                                </p>
                                <p className="text-gray-700 font-semibold">票價：${order.ticketPrice}</p>
                                <p className="text-gray-700 font-semibold">訂票區域：{order.orderSection}</p>
                                <p className="text-gray-700 font-semibold">訂票數量：{order.orderQuantity}</p>
                                <p className="text-gray-600 font-semibold">訂單編號：{order.orderId}</p>
                                <p className="text-gray-600 font-semibold">訂單時間：{order.orderDateTime.replace("T", " ")}</p>
                                <p className="text-gray-700 font-semibold">主辦方：{order.hostName}</p>
                                <p className="text-green-600 font-semibold">訂單狀態：{order.orderStatus}</p>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default UserOrder;
