import React, { useState, useEffect } from "react";
import { ArrowDown, CheckCircle, Clock, DollarSign } from "lucide-react";
import ApiService from "../../api/ApiService";
import LoadingSpinner from "../../components/modal/LoadingSpinner";

function AdminRefund() {
    const [expandedId, setExpandedId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [refundData, setRefundData] = useState([]);
    const [selectedTab, setSelectedTab] = useState("pending");

    const tabs = [
        {
            id: "pending",
            label: "處理中",
            icon: <Clock className="w-5 h-5" />,
        },
        {
            id: "completed",
            label: "處理完畢",
            icon: <CheckCircle className="w-5 h-5" />,
        }
    ];

    useEffect(() => {
        const fetchRefund = async () => {
            try {
                const response = await ApiService.fetchRefundSubmit();
                setRefundData(response.data.data);
            } catch (error) {
                console.log("錯誤" + error);
            } finally {
                setLoading(false);
            }
        };
        fetchRefund();
    }, []);
    // 在 AdminRefund 組件內加入這些函數
    const handleRefundSuccess = async (refundId) => {
        try {
            await ApiService.approveRefund(refundId);
            const response = await ApiService.fetchRefundSubmit();
            setRefundData(response.data.data);
            alert("退票處理成功");
        } catch (error) {
            console.error("退票處理失敗:", error);
            alert("處理失敗，請稍後再試");
        }
    };

    const calculateRefundDeadline = (orderDateTime) => {
        const orderDate = new Date(orderDateTime);
        const deadline = new Date(orderDate);
        deadline.setDate(deadline.getDate() + 7);
        return deadline.toLocaleDateString('zh-TW'); // 格式會是 YYYY/MM/DD
    };

    const handleRefundReject = async (refundId) => {
        try {
            console.log(`/admin/orders/reject/${refundId}`);


            await ApiService.rejectRefund(refundId);

            const response = await ApiService.fetchRefundSubmit();
            setRefundData(response.data.data);

            alert("退票已駁回");
        } catch (error) {
            console.error("退票駁回失敗:", error);
            alert("處理失敗，請稍後再試");
        }
    };

    const formatDateTime = (dateString) => {
        return new Date(dateString).toLocaleString('zh-TW', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading) return <LoadingSpinner />;

    // 根據狀態篩選資料
    const filteredData = refundData.filter(refund => {
        if (selectedTab === "pending") {
            return refund.refundStatus === "待處理";
        }
        return refund.refundStatus !== "待處理";
    });

    return (
        <div className="min-h-screen bg-gray-900 px-4 py-6">
            {/* Header */}
            <header className="max-w-7xl mx-auto mb-6">
                <div className="flex items-center gap-3 mb-6">
                    <DollarSign className="w-8 h-8 text-teal-500" />
                    <h1 className="text-2xl font-bold text-white">退款管理</h1>
                </div>

                {/* Navigation Tabs */}
                <div className="border-b border-gray-700">
                    <nav className="flex space-x-4" aria-label="Tabs">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setSelectedTab(tab.id)}
                                className={`
                ${selectedTab === tab.id
                                        ? 'border-teal-500 text-white'
                                        : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'
                                    }
                px-4 py-4 text-sm font-medium border-b-2
                flex items-center gap-2 transition-colors duration-200
                `}
                            >
                                {tab.icon}
                                <span>{tab.label}</span>
                            </button>
                        ))}
                    </nav>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto">
                <div className="rounded-lg">
                    <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
                        {filteredData.length > 0 ? (
                            filteredData.map((refund) => (
                                <div key={refund.refundId} className="border-b border-gray-700 last:border-0">
                                    {/* Collapsible Header */}
                                    <button
                                        onClick={() => setExpandedId(expandedId === refund.refundId ? null : refund.refundId)}
                                        className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-700/50 transition-colors duration-200"
                                    >
                                        <div className="flex items-center gap-6">
                                            <div className="flex items-center gap-2">
                                                <span className="text-gray-400">退款ID:</span>
                                                <span className="text-white">{refund.refundId}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-gray-400">訂單ID:</span>
                                                <span className="text-white">{refund.orderId}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-gray-400">用戶ID:</span>
                                                <span className="text-white">{refund.userId}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-gray-400">狀態:</span>
                                                <span className={`px-2 py-1 rounded-full text-sm ${refund.refundStatus === "待處理"
                                                    ? "bg-yellow-500/20 text-yellow-500"
                                                    : "bg-green-500/20 text-green-500"
                                                    }`}>
                                                    {refund.refundStatus}
                                                </span>
                                            </div>
                                        </div>
                                        <ArrowDown
                                            className={`w-5 h-5 text-gray-400 transition-transform duration-200 
                        ${expandedId === refund.refundId ? 'rotate-180' : ''}`}
                                        />
                                    </button>

                                    {/* Expanded Content */}
                                    {expandedId === refund.refundId && (
                                        <div className="px-6 py-4 bg-gray-900 border border-gray-700">
                                            <div className="grid grid-cols-2 gap-6">
                                                {/* 左側資訊 */}
                                                <div className="space-y-4">
                                                    <div>
                                                        <h3 className="text-gray-400 mb-1">活動ID</h3>
                                                        <p className="text-white">{refund.eventId}</p>
                                                    </div>
                                                    <div>
                                                        <h3 className="text-gray-400 mb-1">訂單時間</h3>
                                                        <p className="text-teal-300">{formatDateTime(refund.orderDateTime)}</p>
                                                    </div>
                                                    <div>
                                                        <h3 className="text-gray-400 mb-1">退款申請時間</h3>
                                                        <p className="text-orange-300">{formatDateTime(refund.refundTime)}</p>
                                                    </div>
                                                </div>

                                                {/* 右側資訊 */}
                                                <div className="space-y-4">
                                                    <div>
                                                        <h3 className="text-gray-400 mb-1">退款標題</h3>
                                                        <p className="text-white">{refund.refundTitle}</p>
                                                    </div>
                                                    <div>
                                                        <h3 className="text-gray-400 mb-1">退款原因</h3>
                                                        <p className="text-white">{refund.refundReason}</p>
                                                    </div>
                                                    <div>
                                                        <h3 className="text-gray-400 mb-1">退款期限</h3>
                                                        <p className="text-red-500">{calculateRefundDeadline(refund.orderDateTime)}</p>
                                                    </div>
                                                </div>
                                                {/* 按鈕區域 - 只在待處理狀態顯示 */}
                                                {refund.refundStatus === "待處理" && (
                                                    <div className="col-span-2 flex justify-end gap-4 mt-4">
                                                        <button
                                                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
                                                            onClick={() => handleRefundSuccess(refund.refundId)}
                                                        >
                                                            退票成功
                                                        </button>
                                                        <button
                                                            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
                                                            onClick={() => handleRefundReject(refund.refundId)}
                                                        >
                                                            退票駁回
                                                        </button>
                                                    </div>
                                                )}


                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))
                        ) : (
                            <div className="p-6 text-center text-gray-400">
                                沒有{selectedTab === "pending" ? "待處理" : "已處理"}的退款申請記錄
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}

export default AdminRefund;