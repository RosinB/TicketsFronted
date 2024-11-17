import { useEffect, useState } from "react"
import ApiService from "../../api/ApiService";
import LoadingSpinner from "../../components/LoadingSpinner";
import { useLocation } from "react-router-dom";

function TicketOrders() {

    const location=useLocation();
    const { orderId } = location.state || {}; // 從 state 解構出 orderId
    const [order, setOrder] = useState([]);
    const [loading, setLoading] = useState(true);
    const userName=localStorage.getItem("userName")


    const fetchOrder = async () => {

        try {
            console.log("我有接到資訊"+orderId)
            const response = await ApiService.fetchOrder(orderId,userName);
            setOrder(response.data.data);
        } catch (error) {
            console.log(error);

        } finally {
            setLoading(false);

        }

    };


    useEffect(() => {
        fetchOrder();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [orderId]);

    console.log("我的訂單是",order);

    if (loading) {
        return <LoadingSpinner />
    }
    const formattedDateTime = order.orderDateTime.replace("T", " ");





    return (
        <div className="max-w-4xl mx-auto mt-10 bg-white shadow-lg rounded-lg overflow-hidden">
            <div className="bg-gradient-to-r  from-indigo-500 to-purple-500 px-6 py-3 text-white text-lg font-semibold">
                訂單摘要
            </div>
            <table className="min-w-full border-collapse bg-white">
                <thead>
    
                </thead>
                <tbody className="text-gray-700 text-sm">
                    <tr className="border-b border-gray-200 hover:bg-gray-50">
                        <td className="py-3 px-6 font-semibold">訂單編號</td>
                        <td className="py-3 px-6">{order.orderId}</td>
                    </tr>
                    <tr className="border-b border-gray-200 hover:bg-gray-50">
                        <td className="py-3 px-6 font-semibold">購買者名稱</td>
                        <td className="py-3 px-6">{order.userName}</td>
                    </tr>
                    <tr className="border-b border-gray-200 hover:bg-gray-50">
                        <td className="py-3 px-6 font-semibold">演唱會名稱</td>
                        <td className="py-3 px-6">{order.eventName}</td>
                    </tr>
                    <tr className="border-b border-gray-200 hover:bg-gray-50">
                        <td className="py-3 px-6 font-semibold">訂單時間</td>
                        <td className="py-3 px-6">{formattedDateTime}</td>
                    </tr>
                    <tr className="border-b border-gray-200 hover:bg-gray-50">
                        <td className="py-3 px-6 font-semibold">票區</td>
                        <td className="py-3 px-6">{order.orderSection}</td>
                    </tr>
                    <tr className="border-b border-gray-200 hover:bg-gray-50">
                        <td className="py-3 px-6 font-semibold">訂單狀態</td>
                        <td className="py-3 px-6">{order.orderStatus}</td>
                    </tr>
                  
                </tbody>
            </table>
        </div>
    );



}

export default TicketOrders