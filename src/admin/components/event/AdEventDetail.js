import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ApiService from "../../../api/ApiService";
import LoadingSpinner from "../../../components/ui/LoadingSpinner";

function AdEventDetail() {
    const { eventId } = useParams();
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchEvent = async () => {
        try {
            console.log("eventID:", eventId);
            const response = await ApiService.fetchAdminEventById(eventId);
            setEvent(response.data.data);
        } catch (error) {
            console.error("無法獲取演唱會資料:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEvent();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    if (loading) return <LoadingSpinner />;

    return (
        <div className="container mx-auto px-4 py-6 text-white">
            <h1 className="text-3xl font-bold mb-6">演唱會詳情</h1>
            
            {/* 基本資訊表格 */}
            <table className="table-auto border-collapse w-full bg-gray-800 text-left rounded-lg shadow-lg">
                <thead>
                    <tr className="bg-gray-700">
                        <ColumnName name="項目"/>
                        <ColumnName name="內容"/>
                    </tr>
                </thead>
                <tbody>
                        <ColumnData name="演唱會ID" value={event.eventId}/>
                        <ColumnData name="演唱會名稱" value={event.eventName}/>
                        <ColumnData name="表演者" value={event.eventPerformer}/>
                        <ColumnData name="描述" value={event.eventDescription}/>
                        <ColumnData name="地點" value={event.eventLocation}/>
                        <ColumnData name="日期" value={event.eventDate}/>
                        <ColumnData name="時間" value={event.eventTime}/>
                        <ColumnData name="主辦方" value={event.hostName}/>
                        <ColumnData name="類型" value={event.eventType}/>
                        <ColumnData name="狀態" value={event.eventStatus}/>
                        <ColumnData name="銷售狀態" value={event.salesStatus}/>
                </tbody>
            </table>
            <h2 className="text-2xl font-bold mt-8 mb-4">圖片表格</h2>
            <table className="table-auto border-collapse w-full bg-gray-800 text-left rounded-lg shadow-lg">
                <thead>
                    <tr className="bg-gray-700">
                            <ColumnName name="首頁圖片"/>
                            <ColumnName name="List圖片"/>
                            <ColumnName name="票價區圖片"/>
                    </tr>
                </thead>
                <tbody>
                            <tr >
                                <ColumnData1 value={event.picEventTicket}/>
                                <ColumnData1 value={event.picEventList}/>
                                <ColumnData1 value={event.picEventSection}/>
                        </tr>
                </tbody>
            </table>


            <h2 className="text-2xl font-bold mt-8 mb-4">票務資訊</h2>
            <table className="table-auto border-collapse w-full bg-gray-800 text-left rounded-lg shadow-lg">
                <thead>
                    <tr className="bg-gray-700">
                            <ColumnName name="區域"/>
                            <ColumnName name="價格"/>
                            <ColumnName name="總數量"/>
                            <ColumnName name="剩餘數量"/>
                            <ColumnName name="可售狀態"/>
                    </tr>
                </thead>
                <tbody>
                    {event.ticketDtos.map((ticket, index) => (
                        <tr key={index}>
                            <ColumnData1 value={ticket.ticketSection}/>
                            <ColumnData1 value={ticket.ticketPrice} />
                            <ColumnData1 value={ticket.ticketQuantity}/>
                            <ColumnData1 value={ticket.ticketRemaining}/>
                            <ColumnData1 value={ticket.ticketIsAvailable ? "可售" : "不可售"}/>
                        </tr>
                    ))}
                </tbody>
            </table>

        </div>
    );
}

export default AdEventDetail;



const ColumnData=({name,value})=>{
return(
        <tr>
            <td className="px-4 py-2 border border-gray-600">{name}</td>
            <td className="px-4 py-2 border border-gray-600">{value}</td>
        </tr>
)
}

const ColumnData1=({value})=>{
    return(
           
                <td className="px-4 py-2 border border-gray-600">{value}</td>
            
    )
    }

const ColumnName=({name})=>{

return(
    <th className="px-4 py-2 border border-gray-600 font-semibold">{name}</th>)
}