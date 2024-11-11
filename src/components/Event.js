import axios from "axios";
import React, { useEffect } from "react";

const Event = ({ events }) => {
    useEffect=async(s)=>{
                    const response= await axios.get()




                    }











    return (
        <div className="p-6 bg-gray-100 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-gray-700 mb-4">活動資訊</h2>
            <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                <thead>
                    <tr>
                        <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-sm font-semibold text-gray-600">
                            歌手名字
                        </th>
                        <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-sm font-semibold text-gray-600">
                            活動名稱
                        </th>
                        <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-sm font-semibold text-gray-600">
                            活動日期
                        </th>
                        <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-sm font-semibold text-gray-600">
                            活動場地
                        </th>
                        <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-sm font-semibold text-gray-600">
                            活動人數
                        </th>
                    </tr>
                </thead>
                <tbody>
                   
                        
                            {/* <td className="px-6 py-4 text-sm text-gray-700">{event.performer}</td>
                            <td className="px-6 py-4 text-sm text-gray-700">{event.name}</td>
                            <td className="px-6 py-4 text-sm text-gray-700">
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-700">{event.location}</td>
                            <td className="px-6 py-4 text-sm text-gray-700">{event.capacity}</td> */}
                     
                  
                </tbody>
            </table>
            </div>)
        }
    


export default Event;
