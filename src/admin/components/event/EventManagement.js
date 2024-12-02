import { Link } from "react-router-dom";
import React, { useState, useEffect } from "react";
import ApiService from "../../../api/ApiService";
import LoadingSpinner from "../../../components/modal/LoadingSpinner";

function EventManagement() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const fetchEvent = async () => {
        try {
            const response = await ApiService.fetchAdminAllEvent();
            setData(response.data.data); 
        } catch (error) {
            console.error("後台演唱會資訊沒有抓到", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEvent();
    }, []);

if(loading) <LoadingSpinner/>
    return (
        <div className="text-white p-4 -mt-6">
            <h1 className="text-2xl font-bold mb-4">演唱會管理</h1>
            <div className="overflow-x-auto">
                <table className="table-auto w-full text-left text-base border-collapse border border-gray-700">
                    <thead className="bg-gray-800">
                        <tr>
                            <TableHeader>演唱會Id</TableHeader>
                            <TableHeader>演唱會名稱</TableHeader>
                            <TableHeader>表演者</TableHeader>
                            <TableHeader>日期</TableHeader>
                            <TableHeader>演唱會狀態</TableHeader>
                            <TableHeader>詳情</TableHeader>
                        </tr>
                    </thead>
                    <tbody>
                        {data.length > 0 ? (
                            data.map((event) => (
                                <tr 
                                    key={event.eventId}
                                    className="bg-gray-900 hover:bg-gray-800"
                                >
                                    <TableCell>{event.eventId}</TableCell>
                                    <TableCell>{event.eventName}</TableCell>
                                    <TableCell>{event.eventPerformer}</TableCell>
                                    <TableCell>{event.eventDate}</TableCell>
                                    <TableCell>{event.eventStatus}</TableCell>
                                    <TableCell>
                                        <Button to={`/admin/event/details/${event.eventId}`}>
                                            詳情
                                        </Button>
                                    </TableCell>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td
                                    colSpan="6"
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

export default EventManagement;

// 重用的按鈕組件
const Button = ({ to, children, className = "" }) => (
    <Link
        to={to}
        className={`bg-teal-500 hover:bg-teal-600 text-white py-1 px-3 rounded-md transition-colors ${className}`}
    >
        {children}
    </Link>
);

// 表格單元格組件
const TableCell = ({ children, className = "" }) => (
    <td className={`border border-gray-700 px-4 py-2 ${className}`}>{children}</td>
);

// 表格標題單元格組件
const TableHeader = ({ children }) => (
    <th className="border border-gray-700 px-4 py-2 bg-gray-800 font-bold">
        {children}
    </th>
);