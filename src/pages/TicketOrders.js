import { useEffect, useState } from "react"
import ApiService from "../api/ApiService";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import { useLocation,useNavigate } from "react-router-dom";

function TicketOrders() {

    const location=useLocation();
    const { orderId } = location.state || {}; // 從 state 解構出 orderId
    const [order, setOrder] = useState([]);
    const [loading, setLoading] = useState(true);
    const userName=localStorage.getItem("userName")
    const navigate = useNavigate();

    const fetchOrder = async () => {
        
        if (!orderId) {
            console.error("orderId 不存在！");
            navigate("/");
            return; }


        try {
            console.log("我有接到資訊"+orderId)
            const response = await ApiService.fetchOrder(orderId,userName);
            setOrder(response.data.data);
        } catch (error) {
            console.log("訂單摘要有錯誤"+error);

        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        fetchOrder();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [orderId]);


    if (loading) return<LoadingSpinner />

    const formattedDateTime = order.orderDateTime.replace("T", " ");

    return (
        <div className="max-w-4xl mx-auto mt-10 bg-white shadow-lg rounded-lg overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-500 to-purple-500 px-5 py-3 text-gray-100 text-lg font-semibold">
                訂單摘要</div>
            
            <table className="min-w-full border-collapse bg-white">
            
                <tbody className="text-gray-700 text-sm">
                    <CoulmnOrder name={"購買者名稱: "} value={order.userName}/>
                    <CoulmnOrder name={"訂單編號  : "} value={order.orderId}/>
                    <CoulmnOrder name={"演唱會名稱: "} value={order.eventName}/>
                    <CoulmnOrder name={"訂單時間    "} value={formattedDateTime}/>
                    <CoulmnOrder name={"票區:       "} value={order.orderSection}/>
                    <CoulmnOrder name={"訂單狀態:   "} value={order.orderStatus}/>
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