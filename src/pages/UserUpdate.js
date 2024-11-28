import React, { useEffect, useState } from "react";
import ApiService from "../api/ApiService";

function UserUpdate() {

    const [user, setUser] = useState({
        userName: "",
        userPhone: "",
        userEmail: "",
        userBirthDate: "",
        userIsVerified: false,
        userIdCard: ""
    });


    const [message, setMessage] = useState(null); // 提示訊息
    const [fieldErrors, setFieldErrors] = useState({});



    //抓取使用者要更新的資料
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await ApiService.fetchUserUpdate();

                const userdata = response.data.data;

                setUser({
                        userName: userdata.userName || "",
                        userPhone: userdata.userPhone || "",
                        userEmail: userdata.userEmail || "",
                        userBirthDate: userdata.userBirthDate || "",
                        userIsVerified: userdata.userIsVerified || false,
                        userIdCard: userdata.userIdCard || ""
                });

            } catch (err) {
                console.error("獲取用戶資料失敗：", err);
            }
        };
        fetchUser();
    }, []);

    //登入的post傳送區
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const submitData=
            {
                userName     :   user.userName,
                userPhone    :   user.userPhone,
                userEmail    :   user.userEmail,
                userBirthDate:   user.userBirthDate
            }
            
            const response = await ApiService.updateUser(submitData);
            console.log(response);
            setMessage("更新成功");
        }
        catch (err) {
            console.error(err);
            setMessage("更新失敗，請稍後再試");

            // 伺服器回傳的錯誤中提取錯誤資訊，並將其設定到狀態中
            setFieldErrors(err.response?.data?.data || {});

        }

    }
    //更新資料的正規表達OnChange
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        const validationRules = {
            userName: /^[A-Za-z\d]{0,10}$/,  // 大小寫 最多10位
            userPhone: /^\d{0,10}$/,        // 10位數字
        };
    
        if (validationRules[name]) {
            const processedValue = name === "userIdCard" ? value.toUpperCase() : value;
            // 如果驗證通過則更新
            if (validationRules[name].test(processedValue)) {

                setUser((prevUser) => ({ ...prevUser, [name]: processedValue }));
            }
        } else {
            setUser((prevUser) => ({ ...prevUser, [name]: value }));
        }
    };
    


    return (
        <div className="bg-white shadow-md rounded-lg p-8 max-w-lg mx-auto">
            <h2 className="text-3xl font-bold text-center text-gray-800">會員更新</h2>

            {/* message有值才會執行後面 */}
            {message && (
                <p
                    className={`text-center text-sm font-semibold mb-4 ${message.includes("成功") ? "text-green-500" : "text-red-500"
                        }`}
                >
                    {message}
                </p>
            )}


            <form className="mt-6" onSubmit={handleSubmit}>
                <InputField 
                            type="text"
                            label="帳號" 
                            value={user.userName || ""} 
                            readOnly />
                <InputField 
                            type="password"
                            label="密碼" 
                            value="123456789" 
                            readOnly 
                            />
                <InputField 
                            type="text"
                            name="userPhone"
                            label="電話" 
                            value={user.userPhone} 
                            onChange={handleInputChange} 
                            errorMessage={fieldErrors.userPhone} />
                <InputField 
                            type="email"
                            name="userEmail"
                            label="電子信箱" 
                            value={user.userEmail} 
                            onChange={handleInputChange} 
                            />
                <InputField 
                            type="text"
                            label="身分證" 
                            value={user.userIdCard || ""} 
                            readOnly />    
                <InputField     
                            type="date"
                            name="userBirthDate"
                            label="出生日期" value={user.userBirthDate} 
                            onChange={handleInputChange}    />



                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-semibold mb-2">
                        信箱是否認證
                    </label>
                    <div className="flex items-center space-x-4">
                        <input
                            type="text"
                            className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                            value={user.userIsVerified ? "有認證" : "沒認證"}
                            onChange={(e) => setUser({...user,userIsVerified: e.target.value})}
                        />

                      
                    </div>
                </div>
                <button className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition">
                    更新資料
                </button>

            </form>









        </div>
    );
};



const InputField = ({ label, name ,value, onChange, type , readOnly = false, errorMessage }) => {
    return (
        <div className="mb-4">
            <label className="block text-gray-700 text-sm font-semibold mb-2">{label}</label>
            <input
                type={type}
                name={name}
                className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                value={value}
                onChange={onChange}
                readOnly={readOnly}
            />
            {errorMessage && <p className="text-red-500 text-sm">{errorMessage}</p>}
        </div>
    );
};
export default UserUpdate;





    // const handleVerification = () => {
    //     // try {
    //     //     const response = await ApiService.verifyUser({
    //     //         userIdCard: User.userIdCard,
    //     //         verificationCode,
    //     //     });
    //     //     console.log(response);
    //     //     alert("認證成功！");
    //     setUserVerified(true); // 更新認證狀態
    //     setShowModal(false); // 關閉模態窗口
    //     // } catch (err) {
    //     //     console.error("認證失敗:", err);
    //     //     alert("認證失敗，請稍後再試。");
    //     // }
    // };
