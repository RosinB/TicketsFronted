import React, { useState } from "react";
import ApiService from "../../api/ApiService";
import { User, Mail, AlertCircle, CheckCircle, ArrowLeft } from 'lucide-react';

function ForgetPassword() {
    const [userName, setUserName] = useState("");
    const [email, setEmail] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage("");
        setSuccessMessage("");

        try {
            const response = await ApiService.forgetPassword(userName, email);
            setSuccessMessage("寄送成功請查詢Email");
            console.log(response.data.data);
        } catch (err) {
            console.error("帳號不匹配", err);
            setErrorMessage("請確認 userName 和 Email 是否正確");
        }
    };

    return (
        <div className="flex justify-center items-start min-h-screen bg-gray-100">
            <div className="bg-white shadow-lg rounded-lg p-8 max-w-lg w-full">
                
                <EmailButton/>
                {/* 顯示錯誤訊息 */}
                <ErrorMessage errorMessage={errorMessage}/>

                {/* 顯示成功訊息 */}
                <SuccessMessage successMessage={successMessage}/>
                
                <ForgetPasswordForm userName={userName} 
                                    handleSubmit={handleSubmit} 
                                    setUserName={setUserName} 
                                    email={email} 
                                    setEmail={setEmail}/>
            </div>
        </div>
    );
}

export default ForgetPassword;

const ErrorMessage=({errorMessage})=>{

    return(errorMessage && (
        <div className="bg-red-100 text-red-700 border-l-4 border-red-500 p-4 mb-6 flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            {errorMessage}
        </div>
    ))

}
const SuccessMessage=({successMessage})=>{

    return(successMessage && (
        <div className="bg-green-100 text-green-700 border-l-4 border-green-500 p-4 mb-6 flex items-center gap-2">
            <CheckCircle className="w-5 h-5" />
            {successMessage}
        </div>
    ))


}

const EmailButton=()=>{

    return(<div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <User className="w-6 h-6 text-blue-500" />
            忘記密碼
        </h2>
        <button
            type="button"
            onClick={() => window.history.back()}
            className="text-gray-400 hover:text-gray-600 transition"
        >
            <ArrowLeft className="w-6 h-6" />
        </button>
    </div>)


}

const ForgetPasswordForm =({userName,handleSubmit,setUserName,email,setEmail})=>{

    return(<form onSubmit={handleSubmit}>
        <div className="mb-6">
            <label className="block text-gray-700 text-sm font-semibold mb-2 flex items-center gap-2">
                <User className="w-5 h-5 text-blue-500" />
                帳號
            </label>
            <input
                type="text"
                className="w-full border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="請輸入帳號"
                required
            />
        </div>

        <div className="mb-6">
            <label className="block text-gray-700 text-sm font-semibold mb-2 flex items-center gap-2">
                <Mail className="w-5 h-5 text-blue-500" />
                電子郵件
            </label>
            <input
                type="email"
                className="w-full border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="請輸入電子郵件"
                required
            />
        </div>

        <div className="flex justify-end gap-4">
        <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
            >
                驗證
            </button>
            <button
                type="button"
                className="px-6 py-2 bg-gray-400 text-white rounded-md hover:bg-gray-500 transition"
                onClick={() => window.history.back()}
            >
                取消
            </button>
        
        </div>
    </form>)


}