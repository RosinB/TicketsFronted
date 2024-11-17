
import React, { useEffect, useState } from "react";
import ApiService from "../../api/ApiService";
import LoadingSpinner from "../../components/LoadingSpinner";

function AdminHosts() {

    const[loading ,setLoading]=useState(true);
    const [hostData, setHostData] = useState({
        hostName: "",
        hostContact: "",
        hostDescription: "",
    });
    const[AllHost,setAllHost]=useState([]);

    const fetchHosts=async()=>{

        try {
            const response = await ApiService.fetchAdminHost();
            setAllHost(response.data.data);
        } catch (error) {
            console.log("查詢失敗"+error);
        }finally{
            setLoading(false);
        }


    }
    useEffect(()=>{
        fetchHosts();


    },[]);
    console.log(AllHost);
    
       
    if(loading){
        return <LoadingSpinner></LoadingSpinner>
    }

  






    const handleChange =(e)=>{
        const{name,value}=e.target;
        setHostData(
            {
                ...hostData,
                [name]:value
            });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
    };



    // 靜態主辦資訊
    const organizers = [
        {
            id: 1,
            host_name: "主辦單位 A",
            contact_info: "a@example.com",
            description: "這是主辦單位 A 的描述。",
        },
        {
            id: 2,
            host_name: "主辦單位 B",
            contact_info: "b@example.com",
            description: "這是主辦單位 B 的描述。",
        },
        {
            id: 3,
            host_name: "主辦單位 C",
            contact_info: "c@example.com",
            description: "這是主辦單位 C 的描述。",
        },
    ];

    
    return (
        <div className="min-h-screen flex flex-col items-center  ">
            
        {/* 表單區域 */}
        <div className="bg-white p-8  shadow-lg  shadow-xl max-w-md w-full">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">新增主辦單位</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                {/* 主辦名稱 */}
                <div>
                    <label  className="block text-lg  font-medium ">
                        主辦名稱:
                    </label>
                    <input
                        type="text"
                        name="hostName"
                        value={hostData.hostName} 
                        onChange={handleChange} 
                        placeholder="輸入主辦名稱"
                        className="mt-1 block w-full border-gray-300 shadow-sm sm:text-base border-2 "
                        required
                    />
                </div>
                <div>
                    <label  className="block text-sm font-medium text-gray-700">
                        主辦聯絡資訊
                    </label>
                    <input
                        type="text"
                        name="hostContact"
                        value={hostData.hostContact}
                        onChange={handleChange}
                        placeholder="輸入聯絡資訊（例如電話或電子郵件）"
                        className="mt-1 block w-full border-gray-300 shadow-sm sm:text-base border-2 "
                        required
                    />
                </div>
    
                {/* 主辦敘述 */}
                <div>
                    <label  className="block text-sm font-medium text-gray-700">
                        主辦敘述
                    </label>
                    <textarea
                        name="hostDescription"
                        value={hostData.hostDescription}
                        onChange={handleChange}
                        placeholder="輸入主辦相關敘述或備註"
                        className="mt-1 block w-full border-gray-300 shadow-sm sm:text-base border-2 "
                        rows={4}
                    ></textarea>
                </div>
    
                {/* 提交按鈕 */}
                <button
                    type="submit"
                    className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition"
                >
                    新增主辦單位
                </button>
            </form>
        </div>
    
        {/* 靜態主辦資訊表格 */}
        <div className="bg-white p-8 mt- shadow-lg max-w-4xl w-full ">
            <h2 className="text-xl font-bold text-gray-800 mb-4">主辦資訊列表</h2>
            <table className="w-full text-left border-collapse border border-gray-300">
                <thead>
                    <tr className="bg-gray-200">
                        <th className="border border-gray-300 px-4 py-2">編號</th>
                        <th className="border border-gray-300 px-4 py-2">主辦名稱</th>
                        <th className="border border-gray-300 px-4 py-2">聯絡資訊</th>
                        <th className="border border-gray-300 px-4 py-2">敘述</th>
                    </tr>
                </thead>
                <tbody>
                    {organizers.map((organizer) => (
                        <tr key={organizer.id}>
                            <td className="border border-gray-300 px-4 py-2">{organizer.id}</td>
                            <td className="border border-gray-300 px-4 py-2">{organizer.host_name}</td>
                            <td className="border border-gray-300 px-4 py-2">{organizer.contact_info}</td>
                            <td className="border border-gray-300 px-4 py-2">{organizer.description}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
    
    );



}
export default AdminHosts;