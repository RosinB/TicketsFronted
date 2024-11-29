import { useEffect, useState } from "react";
import ApiService from "../api/ApiService";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import { useLocation, useNavigate } from "react-router-dom";

function TicketPay() {
    const location = useLocation();
    const { orderId } = location.state || {}; // 從 state 解構出 orderId
    const [order, setOrder] = useState([]);
    const [loading, setLoading] = useState(true);
    const [countdown, setCountdown] = useState(null); // 倒數時間 (以秒為單位)
    const userName = localStorage.getItem("userName");
    const navigate = useNavigate();

    const fetchOrder = async () => {
        if (!orderId) {
            console.error("orderId 不存在！");
            navigate("/");
            return;
        }

        try {
            const response = await ApiService.fetchOrder(orderId, userName);
            const orderData = response.data.data;
            setOrder(orderData);

            const currentTime = new Date().getTime(); // 當前時間（毫秒）
            const orderTime = new Date(orderData.orderDateTime).getTime(); // 訂單時間
            const elapsedTime = Math.floor((currentTime - orderTime) / 1000); // 已經過的秒數
            const remainingTime = Math.max(10 * 60 - elapsedTime, 0); // 剩餘時間（10分鐘 - 已經過的時間）
            setCountdown(remainingTime);

            // 若超時直接跳轉
            if (remainingTime === 0) {
                alert("付款超時，訂單已取消！");
                navigate("/");
            }

        } catch (error) {
            console.log("訂單摘要有錯誤: " + error);
        } finally {
            setLoading(false);
        }
    };

    // 每秒更新倒數時間
    useEffect(() => {
        if (countdown === null) return;

        const timer = setInterval(() => {
            setCountdown((prevCountdown) => {
                if (prevCountdown <= 1) {
                    clearInterval(timer);
                    alert("付款超時，訂單已取消！");
                    navigate("/cancel");
                    return 0;
                }
                return prevCountdown - 1;
            });
        }, 1000);

        return () => clearInterval(timer); // 清除計時器
    }, [countdown, navigate]);

    useEffect(() => {
        fetchOrder();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [orderId]);


    
    // 格式化倒數時間為 mm:ss
    const formatCountdown = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    };

    const handlePay=()=>{
        ApiService.updateOrderStatus(orderId)
            .then(()=>{
                alert("付款成功");
                navigate("/event/ticket/orderabs", { state:  {orderId}  });
            }).catch(()=>{
                alert("付款失敗");
    })}

    const handleCancel=()=>{
        ApiService.cancelOrder(orderId)
            .then(()=>{
                alert("取消訂單成功，跳回首頁");
                navigate("/");
            }).catch((error)=>{
                console.log(error);
                alert("取消訂單失敗");
            })
    }



    if (loading) return <LoadingSpinner />;

    return (
        <div className=" text-orange-400 flex flex-col items-center justify-center">
            {/* 訂單資訊區 */}
            <div className="bg-white text-gray-800 w-11/12 max-w-3xl shadow-xl rounded-lg p-8">
                <h1 className="text-3xl font-bold text-center mb-6">
                    付款中 - 剩餘時間: <span className="text-red-500">{formatCountdown(countdown)}</span>
                </h1>

                <table className="w-full text-left border-collapse">
                    <tbody className="text-sm">
                        <CoulmnOrder name={"訂單編號: "} value={order.orderId} />
                        <CoulmnOrder name={"演唱會名稱: "} value={order.eventName} />
                        <CoulmnOrder name={"購買者名稱: "} value={order.userName} />
                        <CoulmnOrder name={"座位: "} value={order.seat} />
                        <CoulmnOrder name={"票區: "} value={order.orderSection} />
                        <CoulmnOrder name={"票價: "} value={order.orderPrice} />
                        <CoulmnOrder name={"訂單時間: "} value={order.orderDateTime.replace("T", " ")} />
                        <CoulmnOrder name={"訂單狀態: "} value={order.orderStatus} />
                    </tbody>
                </table>
            </div>

            {/* 付款方式區 */}
            <div className="w-11/12 max-w-3xl bg-white shadow-xl rounded-lg p-8 mt-6">
                <h2 className="text-xl font-bold text-center mb-6">選擇付款方式</h2>
                <div className="grid grid-cols-2 gap-4">
                    <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded">
                        信用卡支付
                    </button>
                    <button className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-4 rounded">
                        行動支付 (Apple Pay / Google Pay)
                    </button>
                    <button 
                        onClick={handleCancel}
                        className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-3 px-4 rounded">
                        取消訂單
                    </button>
                    <button 
                        onClick={handlePay}
                        className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-3 px-4 rounded">
                         確認付款
                    </button>
                </div>
            </div>
        </div>
    );
}

export default TicketPay;

const CoulmnOrder = ({ value, name }) => {
    return (
        <tr className="border-b border-gray-300 hover:bg-gray-100">
            <td className="py-3 px-6 font-semibold">{name}</td>
            <td className="py-3 px-6">{value}</td>
        </tr>
    );
};
