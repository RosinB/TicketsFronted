import { useEffect, useState } from "react";
import ApiService from "../../../api/ApiService";
import LoadingSpinner from "../../../components/ui/LoadingSpinner";
import { useNavigate } from "react-router-dom";



function AdminOnSale() {
    const [events, setEvents] = useState([]);
    const [loading , setLoading]=useState(true);
    const navigate=useNavigate();

    const fetchOnSale = async () => {
        try {
            const response = await ApiService.fetchOnSaleEvent();
            setEvents(response.data.data);
        } catch (error) {
            console.log("抓取資料錯誤", error);
        }finally{
            setLoading(false);

        }
    };

    useEffect(() => {
        fetchOnSale();
    }, []);

    const handleRealTimeQuery = (eventId) => {
        console.log(`實時查詢票務，活動 ID：${eventId}`);
        navigate(`/admin/status/realtime/${eventId}`);
    };

    if(loading) return <LoadingSpinner/>

    return (
        <div className="text-white p-4">
            <h1 className="text-2xl font-bold mb-4">演唱會售票資訊</h1>
            <div className="overflow-x-auto">
                <table className="table-auto w-full text-left text-sm border-collapse border border-gray-700">
                    <TableName/>

                    <tbody>
                        {events.length > 0 ? (
                            events.map((event) => (
                                <tr
                                    key={event.eventId}
                                    className="bg-gray-900 hover:bg-gray-800">

                                    <TableCell>{event.eventName}</TableCell>
                                    <TableCell>{event.eventDate}</TableCell>
                                    <TableCell>{event.eventTime}</TableCell>
                                    <TableCell className="text-teal-400 font-bold">{event.eventSalesDate} </TableCell>
                                    <TableCell className="text-teal-400 font-bold">{event.eventSalesTime}</TableCell>
                                    <TableCell>{event.salesStatus}</TableCell>
                                    <TableCell>{event.eventStatus}</TableCell>
                                    <TableCell>
                                        <Button onClick={() => handleRealTimeQuery(event.eventId)}>查詢票務</Button>
                                    </TableCell>
                               
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td
                                    colSpan="8"
                                    className="text-center border border-gray-700 px-4 py-2"
                                >
                                    無活動數據
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default AdminOnSale;

// 重用的按鈕組件
const Button = ({ onClick, children, className = "" }) => (
    <button
        onClick={onClick}
        className={`bg-teal-500 hover:bg-teal-600 text-white py-1 px-3 rounded-md ${className}`}
    >
        {children}
    </button>
);

// 重用的表格單元格組件
const TableCell = ({ children, className = "" }) => {
  
    return(
        <td className={`border border-gray-700 px-4 py-2 ${className}`}>{children}</td>
    )
};


const TableName=()=>{

    return(
                    <thead className="bg-gray-800">
                        <tr>
                            <th className="border border-gray-700 px-4 py-2">活動名稱</th>
                            <th className="border border-gray-700 px-4 py-2">活動日期</th>
                            <th className="border border-gray-700 px-4 py-2">活動時間</th>
                            <th className="border border-gray-700 px-4 py-2">售票日期</th>
                            <th className="border border-gray-700 px-4 py-2">售票時間</th>
                            <th className="border border-gray-700 px-4 py-2">銷售狀態</th>
                            <th className="border border-gray-700 px-4 py-2">活動狀態</th>
                            <th className="border border-gray-700 px-4 py-2">票務操作</th>
                        </tr>
                    </thead>

    )
                    

};