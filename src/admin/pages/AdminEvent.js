import { useEffect, useState } from "react";
import ApiService from "../../api/ApiService";
import LoadingSpinner from "../../components/ui/LoadingSpinner";


function AdminEvent() {
    const [event,setEvent]=useState([]);
    const [loading,setLoading]=useState(true);
    const fetchEvent=async()=>{
        try {
            const response=await ApiService.fetchAdminAllEvent()
            setEvent(response.data.data);
        } catch (error) {
            console.log("後台演唱會資訊沒有抓到",error)
        }finally{
            setLoading(false)
        }
    }


    useEffect(()=>{

        fetchEvent();
    },[])

    if(loading) return <LoadingSpinner/>


    console.log(event);

    return (
        <div></div>
    );

}

export default AdminEvent;