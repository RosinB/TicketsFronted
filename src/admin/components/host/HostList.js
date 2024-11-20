import React, { useState, useEffect } from "react";
import LoadingSpinner from '../../../components/ui/LoadingSpinner'
import ApiService from "../../../api/ApiService";

function HostList() {
    const [loading, setLoading] = useState(true);
    const [AllHost, setAllHost] = useState([]);
    const [editingHost, setEditingHost] = useState(null); // 當前編輯的主辦
    const [editData, setEditData] = useState({}); // 表單數據

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
        setEditingHost(host.hostId); // 設置當前編輯的主辦
        setEditData({ ...host }); // 初始化表單數據
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
        hostDescription: editData.hostDescription
    }


    const handleSave = async () => {
        try {
            const response= await ApiService.updateHost(hostData);
            console.log(response);
            setAllHost((prev) =>
                prev.map((host) =>
                    host.hostId === editingHost ? { ...host, ...editData } : host
                )
            );

            setEditingHost(null); // 關閉編輯模式
        } catch (error) {
            console.log("更新失敗", error);
        }
    };

    if (loading) {
        return <LoadingSpinner />;
    }

    return (
        <div className="bg-gray-900 shadow-lg max-w-4xl text-gray-200 ">
            <h2 className="text-xl font-bold text-white mb-4">主辦資訊列表</h2>
            <table className="w-full text-left border-collapse border border-gray-600">
                <thead>
                    <tr className="bg-gray-800 text-gray-300">
                        <th className="border border-gray-600 px-4 py-2 text-center">編號</th>
                        <th className="border border-gray-600 px-4 py-2">主辦名稱</th>
                        <th className="border border-gray-600 px-4 py-2">聯絡資訊</th>
                        <th className="border border-gray-600 px-4 py-2">敘述</th>
                        <th className="border border-gray-600 px-4 py-2 text-center">操作</th>
                    </tr>
                </thead>
                <tbody>
                    {AllHost.map((host, index) => (
                        <tr
                            key={host.hostId}
                            className={index % 2 === 0 ? "bg-gray-700" : "bg-gray-800"}
                        >
                            <td className="border border-gray-600 px-4 py-2 text-center">
                                {host.hostId}
                            </td>
                            <td className="border border-gray-600 px-4 py-2">{host.hostName}</td>
                            <td className="border border-gray-600 px-4 py-2">{host.hostContact}</td>
                            <td className="border border-gray-600 px-4 py-2">
                                {host.hostDescription}
                            </td>
                            <td className="border border-gray-600 px-4 py-2 text-center">
                                <button
                                    onClick={() => handleEditClick(host)}
                                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition"
                                >
                                    修改
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* 編輯表單 */}
            {editingHost && (
                <div className="mt-6 bg-gray-800 p-4 rounded shadow-lg">
                    <h3 className="text-lg font-bold text-white mb-4">編輯主辦資訊</h3>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-gray-300">主辦名稱</label>
                            <input
                                type="text"
                                name="hostName"
                                value={editData.hostName}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 rounded bg-gray-700 text-gray-200"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-300">聯絡資訊</label>
                            <input
                                type="text"
                                name="hostContact"
                                value={editData.hostContact}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 rounded bg-gray-700 text-gray-200"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-300">敘述</label>
                            <textarea
                                name="hostDescription"
                                value={editData.hostDescription}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 rounded bg-gray-700 text-gray-200"
                                rows={4}
                            ></textarea>
                        </div>
                        <div className="flex justify-end space-x-4">
                            <button
                                onClick={() => setEditingHost(null)}
                                className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600 transition"
                            >
                                取消
                            </button>
                            <button
                                onClick={handleSave}
                                className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition"
                            >
                                儲存
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default HostList;
