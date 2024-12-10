import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ApiService from "../api/ApiService";
import LoadingSpinner from "../components/modal/LoadingSpinner";

function OrderRefund() {
    const location = useLocation();
    const userName = localStorage.getItem("userName");
    const { orderId } = location.state || {};
    const [order, setOreder] = useState("");
    const [loading, setLoading] = useState(true);
    const navigate=useNavigate();


    const [formData, setFormData] = useState({
        orderId:orderId,
        userName:userName,
        refundTitle: '',
        refundReason: '',
    });




    const calculateRefundDeadline = (orderDateTime) => {
        const orderDate = new Date(orderDateTime);
        const deadline = new Date(orderDate);
        deadline.setDate(deadline.getDate() + 7);
        return deadline.toLocaleDateString('zh-TW'); // 格式會是 YYYY/MM/DD
    };


    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };
    const handleSubmit = async (e) => {

        e.preventDefault();

        try {
            await ApiService.refundform(formData);
            alert("退票申請成功");
            navigate("/user/orders")
        } catch (error) {
            console.log("提交表單失敗")
        }



        console.log("表單數據:", formData);
    };


    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const response = await ApiService.refundticket(orderId);
                setOreder(response.data.data);
            } catch (error) {
                console.log("錯誤:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchOrder();
    }, [orderId]);

    if (loading) return <LoadingSpinner />;

    return (
        <div className="container mx-auto px-4 py-8 -mt-6">
            <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4">
                    <h1 className="text-2xl font-bold text-white">退票申請</h1>
                </div>
                
                <div className="p-6">
                    {/* 訂單基本資訊 */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div className="space-y-4">
                            <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">活動資訊</h2>
                            <div className="space-y-2">
                                <p className="flex justify-between">
                                    <span className="text-gray-600">活動名稱：</span>
                                    <span className="font-medium">{order.eventName}</span>
                                </p>
                                <p className="flex justify-between">
                                    <span className="text-gray-600">演出者：</span>
                                    <span className="font-medium">{order.eventPerformer}</span>
                                </p>
                                <p className="flex justify-between">
                                    <span className="text-gray-600">活動地點：</span>
                                    <span className="font-medium">{order.eventLocation}</span>
                                </p>
                                <p className="flex justify-between">
                                    <span className="text-gray-600">活動日期：</span>
                                    <span className="font-medium">{order.eventDate}</span>
                                </p>
                                <p className="flex justify-between">
                                    <span className="text-gray-600">活動時間：</span>
                                    <span className="font-medium">{order.eventTime}</span>
                                </p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">訂單資訊</h2>
                            <div className="space-y-2">
                                <p className="flex justify-between">
                                    <span className="text-gray-600">訂單編號：</span>
                                    <span className="font-medium">{order.orderId}</span>
                                </p>
                                <p className="flex justify-between">
                                    <span className="text-gray-600">訂購日期：</span>
                                    <span className="font-medium">{new Date(order.orderDateTime).toLocaleString()}</span>
                                </p>
            
                                <p className="flex justify-between">
                                    <span className="text-gray-600">訂單狀態：</span>
                                    <span className="font-medium">{order.orderStatus}</span>
                                </p>
                                <p className="flex justify-between">
                                    <span className="text-gray-600">座位區域：</span>
                                    <span className="font-medium">{order.orderSection}</span>
                                </p>
                                <p className="flex justify-between">
                                    <span className="text-gray-600">座位：</span>
                                    <span className="font-medium">{order.seatsDisplay}</span>
                                </p>
                                <p className="flex justify-between">
                                    <span className="text-gray-600">票價：</span>
                                    <span className="font-medium">NT$ {order.ticketPrice}</span>
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="mt-8">
                        <h2 className="text-xl font-semibold text-gray-800 border-b pb-2 mb-6">退票申請表</h2>
                        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <p className="text-sm text-red-700">
                                    請注意：您必須在 <span className="font-bold">{calculateRefundDeadline(order.orderDateTime)}</span> 前完成退票申請
                                </p>
                            </div>
                        </div>
                    </div>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* 退票原因選擇 */}
                            <div>
                                <label className="block text-gray-700 text-sm font-bold mb-2">
                                    退票原因*
                                </label>
                                <select
                                    name="refundTitle"   // 改為 refundTitle
                                    value={formData.refundTitle}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                >
                                    <option value="">請選擇退票原因</option>
                                    <option value="時間衝突">時間衝突</option>
                                    <option value="無法參加">無法參加</option>
                                    <option value="突發狀況">突發狀況</option>
                                    <option value="其他"> 其他原因</option>
                                </select>
                            </div>

                            {/* 詳細說明 */}
                            <div>
                                <label className="block text-gray-700 text-sm font-bold mb-2">
                                    詳細說明*
                                </label>
                                <textarea
                                        name="refundReason"  // 改為與 formData 中的鍵名相同
                                        value={formData.refundReason}
                                        onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 h-32 resize-none"
                                    placeholder="請詳細說明退票原因..."
                                    required
                                />
                            </div>

                            {/* 退票規則同意 */}
                            <div className="flex items-start space-x-2">
                                <input
                                    type="checkbox"
                                    name="agree"
                                    checked={formData.agree}
                                    onChange={handleChange}
                                    className="mt-1"
                                    required
                                />
                                <label className="text-sm text-gray-600">
                                    我已閱讀並同意退票規則，理解退票將收取票價10%的手續費，且活動前7天內不接受退票。
                                </label>
                            </div>

                            {/* 退票須知 */}
                            <div className="bg-gray-50 p-4 rounded-md text-sm text-gray-600">
                                <h3 className="font-bold mb-2">退票須知：</h3>
                                <ul className="list-disc pl-5 space-y-1">
                                    <li>退票申請提交後將無法撤銷</li>
                                    <li>退款將於申請核准後5-7個工作天內退回原付款帳戶</li>
                                    <li>每張票券將收取票面價格10%作為手續費</li>
                                    <li>活動前7天內不受理退票申請</li>
                                </ul>
                            </div>

                            {/* 提交按鈕 */}
                            <div className="flex justify-end">
                                <button
                                    type="submit"
                                    className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-6 rounded-md transition duration-200"
                                >
                                    提交退票申請
                                </button>
                            </div>
                        </form>
                    </div>
            
                </div>
            </div>
        </div>
    );
}

export default OrderRefund;