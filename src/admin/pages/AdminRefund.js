import { useEffect, useState } from "react";
import ApiService from "../../api/ApiService";
import { use } from "react";





function AdminRefund(){
    const[loading , setLoading]=useState(true);
    const[refundData,setRefundData]=useState("");
    useEffect(()=>{


        fetchRefund=async()=>{

                try {
                    const response =await ApiService.fetchRefundSubmit();
                    setRefundData(response.data.data)
                } catch (error) {
                    
                }finally{
    
                    setLoading(false);
    
                }
    
    
    
            

        }
        



    },[])

    




    return(

        <div>




        </div>

    )






}

export default AdminRefund;