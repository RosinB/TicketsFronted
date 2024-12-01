import React, { useEffect, useState } from "react";
import ApiService from "../api/ApiService";
import { User, Phone, Mail, Calendar, CreditCard, Check, Send, AlertTriangle, Lock } from 'lucide-react';

function UserUpdate() {
    const initialUser = {
        userName: "",
        userPhone: "",
        userEmail: "",
        userBirthDate: "",
        userIsVerified: false,
        userIdCard: ""
    };

    const validationRules = {
        userName: /^[A-Za-z\d]{0,10}$/,
        userPhone: /^\d{0,10}$/,
    };

    const inputFields = [
        { label: "帳號", name: "userName", type: "text", readOnly: true },
        { label: "密碼", type: "password", value: "123456789", readOnly: true },
        { label: "電話", name: "userPhone", type: "text" },
        { label: "電子信箱", name: "userEmail", type: "email" },
        { label: "身分證", name: "userIdCard", type: "text", readOnly: true },
        { label: "出生日期", name: "userBirthDate", type: "date" }
    ];

    const [user, setUser] = useState(initialUser);
    const [message, setMessage] = useState("");
    const [fieldErrors, setFieldErrors] = useState({});

    // 信箱驗證相關的 state
    const [isVerifying, setIsVerifying] = useState(false);
    const [verificationCode, setVerificationCode] = useState("");
    const [verificationStatus, setVerificationStatus] = useState("");

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await ApiService.fetchUserUpdate();
                const userData = response.data.data;
                setUser({
                    userName: userData.userName || "",
                    userPhone: userData.userPhone || "",
                    userEmail: userData.userEmail || "",
                    userBirthDate: userData.userBirthDate || "",
                    userIsVerified: userData.userIsVerified || false,
                    userIdCard: userData.userIdCard || ""
                });
            } catch (err) {
                console.error("獲取用戶資料失敗：", err);
                setMessage("獲取用戶資料失敗");
            }
        };
        fetchUser();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { userName, userPhone, userEmail, userBirthDate } = user;

        try {
            await ApiService.updateUser({ userName, userPhone, userEmail, userBirthDate });
            setMessage("更新成功");
        } catch (err) {
            setMessage("更新失敗，請稍後再試");
            setFieldErrors(err.response?.data?.data || {});
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        if (validationRules[name]) {
            const processedValue = value.toUpperCase();
            if (validationRules[name].test(processedValue)) {
                setUser({ ...user, [name]: processedValue });
            }
        } else {
            setUser({ ...user, [name]: value });
        }
    };

    const handleSendVerification = async () => {
        try {
            await ApiService.getCAPTCHA(user.userName);
            setIsVerifying(true);
            setVerificationStatus("驗證碼已發送到您的信箱");
        } catch (error) {
            setVerificationStatus("發送驗證碼失敗");
        }
    };

    const handleVerifyEmail = async () => {
        try {
            await ApiService.verifEmail(user.userName, verificationCode);
            setUser(prev => ({ ...prev, userIsVerified: true }));
            setIsVerifying(false);
            setVerificationStatus("驗證成功！");
        } catch (error) {
            setVerificationStatus("驗證失敗，請重試");
        }
    };

    const getFieldIcon = (label) => {
        switch (label) {
            case "帳號":
                return <User className="w-4 h-4 text-blue-500" />;
            case "密碼":
                return <Lock className="w-4 h-4 text-blue-500" />;
            case "電話":
                return <Phone className="w-4 h-4 text-blue-500" />;
            case "電子信箱":
                return <Mail className="w-4 h-4 text-blue-500" />;
            case "出生日期":
                return <Calendar className="w-4 h-4 text-blue-500" />;
            case "身分證":
                return <CreditCard className="w-4 h-4 text-blue-500" />;
            default:
                return null;
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6">
            <div className="bg-white shadow-lg rounded-lg overflow-hidden -mt-6">
                {/* 頂部標題區 */}
                <div className="bg-gradient-to-r from-blue-700 via-teal-600 to-teal-800  px-6 py-4 ">
                    <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                        <User className="w-6 h-6" />
                        會員資料管理
                    </h2>
                </div>

                {/* 訊息顯示 */}
                {message && (
                    <div className={`p-4 ${message.includes("成功")
                            ? "bg-green-100 text-green-700 border-l-4 border-green-500"
                            : "bg-red-100 text-red-700 border-l-4 border-red-500"
                        }`}>
                        <p className="flex items-center gap-2">
                            {message.includes("成功") ? <Check className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
                            {message}
                        </p>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {inputFields.map(field => (
                            <div key={field.name || field.label}>
                                <label className="block text-gray-700 text-sm font-bold mb-2 flex items-center gap-2">
                                    {getFieldIcon(field.label)}
                                    {field.label}
                                </label>
                                <input
                                    type={field.type}
                                    name={field.name}
                                    value={field.value || user[field.name] || ""}
                                    onChange={handleInputChange}
                                    readOnly={field.readOnly}
                                    className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none
                                       ${field.readOnly ? 'bg-gray-100' : 'bg-white'}
                                       ${fieldErrors[field.name] ? 'border-red-500' : 'border-gray-300'}`}
                                />
                                {fieldErrors[field.name] && (
                                    <p className="mt-1 text-red-500 text-sm">{fieldErrors[field.name]}</p>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* 信箱驗證區塊 */}
                    <div className="border-t pt-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                                <Mail className="w-5 h-5 text-blue-500" />
                                <span className="font-bold text-gray-700">信箱驗證狀態</span>
                                <span className={`px-2 py-1 rounded-full text-sm ${user.userIsVerified
                                        ? "bg-green-100 text-green-700"
                                        : "bg-red-100 text-red-700"
                                    }`}>
                                    {user.userIsVerified ? "已驗證" : "未驗證"}
                                </span>
                            </div>
                            {!user.userIsVerified && !isVerifying && (
                                <button
                                    type="button"
                                    onClick={handleSendVerification}
                                    className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                                >
                                    <Send className="w-4 h-4" />
                                    發送驗證碼
                                </button>
                            )}
                        </div>

                        {isVerifying && (
                            <div className="flex gap-4">
                                <input
                                    type="text"
                                    value={verificationCode}
                                    onChange={(e) => setVerificationCode(e.target.value)}
                                    placeholder="請輸入驗證碼"
                                    className="flex-1 p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
                                />
                                <button
                                    type="button"
                                    onClick={handleVerifyEmail}
                                    className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                                >
                                    驗證
                                </button>
                            </div>
                        )}

                        {verificationStatus && (
                            <p className="mt-2 text-sm text-gray-600">{verificationStatus}</p>
                        )}
                    </div>

                    {/* 更新按鈕 */}
                    <div className="pt-6 border-t">
                        <button
                            type="submit"
                            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                        >
                            <Check className="w-5 h-5" />
                            更新資料
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default UserUpdate;