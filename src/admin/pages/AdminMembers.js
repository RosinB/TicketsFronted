import React, { useEffect, useState } from "react";
import ApiService from "../../api/ApiService";
import { User, Check, X } from "lucide-react";

const Member = () => {
    const verificationOptions = {
        all: "all",
        verified: "verified",
        unverified: "unverified"
    };

    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [verificationFilter, setVerificationFilter] = useState(verificationOptions.all);

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

    const filteredMembers = members.filter(member => {
        switch (verificationFilter) {
            case verificationOptions.verified:
                return member.userIsVerified;
            case verificationOptions.unverified:
                return !member.userIsVerified;
            default:
                return true;
        }
    });

    if (loading) return <div className="text-white">Loading...</div>;
    if (error) return <div className="text-red-500">Error: {error}</div>;

    return (
        <div className="container p-6 bg-gray-900 text-white min-h-screen">
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                    <User className="w-6 h-6 text-blue-500" />
                    會員列表
                </h2>
                <div className="flex gap-4">
                    <select
                        value={verificationFilter}
                        onChange={(e) => setVerificationFilter(e.target.value)}
                        className="bg-gray-800 border border-gray-700 px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value={verificationOptions.all}>全部會員</option>
                        <option value={verificationOptions.verified}>已驗證會員</option>
                        <option value={verificationOptions.unverified}>未驗證會員</option>
                    </select>
                </div>
            </div>
            <div className="border border-gray-700 rounded-lg overflow-hidden">
                <table className="table-auto border-collapse w-full text-gray-200">
                    <thead className="bg-gray-800 text-gray-300">
                        <tr>
                            <TableHeader>ID</TableHeader>
                            <TableHeader>名稱</TableHeader>
                            <TableHeader>手機</TableHeader>
                            <TableHeader>電子郵件</TableHeader>
                            <TableHeader>身分證</TableHeader>
                            <TableHeader>出生日期</TableHeader>
                            <TableHeader>認證</TableHeader>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredMembers.map((member, index) => (
                            <tr
                                key={member.userId}
                                className={`${index % 2 === 0 ? "bg-gray-800" : "bg-gray-700"} hover:bg-gray-600 transition`}
                            >
                                <TableCell>{member.userId}</TableCell>
                                <TableCell>{member.userName}</TableCell>
                                <TableCell>{member.userPhone}</TableCell>
                                <TableCell>{member.userEmail}</TableCell>
                                <TableCell>{member.userIdCard}</TableCell>
                                <TableCell>{member.userBirthDate}</TableCell>
                                <TableCell>
                                    {member.userIsVerified ? (
                                        <div className="flex items-center justify-center">
                                            <Check className="w-5 h-5 text-green-500" />
                                            <span className="ml-2">有認證</span>
                                        </div>
                                    ) : (
                                        <div className="flex items-center justify-center">
                                            <X className="w-5 h-5 text-red-500" />
                                            <span className="ml-2">未認證</span>
                                        </div>
                                    )}
                                </TableCell>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Member;

const TableHeader = ({ children }) => (
    <th className="border border-gray-600 px-4 py-3 font-medium text-left">{children}</th>
);

const TableCell = ({ children }) => (
    <td className="border border-gray-600 px-4 py-3 text-left">{children}</td>
);