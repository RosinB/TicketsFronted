import { useEffect, useState } from "react";
import ApiService from "../api/ApiService";
import LoadingSpinner from "../components/modal/LoadingSpinner";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { 
    Clock, 
    CreditCard, 
    Smartphone, 
    X, 
    CheckCircle, 
    Ticket, 
    User, 
    CalendarClock, 
    MapPin,
    DollarSign,
    ClipboardList,
    AlertCircle 
} from "lucide-react";

function TicketPay() {
    const location = useLocation();
    const { orderId } = location.state || {};
    const userName = localStorage.getItem("userName");
    const navigate = useNavigate();
    const {requestId} = useParams();

    const [order, setOrder] = useState([]);
    const [loading, setLoading] = useState(true);
    const [countdown, setCountdown] = useState(null);


    const formatCountdown = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    };

    const formatSeats = (order) => {
        if (!order.seats || order.seats.length === 0) return "無座位資訊";
        return order.seats.join(", ");
    };

    const payInfo = [
        { icon: <ClipboardList className="text-gray-400" size={20} />, label: "訂單編號:", value: order.orderId },
        { icon: <Ticket className="text-gray-400" size={20} />, label: "演唱會名稱:", value: order.eventName },
        { icon: <User className="text-gray-400" size={20} />, label: "購買者名稱:", value: order.userName },
        { icon: <MapPin className="text-gray-400" size={20} />, label: "座位:", value: formatSeats(order) },
        { icon: <MapPin className="text-gray-400" size={20} />, label: "票區:", value: order.orderSection },
        { icon: <DollarSign className="text-gray-400" size={20} />, label: "票價:", value: order.orderPrice },
        { 
            icon: <CalendarClock className="text-gray-400" size={20} />, 
            label: "訂單時間:", 
            value: order.orderDateTime ? order.orderDateTime.replace("T", " ") : "未知" 
        },
        { icon: <AlertCircle className="text-gray-400" size={20} />, label: "訂單狀態:", value: order.orderStatus }
    ];

    const fetchOrder = async () => {
        if (!orderId) {
            console.error("orderId 不存在！");
            navigate("/");
            return;
        }

        try {
            const response = await ApiService.fetchOrder(orderId, userName, requestId);
            const orderData = response.data.data;  // 獲取新資料
            setOrder(orderData);
    
            // 使用新獲取的資料計算時間
            const currentTime = new Date().getTime();
            const orderTime = new Date(orderData.orderDateTime).getTime();  // 使用新資料
            const elapsedTime = Math.floor((currentTime - orderTime) / 1000);
            const remainingTime = Math.max(10 * 60 - elapsedTime, 0);
            setCountdown(remainingTime);

            if (remainingTime === 0) {
                alert("付款超時，訂單已取消！");
                navigate("/");
            }

        } catch (error) {
            alert("訂單已超時");
            console.log("訂單摘要有錯誤: " + error);
            navigate("/");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (countdown === null) return;

        const timer = setInterval(() => {
            setCountdown((prevCountdown) => {
                if (prevCountdown <= 1) {
                    clearInterval(timer);
                    alert("付款超時，訂單已取消！");
                    navigate("/");
                    return 0;
                }
                return prevCountdown - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [countdown, navigate]);

    useEffect(() => {
        fetchOrder();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [orderId]);

    const handlePay = () => {
        ApiService.updateOrderStatus(orderId)
            .then(() => {
                alert("付款成功");
                navigate("/event/ticket/orderabs", { state: { orderId } });
            })
            .catch(() => {
                alert("付款失敗");
            });
    };

    const handleCancel = () => {
        ApiService.cancelOrder(orderId)
            .then(() => {
                alert("取消訂單成功，跳回首頁");
                navigate("/");
            })
            .catch((error) => {
                console.log(error);
                alert("取消訂單失敗");
            });
    };

    if (loading) return <LoadingSpinner />;

    return (
        <div className="min-h-screen bg-gradient-to-b -mt-8 from-gray-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto space-y-5">
                {/* 訂單資訊卡片 */}
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-blue-200">
                    {/* 倒數計時器 */}
                    <CountdownComp formatCountdown={formatCountdown} countdown={countdown}/>

                    {/* 訂單詳情 */}
                    <OrderDetail payInfo={payInfo} />
                </div>

                {/* 付款選項卡片 */}
                <PayInfo handleCancel={handleCancel} handlePay={handlePay}/>
            </div>
        </div>
    );
}

export default TicketPay;



const CountdownComp=({formatCountdown,countdown})=>{
        return(  <div className="bg-blue-500  p-6">
            <div className="flex items-center justify-center space-x-3">
                <Clock className="text-white animate-pulse" size={24} />
                <h1 className="text-2xl font-bold text-white">
                    付款倒數時間：
                    <span className="ml-2 text-white bg-white/20 px-3 py-1 rounded-lg">
                        {formatCountdown(countdown)}
                    </span>
                </h1>
            </div>
        </div>)

}

const OrderDetail=({payInfo})=>{

    return( 
    <div className="p-4 -mt-2">
        <div className="divide-y divide-gray-100">
            {payInfo.map((item, index) => (
                <div key={index} className="py-4 flex items-center hover:bg-gray-50 transition-colors duration-150 rounded-lg px-4">
                    <div className="flex items-center w-1/2 space-x-3">
                        {item.icon}
                        <span className="font-medium text-gray-700">{item.label}</span>
                    </div>
                    <div className="w-1/2 text-gray-900">{item.value}</div>
                </div>
            ))}
        </div>
    </div>)
}

const PayInfo=({handleCancel,handlePay})=>{
    return(<div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
        <h2 className="text-2xl font-semibold text-center mb-8 text-gray-800">
            選擇付款方式
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <button className="group flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 hover:shadow-lg">
                <CreditCard size={20} className="group-hover:scale-110 transition-transform duration-200" />
                <span>信用卡支付</span>
            </button>
            <button className="group flex items-center justify-center space-x-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-medium py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 hover:shadow-lg">
                <Smartphone size={20} className="group-hover:scale-110 transition-transform duration-200" />
                <span>行動支付</span>
            </button>
            <button 
                onClick={handleCancel}
                className="group flex items-center justify-center space-x-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-medium py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 hover:shadow-lg">
                <X size={20} className="group-hover:scale-110 transition-transform duration-200" />
                <span>取消訂單</span>
            </button>
            <button 
                onClick={handlePay}
                className="group flex items-center justify-center space-x-2 bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white font-medium py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 hover:shadow-lg">
                <CheckCircle size={20} className="group-hover:scale-110 transition-transform duration-200" />
                <span>確認付款</span>
            </button>
        </div>
    </div>)
}