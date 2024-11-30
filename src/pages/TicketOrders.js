import { useEffect, useState } from "react"
import ApiService from "../api/ApiService";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import { useLocation,useNavigate } from "react-router-dom";

function TicketOrders() {
    const location=useLocation();
    const { orderId } = location.state || {}; // 從 state 解構出 orderId
    const userName=localStorage.getItem("userName")
    const navigate = useNavigate();

    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
//==============APi==============
    const fetchOrder = () => {

        if (!orderId) {
            console.error("orderId 不存在！");
            navigate("/");
            return; }

        ApiService.fetchOrder(orderId,userName)
            .then((res)=>{ setOrder(res.data.data)})
            .catch((err)=>{ console.log("訂單摘要有錯誤"+err)})
            .finally(()=>{setLoading(false);})
    };
    
    const formatSeats = (order) => {
        if (!order.seats || order.seats.length === 0) return "無座位資訊";
        return order.seats.join(", "); // 如果是座位描述的陣列，直接用逗號連接
    };

    const getOrderInfo = (orderData) => {
        if (!orderData) return [];
        
        const formattedDateTime = orderData.orderDateTime?.replace("T", " ");
        
        return [
            { label: "訂單編號:", value: orderData.orderId },
            { label: "演唱會名稱:", value: orderData.eventName },
            { label: "購買者名稱:", value: orderData.userName },
            { label: "座位:", value: formatSeats(orderData) },
            { label: "票區:", value: orderData.orderSection },
            { label: "票價:", value: orderData.orderPrice },
            { label: "訂單時間:", value: formattedDateTime },
            { label: "訂單狀態:", value: orderData.orderStatus }
        ];
    };



    useEffect(() => {
        fetchOrder();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [orderId]);



    if (!order) return <div>找不到訂單資料</div>;
    if (loading) return<LoadingSpinner />
    const orderInfo = getOrderInfo(order);


    return (
        <div className="max-w-4xl mx-auto mt-10 bg-white shadow-lg rounded-lg overflow-hidden">
            <Title/>
            <table className="min-w-full border-collapse bg-white">         
                <tbody className="text-gray-700 text-sm">
                    {orderInfo.map(item=> <CoulmnOrder name={item.label} value={item.value}/>)}
                </tbody>
            </table>       
        </div>
    );
}
export default TicketOrders


const CoulmnOrder=({value,name})=>{

return (<tr className="border-b border-gray-200 hover:bg-gray-50">
    <td className="py-3 px-6 font-semibold">{name}</td>
    <td className="py-3 px-6">{value}</td>
</tr>)

}
const Title=()=>{

    return(<div className="bg-gradient-to-r from-indigo-500 to-purple-500 px-5 py-3 text-gray-100 text-lg font-semibold">
                訂單摘要</div>)
}