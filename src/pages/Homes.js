import React from "react";
import TicketCarouse from '../components/home/TicketCarousel'
import NewsSection from "../components/home/NewsSection";
import { useState } from "react";
import { useEffect } from "react";
import ApiService from "../api/ApiService";
import LoadingSpinner from "../components/ui/LoadingSpinner";

function Home() {
    const [allEvent, setAllEvent] = useState([]);
    const [loading,  setLoading]  = useState(true);
    
    const fetchEvent = ()=>{
        ApiService.fetchAllPic()
            .then((res)=> {setAllEvent(res.data.data)})
            .catch((err)=>{console.log("輪播圖讀取圖片錯誤",err)})
            .finally(()=>{setLoading(false)})
    };

    useEffect(() => {
        fetchEvent();
    }, []);

    if(loading) return <LoadingSpinner/>



    return (
        <div className="text-center">
            {/* 放圖片的區域 */}
            <div className="w-screen aspect-[16/9] max-h-[300px]  -mt-1 relative">
                <div className="absolute top-0 left-0 w-full h-full">
                    <TicketCarouse allEvent={allEvent} />
                </div>
            </div>

            <NewsSection allEvent={allEvent} />
        </div>
    );
}

export default Home;
