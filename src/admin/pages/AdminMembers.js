import React, { useEffect, useState } from "react";
import ApiService from "../../api/ApiService";

const Member = () => {
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchMembers = async () => {
            try {
                const response = await ApiService.fetchAllMember();
                setMembers(response.data.data);
            } catch (err) {
                setError("用戶資料讀取失敗");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchMembers();
    }, []);


    if (loading) return <div className="text-white">Loading...</div>;
    

    if (error) {
        return <div className="text-red-500">Error: {error}</div>;
    }

    
    return (
        <div className="p-4 bg-gray-900 text-white min-h-screen">
            <h2 className="text-2xl font-bold mb-4">會員列表</h2>
            <table className="table-auto border-collapse border border-gray-500 w-full text-gray-200">
                <thead>
                    <tr className="bg-gray-900 text-gray-300">
                        <th className="border border-gray-500 px-4 py-2">ID</th>
                        <th className="border border-gray-500 px-4 py-2">名稱</th>
                        <th className="border border-gray-500 px-4 py-2">手機</th>
                        <th className="border border-gray-500 px-4 py-2">電子郵件</th>
                        <th className="border border-gray-500 px-4 py-2">身分證</th>
                        <th className="border border-gray-500 px-4 py-2">出生日期</th>
                        <th className="border border-gray-500 px-4 py-2">認證</th>
                    </tr>
                </thead>
                <tbody>
                    {members.map((member, index) => (
                        <tr
                            key={member.userId}
                            className={index % 2 === 0 ? "bg-gray-800" : "bg-gray-700"}
                        >
                            <td className="border border-gray-500 px-4 py-2">{member.userId}</td>
                            <td className="border border-gray-500 px-4 py-2">{member.userName}</td>
                            <td className="border border-gray-500 px-4 py-2">{member.userPhone}</td>
                            <td className="border border-gray-500 px-4 py-2">{member.userEmail}</td>
                            <td className="border border-gray-500 px-4 py-2">{member.userIdCard}</td>
                            <td className="border border-gray-500 px-4 py-2">{member.userBirthDate}</td>
                            <td className="border border-gray-500 px-4 py-2">
                                {member.userIsVerified ? "有認證" : "沒認證"}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Member;


