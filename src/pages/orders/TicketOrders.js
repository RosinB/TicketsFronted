import { useEffect, useState } from "react"
import ApiService from "../../api/ApiService";
import LoadingSpinner from "../../components/LoadingSpinner";

function TicketOrders() {


    const userName = localStorage.getItem("userName");
    const [order, setOrder] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchOrder = async () => {

        try {
            const response = await ApiService.fetchOrder(userName);
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
    }, [userName]);

    console.log(order);

    if (loading) {
        return <LoadingSpinner />
    }





    return (
        <div> yeah</div>

    );



}

export default TicketOrders