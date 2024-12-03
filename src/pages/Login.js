import React, { useState } from "react";
import ApiService from "../api/ApiService";
import { useNavigate } from "react-router-dom";
import { User, Lock, LogIn, HelpCircle } from "lucide-react"; // 引入需要的圖標

function Login() {

    const [userName, setUserName] = useState(""); 
    const [password, setPassword] = useState(""); 
    const [errorMessage, setErrorMessage] = useState(""); 
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault(); 

        setErrorMessage(""); 

        try {
            const response = await ApiService.loginUser(userName, password);

            const { token, userName: tokenUserName } = response.data.data;

            console.log("登入的使用者UserName:", tokenUserName);
            localStorage.setItem("token", token);
            localStorage.setItem("userName", tokenUserName);

            if (userName === "admin") {
                localStorage.setItem("role", "admin");
                window.location.href = "/admin/event";
            } else {
                localStorage.setItem("role", "user");
                window.location.href = "/";
            }
        }
        catch (err) {
            // 處理登入失敗
            if (err.response) {
                console.error("登入失敗：", err.response.data.message);

                setErrorMessage(err.response.data.message || "登入失敗，請檢查您的帳號密碼！"); // 顯示後端返回的錯誤訊息

                setPassword("");//清空密碼input
            } else {
                console.error("請求失敗：", err);
                setErrorMessage("系統錯誤，請稍後再試！");
            }
        }
    };

    const handleForgotPassword = () => {
        navigate("/forgetpassword");
    };


    return (
        <div className="bg-white shadow-md rounded-lg p-8 max-w-lg mx-auto">
        
            <h2 className="text-3xl font-bold text-center text-gray-800">登入</h2>

            {errorMessage && <div className="text-red-500 text-center mb-4">{errorMessage}</div>}

            <form className="mt-6" onSubmit={handleSubmit}>
                
                <UserName userName={userName} setUserName={setUserName} />
            
                <Password password={password} setPassword={setPassword}/>

                <Forget handleForgotPassword={handleForgotPassword}/>
                
                <LoginUser />
                
            </form>
        </div>
    );
};

export default Login;


















const UserName=({userName,setUserName})=>{

    return(<div className="mb-4">
        <label className="block text-gray-700 text-sm font-semibold mb-2">
            <div className="flex items-center gap-2">
                <User size={18} className="text-gray-600" /> {/* 帳號圖標 */}
                帳號
            </div>
        </label>
        <input
            type="text"
            className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            placeholder="請輸入帳號"
            required
        />
    </div>)

}

const Password=({password,setPassword})=>{
    return( <div className="mb-4">
        <label className="block text-gray-700 text-sm font-semibold mb-2">
            <div className="flex items-center gap-2">
                <Lock size={18} className="text-gray-600" /> {/* 密碼圖標 */}
                密碼
            </div>
        </label>
        <input
            type="password"
            className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="請輸入密碼"
            required
        />
    </div>)

}

const Forget=({handleForgotPassword})=>{

    return(<div className="flex justify-center py-3 -mt-2">
        <button
            type="button"
            onClick={handleForgotPassword}
            className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
        >
            <HelpCircle size={16} /> {/* 忘記密碼圖標 */}
            忘記密碼？
        </button>
    </div>)

}

const LoginUser =()=>{
    return(<button className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition flex items-center justify-center gap-2">
        <LogIn size={18} /> {/* 登入按鈕圖標 */}
        登入
    </button>)


}