import React, { useEffect, useState } from "react";
import apiClient from "../api/apiClient";

const UserUpdate = () => {
    const [User, setUser] = useState({}); // 從後端獲取的資料
    const [userPhone, setUserPhone] = useState(""); // 電話
    const [userEmail, setUserEmail] = useState(""); // 電子郵件
    const [userName , setUserName]=useState("")
    const [userBirthDate , setUserBirthDate]=useState("")

    const [message, setMessage] = useState(null); // 提示訊息
    const [fieldErrors, setFieldErrors] = useState({});
    const errors = {};

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await apiClient.get("http://localhost:8080/user/userUpdate"); 
                console.log("user data:", response.data);

                const userdata=response.data.data;
                setUser(userdata); // 將回應資料存入 state
                setUserPhone(userdata.userPhone || "");
                setUserEmail(userdata.userEmail || "");
                setUserName(userdata.userName || "")
                setUserBirthDate(userdata.userBirthDate || "")

            }  catch (err) {
                console.error(err);
            } 
        };
        fetchUser(); 
    }, []); 


    const handleSubmit=async(e)=>{
        e.preventDefault();

         // 驗證電話號碼
        if (!/^\d{10}$/.test(userPhone))  errors.userPhone = "電話必須是 10 位數字";
        
        // 如果有錯誤，更新錯誤狀態並阻止提交
        if (Object.keys(errors).length > 0) 
        {
            setFieldErrors(errors);
            setMessage("更新失敗");
            return;
        }
        try{     
                const response =await apiClient.post(
                                                    "http://localhost:8080/user/userUpdate",
                                                    {userName,userPhone,userEmail,userBirthDate} )
                    console.log(response);
                    setMessage("更新成功");}
        catch(err){
                console.error(err);}

        }




    return (    
        <div className="bg-white shadow-md rounded-lg p-8 max-w-lg mx-auto">
            <h2 className="text-3xl font-bold text-center text-gray-800">會員更新</h2>

            {/* message有值才會執行後面 */}
            {message && (
                <p className="text-center text-sm text-red-500 mb-4">{message}</p>
            )}


            <form className="mt-6" onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-semibold mb-2">
                        帳號
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
                        密碼
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
                        電話
                    </label>
                    <input
                        type="text"
                        className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                        value={userPhone}
                        onChange={(e) => {
                            const value = e.target.value;
                
                            // 限制只能輸入數字且最多 10 位
                            if (/^\d{0,10}$/.test(value)) {
                                setUserPhone(value);
                
                                // 即時判斷是否滿足條件
                                if (value.length === 10) {
                                    setFieldErrors((prev) => ({ ...prev, userPhone: null })); // 清除錯誤訊息
                                } else {
                                    setFieldErrors((prev) => ({
                                        ...prev,
                                        userPhone: "電話必須是 10 位數字",
                                    })); // 顯示錯誤訊息
                                }
                            }
                        }}
                    />
                    {fieldErrors.userPhone && <p className="text-red-500 text-sm">{fieldErrors.userPhone}</p>}

                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-semibold mb-2">
                        電子信箱
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
                        身分證
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
                        出生日期
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