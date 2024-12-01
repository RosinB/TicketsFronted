import { useState } from "react";
import ApiService from "../../../api/ApiService";
import { PlusCircle } from "lucide-react";

function HostAdd() {
    const [hostData, setHostData] = useState({
        hostName: "",
        hostContact: "",
        hostDescription: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setHostData({
            ...hostData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await ApiService.postAdminHost(hostData);
            console.log(response.data.data);
        } catch (error) {
            console.log("新增失敗", error);
        }
    };

    return (
        <div className="bg-gray-800 text-gray-200 p-8 shadow-lg max-w-md w-full mx-auto rounded-lg">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <PlusCircle className="w-6 h-6 text-blue-500" />
                新增主辦單位
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-gray-300 text-lg font-medium">
                        主辦名稱:
                    </label>
                    <input
                        type="text"
                        name="hostName"
                        value={hostData.hostName}
                        onChange={handleChange}
                        placeholder="輸入主辦名稱"
                        className="mt-1 block w-full bg-gray-700 border-gray-600 rounded text-gray-200 p-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                        required
                    />
                </div>
                <div>
                    <label className="block text-gray-300 text-lg font-medium">
                        主辦聯絡資訊:
                    </label>
                    <input
                        type="text"
                        name="hostContact"
                        value={hostData.hostContact}
                        onChange={handleChange}
                        placeholder="輸入聯絡資訊（例如電話或電子郵件）"
                        className="mt-1 block w-full bg-gray-700 border-gray-600 rounded text-gray-200 p-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                        required
                    />
                </div>
                <div>
                    <label className="block text-gray-300 text-lg font-medium">
                        主辦敘述:
                    </label>
                    <textarea
                        name="hostDescription"
                        value={hostData.hostDescription}
                        onChange={handleChange}
                        placeholder="輸入主辦相關敘述或備註"
                        className="mt-1 block w-full bg-gray-700 border-gray-600 rounded text-gray-200 p-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                        rows={4}
                    ></textarea>
                </div>
                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white py-3 px-4 rounded-md hover:bg-blue-600 transition flex items-center justify-center gap-2"
                >
                    <PlusCircle className="w-5 h-5" />
                    新增主辦單位
                </button>
            </form>
        </div>
    );
}

export default HostAdd;