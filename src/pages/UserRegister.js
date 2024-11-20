import React, { useState } from "react";
import ApiService from "../api/ApiService";
import { useNavigate } from "react-router-dom"; // 引入 useNavigate





function Register() {
    
    const [user, setUser] = useState({
        userName: "",
        userPhone: "",
        userEmail: "",
        password: "",
        userBirthDate: "",
        userIdCard: ""
    });
    
    const [fieldErrors, setFieldErrors] = useState({});
    const [successMessage, setSuccessMessage] = useState("");
    const navigate = useNavigate(); 

    //註冊帳號的data 要post的
    const submitData=
    {
        userName        :   user.userName,
        userPhone       :   user.userPhone,
        userEmail       :   user.userEmail,
        password        :   user.password,
        userBirthDate   :   user.userBirthDate,
        userIdCard      :   user.userIdCard
    }


    //註冊資料給後端的post
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            const response = await ApiService.registerUser(submitData);
            console.log(response.data.data+"註冊成功");
            setSuccessMessage("註冊成功，一秒後跳轉到登入頁面");
            setTimeout(() => {
                navigate("/login");
            }, 1000);


        } catch (err) {
            if (err.response) {
                setFieldErrors(err.response.data.data || {});
                setSuccessMessage("註冊失敗");
            } else {
                console.error("這是請求失敗（非後端錯誤）:", err);
            }
        }
    };

    //註冊資料的正規表達OnChange
    const handleInputChange = (e) => {
        const { name, value } = e.target;

        const validationRules = {
            userName: /^[A-Za-z\d]{0,10}$/,  // 大小寫 最多可以輸入10位
            userPhone: /^\d{0,10}$/,        //  10 位數字
            userIdCard: /^[A-Z]{0,1}\d{0,9}$/ 
        };


        if (validationRules[name]) {
            const processedValue = name === "userIdCard" ? value.toUpperCase() : value;
            if (validationRules[name].test(processedValue)) {
                setUser((prevUser) => ({ ...prevUser, [name]: processedValue }));
        }
        } else {
            setUser((prevUser) => ({ ...prevUser, [name]: value }));
        } 
    };
    



    return (
        <div className="bg-white shadow-md rounded-lg p-8 max-w-lg mx-auto -mt-4">
            <h2 className="text-3xl font-bold text-center text-gray-800">會員註冊</h2>
            {successMessage && <div className="text-green-500 text-center">{successMessage}</div>}

            <form className="mt-2" onSubmit={handleSubmit}>
                <InputField
                    label="帳號:(字符數量4~10)"
                    type="text"
                    name="userName"
                    value={user.userName}
                    onChange={handleInputChange}
                    placeholder="請輸入帳號"
                    errorMessage={fieldErrors.userName}
                    required
                />
                <InputField
                    label="密碼:"
                    type="password"
                    name="password"
                    value={user.password}
                    onChange={handleInputChange}
                    placeholder="請輸入密碼"
                    required
                />
                <InputField
                    label="電話:(10位數)"
                    type="tel"
                    name="userPhone"
                    value={user.userPhone}
                    onChange={handleInputChange}
                    placeholder="請輸入電話"
                    errorMessage={fieldErrors.userPhone}
                    required
                />
                <InputField
                    label="電子信箱:"
                    type="email"
                    name="userEmail"
                    value={user.userEmail}
                    onChange={handleInputChange}
                    placeholder="請輸入電子信箱"
                    errorMessage={fieldErrors.userEmail}
                    required
                />
                <InputField
                    label="身分證:"
                    type="text"
                    value={user.userIdCard}
                    name="userIdCard"
                    onChange={handleInputChange}
                    placeholder="請輸入身分證"
                    errorMessage={fieldErrors.userIdCard}
                    required
                />
                <InputField
                    label="出生日期:"
                    type="date"
                    name="userBirthDate"
                    value={user.userBirthDate}
                    onChange={handleInputChange}
                    required
                />
                <button className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition">
                    註冊
                </button>
            </form>
        </div>
    );
}

export default Register;



const InputField=({ label, type,name, value, onChange, placeholder, errorMessage, pattern, required })=>{
    return (
        <div className="mb-4">
            <label className="block text-gray-700 text-sm font-semibold mb-2">{label}</label>
            <input
                type={type}
                className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                name={name} 
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                pattern={pattern}
                required={required}

            />
            {errorMessage && <p className="text-red-500 text-sm">{errorMessage}</p>}
        </div>
    );
};