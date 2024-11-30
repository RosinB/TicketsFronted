import React, { useState } from "react";
import ApiService from "../api/ApiService";
import { useNavigate } from "react-router-dom";

function Register() {
    const navigate = useNavigate();
    const [message, setMessage] = useState("");
    const [user, setUser] = useState({
        userName: "",
        userPhone: "",
        userEmail: "",
        password: "",
        userBirthDate: "",
        userIdCard: ""
    });

    const [fieldErrors, setFieldErrors] = useState({});

    // 驗證規則
    const validations = {
        userName: {
            pattern: /^[A-Za-z\d]{0,10}$/,
            process: value => value
        },
        userPhone: {
            pattern: /^\d{0,10}$/,
            process: value => value
        },
        userIdCard: {
            pattern: /^[A-Z]{0,1}\d{0,9}$/,
            process: value => value.toUpperCase()
        }
    };

    const handleInputChange = ({ target: { name, value } }) => {
        const validation = validations[name];
        
        if (validation) {
            const processedValue = validation.process(value);
            if (validation.pattern.test(processedValue)) {
                setUser(prev => ({ ...prev, [name]: processedValue }));
            }
        } else {
            setUser(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            await ApiService.registerUser(user);
            setMessage("註冊成功，一秒後跳轉到登入頁面");
            setTimeout(() => navigate("/login"), 1000);
        } catch (err) {
            if (err.response) {
                setFieldErrors(err.response.data.data || {});
                setMessage("註冊失敗");
            } else {
                console.error("請求失敗:", err);
            }
        }
    };

    const inputFields = [
        { label: "帳號:(字符數量4~10)", type: "text", name: "userName" },
        { label: "密碼:", type: "password", name: "password" },
        { label: "電話:(10位數)", type: "tel", name: "userPhone" },
        { label: "電子信箱:", type: "email", name: "userEmail" },
        { label: "身分證:", type: "text", name: "userIdCard" },
        { label: "出生日期:", type: "date", name: "userBirthDate" }
    ];

    return (
        <div className="bg-white shadow-md rounded-lg p-8 max-w-lg mx-auto -mt-4">
            <h2 className="text-3xl font-bold text-center text-gray-800">會員註冊</h2>
            {message && <div className={`text-${message.includes('成功') ? 'green' : 'red'}-500 text-center`}>{message}</div>}

            <form className="mt-2" onSubmit={handleSubmit}>
                {inputFields.map(field => (
                    <InputField
                        key={field.name}
                        {...field}
                        value={user[field.name]}
                        onChange={handleInputChange}
                        placeholder={`請輸入${field.label.split(':')[0]}`}
                        errorMessage={fieldErrors[field.name]}
                        required
                    />
                ))}
                <button className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition">
                    註冊
                </button>
            </form>
        </div>
    );
}


export default Register;



const InputField = ({ label, type, name, value, onChange, placeholder, errorMessage, required }) => (
    <div className="mb-4">
        <label className="block text-gray-700 text-sm font-semibold mb-2">{label}</label>
        <input
            type={type}
            className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            required={required}
        />
        {errorMessage && <p className="text-red-500 text-sm">{errorMessage}</p>}
    </div>
);