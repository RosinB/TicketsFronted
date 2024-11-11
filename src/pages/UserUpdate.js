import React, { useEffect, useState } from "react";
import apiClient from "../api/ApiClient";

function UserUpdate  () {
    const [User, setUser] = useState({}); // 從後端獲取的資料
    const [userPhone, setUserPhone] = useState(""); // 電話
    const [userEmail, setUserEmail] = useState(""); // 電子郵件
    const [userName , setUserName]=useState("")
    const [userBirthDate , setUserBirthDate]=useState("")

    const [message, setMessage] = useState(null); // 提示訊息
    const [fieldErrors, setFieldErrors] = useState({});

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await apiClient.get("/user/userUpdate"); 

                const userdata=response.data.data;
                setUser(userdata); // 將回應資料存入 state
                setUserPhone(userdata.userPhone || "");
                setUserEmail(userdata.userEmail || "");
                setUserName(userdata.userName || "")
                setUserBirthDate(userdata.userBirthDate || "")

            }  catch (err) {
                console.error("獲取用戶資料失敗：",err);
            } 
        };
        fetchUser(); 
    }, []); 


    const handleSubmit=async(e)=>{
        e.preventDefault();

        try{     
                const response =await apiClient.post("/user/userUpdate",
                                                    {userName,userPhone,userEmail,userBirthDate} )
                    console.log(response);
                    setMessage("更新成功");}
        catch(err){
                console.error(err);
                setMessage("更新失敗，請稍後再試");

                // 伺服器回傳的錯誤中提取錯誤資訊，並將其設定到狀態中
                setFieldErrors(err.response?.data?.data || {});
            
            }

        }




    return (    
        <div className="bg-white shadow-md rounded-lg p-8 max-w-lg mx-auto">
            <h2 className="text-3xl font-bold text-center text-gray-800">會員更新</h2>

            {/* message有值才會執行後面 */}
            {message && (
                <p
                    className={`text-center text-sm font-semibold mb-4 ${
                        message.includes("成功") ? "text-green-500" : "text-red-500"
                    }`}
                >
                    {message}
                </p>
            )}


            <form className="mt-6" onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-semibold mb-2">
                        帳號:
                    </label>
                    <input
                        type="text"
                        className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                        value={User.userName || ""}
                        readOnly
                    />

                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-semibold mb-2">
                        密碼:
                    </label>
                    <input
                        type="password"
                        className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                        value={123456789}
                        readOnly
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-semibold mb-2">
                        電話:
                    </label>
                    <input
                        type="text"
                        className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                        value={userPhone}
                        onChange={(e) => {setUserPhone(e.target.value)}}
                    />
                    {fieldErrors.userPhone && <p className="text-red-500 text-sm">{fieldErrors.userPhone}</p>}

                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-semibold mb-2">
                        電子信箱:
                    </label>
                    <input
                        type="email"
                        className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                        value={userEmail}
                        onChange={(e) => setUserEmail(e.target.value)}
                    />

                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-semibold mb-2">
                        身分證:
                    </label>
                    <input
                        type="text"
                        className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                        value={User.userIdCard || ""}

                        readOnly
                    />

                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-semibold mb-2">
                        出生日期:
                    </label>
                    <input
                        type="date"
                        className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                        value={User.userBirthDate|| ""}
                        onChange={(e) => setUserBirthDate(e.target.value)}

                        />
                </div>
                <button className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition">
                更新資料
                </button>
            </form>
        </div>
    );
};

export default UserUpdate;