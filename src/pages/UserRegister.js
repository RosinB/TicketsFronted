import React, { useState } from "react";
import ApiService from "../api/ApiService";
import { useNavigate } from "react-router-dom"; // 引入 useNavigate
import InputField from "../components/user/InputField";


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

    const submitData=
    {
        userName        :   user.userName,
        userPhone       :   user.userPhone,
        userEmail       :   user.userEmail,
        password        :   user.password,
        userBirthDate   :   user.userBirthDate,
        userIdCard      :   user.userIdCard
    }

console.log(submitData);
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await ApiService.registerUser(submitData);
            console.log(response);
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

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUser(prevUser => ({ ...prevUser, [name]: value }));
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
                    pattern={/^[A-Za-z\d]{0,10}$/} // 限制輸入4~10位字符
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
                    type="text"
                    name="userPhone"
                    value={user.userPhone}
                    onChange={handleInputChange}
                    placeholder="請輸入電話"
                    errorMessage={fieldErrors.userPhone}
                    pattern={/^\d{0,10}$/} // 僅允許10位數字
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
                    pattern={/^[A-Z\d]{0,10}$/} // 限制輸入0到10位大寫字母或數字
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
