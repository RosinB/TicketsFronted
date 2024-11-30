import React, { useEffect, useState } from "react";
import ApiService from "../api/ApiService";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import { useNavigate } from "react-router-dom";




function UserEmail() {
    const navigate=useNavigate();

    const [email, setEmail] = useState(""); // 用於存儲輸入的信箱
    const [verifCode, setVerifCode] = useState(""); // 用於存儲用戶輸入的驗證碼
    const [status, setStatus] = useState(""); // 顯示驗證狀態
    const [isCodeSent, setIsCodeSent] = useState(false); // 是否已發送驗證碼
    const [loading, setLoading] = useState(true);
    const userName = localStorage.getItem("userName");

   
    

    // 發送驗證碼到信箱
    const sendVerificationCode =  () => {
        try {
            ApiService.getCAPTCHA(userName);
            setIsCodeSent(true); 
            setStatus("驗證碼已發送到您的信箱，請檢查信箱。");
        } catch (error) {
            setStatus("發送驗證碼失敗：" + (error.response?.data || error.message));
        }
    };



    // 驗證用戶輸入的驗證碼
    const verifyCode = async () => {
        try {
            const code=verifCode;
            console.log(userName+""+code)
            await ApiService.verifEmail(userName,code);
            alert("驗證成功，跳轉到使用者會員介面");
            navigate("/user/update")            

        } catch (error) {
            alert("驗證失敗，請重試");
            console.log(error);
        }
    };

    useEffect(() => {
        const fetchEmail=() =>{

            ApiService.getEmail(userName)
                .then(({data:{data}})=>{setEmail(data)})
                .catch((error)=>{console.log("抓取email錯誤" + error);})
                .finally(()=>{setLoading(false);})
        }
        fetchEmail();
    }, [userName])
    if (loading)
        return <LoadingSpinner />



    return (
        <div className="p-6 max-w-md mx-auto bg-white rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">驗證信箱</h2>

            {!isCodeSent ? (
                <EmailInput email={email} sendVerificationCode={sendVerificationCode} />
            ) : (
                <VerificationCode
                    verifCode={verifCode}
                    setVerifCode={setVerifCode}
                    verifyCode={verifyCode}/>
            )}
            {/* 顯示狀態 */}
            {status && <p className="mt-6 text-sm text-gray-600">{status}</p>}
        </div>
    );
}

export default UserEmail;


// 信箱輸入元件
const EmailInput = ({ email, sendVerificationCode }) => {
    return (
        <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                信箱:
            </label>
            <p className="text-lg text-gray-900 bg-gray-100 p-2 rounded-md">{email}</p>
            <button
                onClick={sendVerificationCode}
                className="mt-6 px-4 py-2 bg-blue-500 text-white font-medium rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
            >
                發送驗證碼
            </button>
        </div>
    );
};

// 驗證碼輸入元件
const VerificationCode = ({ verifCode, setVerifCode, verifyCode }) => {
    return (
        <div>
            <label htmlFor="verificationCode" className="block text-sm font-medium text-gray-700 mb-1">
                輸入驗證碼
            </label>
            <input
                type="text"
                id="verificationCode"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={verifCode}
                onChange={(e) => setVerifCode(e.target.value)}
                placeholder="請輸入驗證碼"
            />
            <button
                onClick={verifyCode}
                className="mt-6 px-4 py-2 bg-green-500 text-white font-medium rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2"
            >
                驗證
            </button>
        </div>
    );
};
