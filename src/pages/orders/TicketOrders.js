import { useEffect, useState } from "react"
import ApiService from "../../api/ApiService";
import LoadingSpinner from "../../components/LoadingSpinner";
import { useLocation } from "react-router-dom";

function TicketOrders() {

    const location=useLocation();
    const ticketInfo=location.state|| {};
    const [order, setOrder] = useState([]);
    const [loading, setLoading] = useState(true);


    const fetchOrder = async () => {

        try {
            console.log("我有接到資訊"+ticketInfo)
            const response = await ApiService.fetchOrder(ticketInfo);
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
    }, [ticketInfo]);

    console.log(order);

    if (loading) {
        return <LoadingSpinner />
    }





    return (
        <div> yeah</div>

    );



}

export default TicketOrders