import React, { useState } from "react";
import ApiService from "../../api/ApiService";
import { useNavigate } from "react-router-dom"; // 引入 useNavigate
import InputField from "./components/InputField";


function Register() {
    const [userName, setUserName] = useState("");
    const [userPhone, setUserPhone] = useState("");
    const [password, setPassword] = useState("");
    const [userIdCard, setUserIdCard] = useState("");
    const [userEmail, setUserEmail] = useState("");
    const [userBirthDate, setUserBirthDate] = useState("");

    const [fieldErrors, setFieldErrors] = useState({});
    const [successMessage, setSuccessMessage] = useState("");
    const navigate = useNavigate(); // 初始化 useNavigate

    // 提交表單的處理函數
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await ApiService.registerUser({
                userName,
                userPhone,
                password,
                userIdCard,
                userEmail,
                userBirthDate,
            });
            console.log(response);
            clearState();
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

    const clearState = () => {
        setUserName("");
        setUserPhone("");
        setPassword("");
        setUserIdCard("");
        setUserEmail("");
        setUserBirthDate("");
    };

    return (
        <div className="bg-white shadow-md rounded-lg p-8 max-w-lg mx-auto -mt-4">
            <h2 className="text-3xl font-bold text-center text-gray-800">會員註冊</h2>
            {successMessage && <div className="text-green-500 text-center">{successMessage}</div>}

            <form className="mt-2" onSubmit={handleSubmit}>
                <InputField
                    label="帳號:(字符數量4~10)"
                    type="text"
                    value={userName}
                    onChange={setUserName}
                    placeholder="請輸入帳號"
                    errorMessage={fieldErrors.userName}
                    pattern={/^[A-Za-z\d]{0,10}$/} // 限制輸入4~10位字符
                    required
                />
                <InputField
                    label="密碼:"
                    type="password"
                    value={password}
                    onChange={setPassword}
                    placeholder="請輸入密碼"
                    required
                />
                <InputField
                    label="電話:(10位數)"
                    type="text"
                    value={userPhone}
                    onChange={setUserPhone}
                    placeholder="請輸入電話"
                    errorMessage={fieldErrors.userPhone}
                    pattern={/^\d{0,10}$/} // 僅允許10位數字
                    required
                />
                <InputField
                    label="電子信箱:"
                    type="email"
                    value={userEmail}
                    onChange={setUserEmail}
                    placeholder="請輸入電子信箱"
                    errorMessage={fieldErrors.userEmail}
                    required
                />
                <InputField
                    label="身分證:"
                    type="text"
                    value={userIdCard}
                    onChange={(value) => setUserIdCard(value.toUpperCase())} // 自動轉為大寫
                    placeholder="請輸入身分證"
                    errorMessage={fieldErrors.userIdCard}
                    pattern={/^[A-Z\d]{0,10}$/} // 限制輸入0到10位大寫字母或數字
                    required
                />
                <InputField
                    label="出生日期:"
                    type="date"
                    value={userBirthDate}
                    onChange={setUserBirthDate}
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
