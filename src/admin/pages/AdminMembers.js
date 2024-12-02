import React, { useEffect, useState } from "react";
import ApiService from "../../api/ApiService";
import { User, Check, X, Search } from "lucide-react";

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
    const [searchTerm, setSearchTerm] = useState(''); // 新增搜尋狀態

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

    // 過濾會員列表（結合搜尋和驗證狀態）
    const filteredMembers = members.filter(member => {
        const matchesSearch = member.userName.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesVerification = verificationFilter === verificationOptions.all
            ? true
            : verificationFilter === verificationOptions.verified
                ? member.userIsVerified
                : !member.userIsVerified;

        return matchesSearch && matchesVerification;
    });

    if (loading) return <div className="text-white">Loading...</div>;
    if (error) return <div className="text-red-500">Error: {error}</div>;

    return (
        <div className="container p-6 bg-gray-900 text-white min-h-screen">
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                    <User className="w-8 h-8 text-teal-500" />
                    會員列表
                </h2>
                <div className="flex items-center gap-4">
                    {/* 搜尋欄位 */}
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="搜尋會員名稱..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="bg-gray-800 border border-gray-700 px-4 py-2 pl-10 text-white rounded-lg
                                    focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent
                                    w-64 transition-all duration-200"
                        />
                        <Search className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
                    </div>
                    {/* 驗證狀態過濾器 */}
                    <select
                        value={verificationFilter}
                        onChange={(e) => setVerificationFilter(e.target.value)}
                        className="bg-gray-800 border border-gray-700 px-4 py-2 text-white rounded-lg
                                focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
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