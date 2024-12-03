import React, { useState } from "react";
import ApiService from "../api/ApiService";
import { useNavigate } from "react-router-dom";
import { User, Phone, Mail, Calendar, CreditCard, Lock, Check, AlertTriangle } from 'lucide-react';

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
        <div className="max-w-4xl mx-auto p-6">
            <div className="bg-white shadow-lg rounded-lg overflow-hidden -mt-6">
                {/* 頂部標題區 */}
                <HeaderTitle />

                {/* 訊息顯示 */}
                <MessageAlert message={message} />

                <form className="p-6 space-y-6" onSubmit={handleSubmit}>
                    <FormRegister
                        handleSubmit={handleSubmit}
                        inputFields={inputFields}
                        fieldErrors={fieldErrors}
                        handleInputChange={handleInputChange}
                        user={user}
                    />                    
                    <RegisterButton/>
                </form>
            </div>
        </div>
    );
}


export default Register;

const getFieldIcon = (label) => {
    switch (label) {
        case "帳號:(字符數量4~10)":
            return <User className="w-4 h-4 text-blue-500" />;
        case "密碼:":
            return <Lock className="w-4 h-4 text-blue-500" />;
        case "電話:(10位數)":
            return <Phone className="w-4 h-4 text-blue-500" />;
        case "電子信箱:":
            return <Mail className="w-4 h-4 text-blue-500" />;
        case "出生日期:":
            return <Calendar className="w-4 h-4 text-blue-500" />;
        case "身分證:":
            return <CreditCard className="w-4 h-4 text-blue-500" />;
        default:
            return null;
    }
};

const HeaderTitle = () => {
    return (<div className="bg-blue-500 px-6 py-4 ">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <User className="w-6 h-6" />
            會員註冊
        </h2>
    </div>)

}
const MessageAlert = ({ message }) => {
    const isSuccess = message.includes("成功");

    return (

        message && (
            <div className={`p-4 ${isSuccess
                ? "bg-green-100 text-green-700 border-l-4 border-green-500"
                : "bg-red-100 text-red-700 border-l-4 border-red-500"
                }`}>
                <p className="flex items-center gap-2">
                    {isSuccess ? <Check className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
                    {message}
                </p>
            </div>
        )
    )
}
const FormRegister = ({ handleSubmit, inputFields, fieldErrors, handleInputChange, user }) => {
    return (
        <form className="p-6 space-y-6" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {inputFields.map(field => (
                    <div key={field.name}>
                        <label className=" text-gray-700 text-sm font-bold mb-2 flex items-center gap-2">
                            {getFieldIcon(field.label)}
                            {field.label}
                        </label>
                        <input
                            type={field.type}
                            className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none ${fieldErrors[field.name] ? 'border-red-500' : 'border-gray-300'}`}
                            name={field.name}
                            value={user[field.name]}
                            onChange={handleInputChange}
                            placeholder={`請輸入${field.label.split(':')[0]}`}
                            required
                        />
                        {fieldErrors[field.name] && (
                            <p className="mt-1 text-red-500 text-sm">{fieldErrors[field.name]}</p>
                        )}
                    </div>
                ))}
            </div>
     
        </form>)


}
const RegisterButton = ()=>{
    return( 
    <button className="w-2/5 mx-auto bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
        <Check className="w-5 h-5" />
        註冊
    </button>)
}