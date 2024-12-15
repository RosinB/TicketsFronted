import { useEffect, useState } from "react"
import ApiService from "../api/ApiService";
import LoadingSpinner from "../components/modal/LoadingSpinner";
import { useLocation, useNavigate } from "react-router-dom";
import {
    Mail,
    Ticket,
    User,
    MapPin,
    DollarSign,
    ClipboardList,
    Calendar,
    AlertCircle,
} from "lucide-react";

function TicketOrders() {
    const location = useLocation();
    const { orderId } = location.state || {};
    const navigate = useNavigate();

    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchOrder = () => {
        if (!orderId) {
            console.error("orderId 不存在！");
            navigate("/");
            return;
        }
    
        ApiService.fetchAsbOrder(orderId)
            .then((res) => { setOrder(res.data.data) })
            .catch((err) => { console.log("訂單摘要有錯誤" + err) })
            .finally(() => { setLoading(false); })
    };

    const formatSeats = (order) => {
        if (!order.seats || order.seats.length === 0) return "無座位資訊";
        return order.seats.join(", ");
    };

    const getOrderInfo = (orderData) => {
        if (!orderData) return [];

        const formattedDateTime = orderData.orderDateTime?.replace("T", " ");

        return [
            { id: "orderId", icon: <ClipboardList className="text-indigo-500" size={20} />, label: "訂單編號:", value: orderData.orderId },
            { id: "eventName", icon: <Ticket className="text-indigo-500" size={20} />, label: "演唱會名稱:", value: orderData.eventName },
            { id: "userName", icon: <User className="text-indigo-500" size={20} />, label: "購買者名稱:", value: orderData.userName },
            { id: "seats", icon: <MapPin className="text-indigo-500" size={20} />, label: "座位:", value: formatSeats(orderData) },
            { id: "section", icon: <MapPin className="text-indigo-500" size={20} />, label: "票區:", value: orderData.orderSection },
            { id: "price", icon: <DollarSign className="text-indigo-500" size={20} />, label: "票價:", value: orderData.orderPrice },
            { id: "dateTime", icon: <Calendar className="text-indigo-500" size={20} />, label: "訂單時間:", value: formattedDateTime },
            { id: "status", icon: <AlertCircle className="text-indigo-500" size={20} />, label: "訂單狀態:", value: orderData.orderStatus }
        ];
    };
    // const handleSendEmail = async () => {
    //     try {
    //         await ApiService.sendOrderEmail(orderId);
    //         alert("訂單已寄送到您的信箱");
    //     } catch (error) {
    //         console.log("寄送失敗"+error);
            
    //     }
    // };
    useEffect(() => {
        fetchOrder();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [orderId]);

    if (loading) return <LoadingSpinner />

    if (!order) return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="text-center p-8 text-gray-500">
                <AlertCircle size={48} className="mx-auto mb-4 text-gray-400" />
                找不到訂單資料
            </div>
        </div>
    );


    const orderInfo = getOrderInfo(order);
    


    
    return (
        <div className="  py-6 px-4 -mt-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white shadow-xl rounded-2xl overflow-hidden border border-blue-200">

                    {/*訂單標題 */}
                    <OrderTitle/>
                    {/*訂單內容 */}
                    <OrderDetail orderInfo={orderInfo}/>
                    <EmailButton  />

                </div>
            </div>
        </div>
    );
}


export default TicketOrders;


const OrderTitle=()=>{
    return(
    <div className="bg-blue-500 px-6 py-6 ">
        <div className="flex items-center space-x-2">
            <Ticket size={24} className="text-white" />
            <div>
                <h2 className="text-xl font-semibold text-white">訂單摘要</h2>
                <p className="text-indigo-100 text-sm mt-1">
                    訂單詳細資訊
                </p>
            </div>
        </div>
    </div>)
}

const OrderDetail=({orderInfo})=>{

    return(<div className="p-6">
        <div className="divide-y divide-gray-100">
            {orderInfo.map(item => (
                <div
                    key={item.id}
                    className="py-4 flex items-center hover:bg-gray-50 transition-colors duration-150 rounded-lg px-4"
                >
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
const EmailButton = () => {
    const navigate = useNavigate();

    return (
        <div className="p-5 flex justify-end">
            <button
                onClick={() => navigate('/user/orders')}
                className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors shadow-md"
            >
                <Mail className="w-4 h-4" />
                查詢訂單詳情
            </button>
        </div>
    );
};