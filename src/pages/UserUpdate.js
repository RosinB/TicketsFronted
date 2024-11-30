import React, { useEffect, useState } from "react";
import ApiService from "../api/ApiService";

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

    return (
        <div className="bg-white shadow-md rounded-lg p-8 max-w-lg mx-auto">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">會員更新</h2>

            {message && (
                <div className={`text-center text-sm font-semibold mb-4 ${message.includes("成功") ? "text-green-500" : "text-red-500"
                    }`}>
                    {message}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                {inputFields.map(field => (
                    <InputField
                        key={field.name || field.label}
                        {...field}
                        value={field.value || user[field.name] || ""}
                        onChange={handleInputChange}
                        errorMessage={fieldErrors[field.name]}
                    />
                ))}

                <VerificationStatus isVerified={user.userIsVerified} />

                <button
                    className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
                    type="submit"
                >
                    更新資料
                </button>
            </form>
        </div>
    );
}



export default UserUpdate;

const InputField=({ label, name, value, onChange, type, readOnly = false, errorMessage })=> {
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
}

const VerificationStatus=({ isVerified })=> {
    return (
        <div className="mb-4">
            <label className="block text-gray-700 text-sm font-semibold mb-2">
                信箱是否認證
            </label>
            <input
                type="text"
                className="w-full border border-gray-300 rounded-md p-2 bg-gray-50"
                value={isVerified ? "有認證" : "沒認證"}
                readOnly
            />
        </div>
    );
}