import { useEffect, useState } from "react"
import ApiService from "../../api/ApiService";
import LoadingSpinner from "../../components/LoadingSpinner";
import { useLocation } from "react-router-dom";

function TicketOrders() {

    const location=useLocation();
    const { orderId } = location.state || {}; // 從 state 解構出 orderId
    const [order, setOrder] = useState([]);
    const [loading, setLoading] = useState(true);
    console.log("location.state:", location.state);

    console.log("訂單號碼"+orderId);

    const fetchOrder = async () => {

        try {
            console.log("我有接到資訊"+orderId)
            const response = await ApiService.fetchOrder(orderId);
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

    console.log(order);

    if (loading) {
        return <LoadingSpinner />
    }





    return (
        <div> yeah</div>

    );



}

export default TicketOrders