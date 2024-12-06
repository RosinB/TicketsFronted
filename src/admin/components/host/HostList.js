import React, { useState, useEffect } from "react";
import LoadingSpinner from "../../../components/modal/LoadingSpinner";
import ApiService from "../../../api/ApiService";
import { Pencil, Check, X } from "lucide-react";

function HostList() {
    const [loading, setLoading] = useState(true);
    const [allHost, setAllHost] = useState([]);
    const [editingHost, setEditingHost] = useState(null);
    const [editData, setEditData] = useState({});

    const fetchHosts = async () => {
        try {
            const response = await ApiService.fetchAdminHost();
            setAllHost(response.data.data);
        } catch (error) {
            console.log("查詢失敗" + error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchHosts();
    }, []);

    const handleEditClick = (host) => {
        setEditingHost(host.hostId);
        setEditData({ ...host });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const hostData = {
        hostId: editingHost,
        hostName: editData.hostName,
        hostContact: editData.hostContact,
        hostDescription: editData.hostDescription,
    };

    const handleSave = async () => {
        try {
            await ApiService.updateHost(hostData);
            setAllHost((prev) =>
                prev.map((host) =>
                    host.hostId === editingHost ? { ...host, ...editData } : host
                )
            );
            setEditingHost(null);
        } catch (error) {
            console.log("更新失敗", error);
        }
    };

    if (loading) {
        return <LoadingSpinner />;
    }

    return (
        <div className="text-white p-6 -mt-6">
            {/* <h1 className="text-2xl font-bold mb-6">主辦資訊列表</h1> */}
            <div className="overflow-x-auto">
                <table className="table-auto w-full text-left text-base border-collapse border border-gray-700">
                    <TableHeader />
                    <tbody>
                        {allHost.length > 0 ? (
                            allHost.map((host,index) => (
                                <tr
                                    key={index}
                                    className="bg-gray-900 hover:bg-gray-800 transition"
                                >
                                    <TableCell>{host.hostId}</TableCell>
                                    <TableCell>{host.hostName}</TableCell>
                                    <TableCell>{host.hostContact}</TableCell>
                                    <TableCell>{host.hostDescription}</TableCell>
                                    <TableCell>
                                        <Button
                                            onClick={() => handleEditClick(host)}
                                            className="bg-blue-500 hover:bg-blue-600"
                                        >
                                            <Pencil className="w-5 h-5 mr-2" />
                                            修改
                                        </Button>
                                    </TableCell>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td
                                    colSpan="5"
                                    className="text-center border border-gray-700 px-4 py-3"
                                >
                                    無主辦方數據
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* 編輯表單 */}
            {editingHost && (
                <div className="mt-8 bg-gray-800 p-6 rounded-lg shadow-xl">
                    <h3 className="text-lg font-bold text-white mb-4">編輯主辦資訊</h3>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-gray-300 mb-2">主辦名稱</label>
                            <input
                                type="text"
                                name="hostName"
                                value={editData.hostName}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 rounded bg-gray-700 text-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-300 mb-2">聯絡資訊</label>
                            <input
                                type="text"
                                name="hostContact"
                                value={editData.hostContact}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 rounded bg-gray-700 text-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-300 mb-2">敘述</label>
                            <textarea
                                name="hostDescription"
                                value={editData.hostDescription}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 rounded bg-gray-700 text-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
                                rows={4}
                            />
                        </div>
                        <div className="flex justify-end space-x-4">
                            <Button
                                onClick={() => setEditingHost(null)}
                                className="bg-gray-600 hover:bg-gray-700"
                            >
                                <X className="w-5 h-5 mr-2" />
                                取消
                            </Button>
                            <Button onClick={handleSave}>
                                <Check className="w-5 h-5 mr-2" />
                                儲存
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default HostList;

const Button = ({ onClick, children, className = "" }) => (
    <button
        onClick={onClick}
        className={`flex items-center justify-center bg-teal-500 hover:bg-teal-600 text-white py-2 px-4 rounded-md transition ${className}`}
    >
        {children}
    </button>
);

const TableCell = ({ children, className = "" }) => (
    <td className={`border border-gray-700 px-4 py-3 ${className}`}>
        {children}
    </td>
);

const TableHeader = () => (
    <thead className="bg-gray-800">
        <tr>
            <th className="border border-gray-700 px-4 py-3 font-medium">編號</th>
            <th className="border border-gray-700 px-4 py-3 font-medium">主辦名稱</th>
            <th className="border border-gray-700 px-4 py-3 font-medium">聯絡資訊</th>
            <th className="border border-gray-700 px-4 py-3 font-medium">敘述</th>
            <th className="border border-gray-700 px-4 py-3 font-medium">操作</th>
        </tr>
    </thead>
);