import React, { useEffect, useState } from "react";
import apiClient from "../api/apiClient";

const Member = () => {
    const [members, setMembers] = useState([]); // 儲存從後端獲取的資料
    const [loading, setLoading] = useState(true); // 加載狀態
    const [error, setError] = useState(null); // 錯誤訊息


    useEffect(() => {

        const fetchMembers = async () => {
        
            try {
                const response = await apiClient.get("http://localhost:8080/user/all"); // 請求後端 API
                console.log("Members data:", response.data);
                setMembers(response.data.data); // 將回應資料存入 state
                
            } catch (err) {
                setError("Failed to fetch members."); // 捕獲錯誤
                console.error(err);
            } finally {
                setLoading(false); // 結束加載
            }
        };

        fetchMembers(); // 呼叫函式
    }, []); // 只在組件掛載時執行一次

    // 當資料正在加載時顯示
    if (loading) {
        return <div>Loading...</div>;
    }

    
    // 當發生錯誤時顯示
    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className="p-4">
            <h2 className="text-2xl font-bold mb-4">會員列表</h2>
            <table className="table-auto border-collapse border border-gray-400 w-full">
                <thead>
                    <tr>
                        <th className="border border-gray-300 px-4 py-2">ID</th>
                        <th className="border border-gray-300 px-4 py-2">名稱</th>
                        <th className="border border-gray-300 px-4 py-2">手機</th>
                        <th className="border border-gray-300 px-4 py-2">電子郵件</th>
                        <th className="border border-gray-300 px-4 py-2">出生日期</th>
                        <th className="border border-gray-300 px-4 py-2">認證</th>

                    </tr>
                </thead>
                <tbody>
                    {members.map((member) => (
                        <tr key={member.userId}>
                            <td className="border border-gray-300 px-4 py-2">{member.userId}</td>
                            <td className="border border-gray-300 px-4 py-2">{member.userName}</td>
                            <td className="border border-gray-300 px-4 py-2">{member.userPhone}</td>
                            <td className="border border-gray-300 px-4 py-2">{member.userEmail}</td>
                            <td className="border border-gray-300 px-4 py-2">{member.userBirthDate}</td>
                            <td className="border border-gray-300 px-4 py-2">  {member.userIsVerified ? "有認證" : "沒認證"}
                            </td>

                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Member;