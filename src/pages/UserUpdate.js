import React, { useEffect, useState } from "react";
import ApiService from "../api/ApiService";

function UserUpdate() {
    const [user, setUser] = useState({
        userName: "",
        userPhone: "",
        userEmail: "",
        userBirthDate: "",
        userIsVerified: false,
        userIdCard: ""
    });


    const [message, setMessage] = useState(null); // 提示訊息
    const [fieldErrors, setFieldErrors] = useState({});
    const [showModal, setShowModal] = useState(false); // 控制模態窗口的狀態
    const [verificationCode, setVerificationCode] = useState(""); // 認證碼

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await ApiService.fetchUserUpdate();

                const userdata = response.data.data;

                setUser({
                userName: userdata.userName || "",
                userPhone: userdata.userPhone || "",
                userEmail: userdata.userEmail || "",
                userBirthDate: userdata.userBirthDate || "",
                userIsVerified: userdata.userIsVerified || false,
                userIdCard: userdata.userIdCard || ""
                });

            } catch (err) {
                console.error("獲取用戶資料失敗：", err);
            }
        };
        fetchUser();
    }, []);


    // const handleVerification = () => {
    //     // try {
    //     //     const response = await ApiService.verifyUser({
    //     //         userIdCard: User.userIdCard,
    //     //         verificationCode,
    //     //     });
    //     //     console.log(response);
    //     //     alert("認證成功！");
    //     setUserVerified(true); // 更新認證狀態
    //     setShowModal(false); // 關閉模態窗口
    //     // } catch (err) {
    //     //     console.error("認證失敗:", err);
    //     //     alert("認證失敗，請稍後再試。");
    //     // }
    // };


    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const submitData=
            {
                userName     :   user.userName,
                userPhone    :   user.userPhone,
                userEmail    :   user.userEmail,
                userBirthDate:   user.userBirthDate
            }
            
            const response = await ApiService.updateUser(submitData);
            console.log(response);
            setMessage("更新成功");
        }
        catch (err) {
            console.error(err);
            setMessage("更新失敗，請稍後再試");

            // 伺服器回傳的錯誤中提取錯誤資訊，並將其設定到狀態中
            setFieldErrors(err.response?.data?.data || {});

        }

    }




    return (
        <div className="bg-white shadow-md rounded-lg p-8 max-w-lg mx-auto">
            <h2 className="text-3xl font-bold text-center text-gray-800">會員更新</h2>

            {/* message有值才會執行後面 */}
            {message && (
                <p
                    className={`text-center text-sm font-semibold mb-4 ${message.includes("成功") ? "text-green-500" : "text-red-500"
                        }`}
                >
                    {message}
                </p>
            )}


            <form className="mt-6" onSubmit={handleSubmit}>
                <InputField label="帳號" value={user.userName || ""} readOnly />
                <InputField label="密碼" value="123456789" readOnly type="password" />
                <InputField label="電話" value={user.userPhone} onChange={(e) => setUser({ ...user, userPhone: e.target.value })} errorMessage={fieldErrors.userPhone} />
                <InputField label="電子信箱" value={user.userEmail} onChange={(e) => setUser({ ...user, userEmail: e.target.value })} />
                <InputField label="身分證" value={user.userIdCard || ""} readOnly />
                <InputField label="出生日期" value={user.userBirthDate} onChange={(e) => setUser({ ...user, userBirthDate: e.target.value })} type="date" />



                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-semibold mb-2">
                        有無認證
                    </label>
                    <div className="flex items-center space-x-4">
                        <input
                            type="text"
                            className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                            value={user.userIsVerified ? "有認證" : "沒認證"}
                            onChange={(e) => setUser({...user,userIsVerified: e.target.value})}
                        />

                        <button
                            type="button"
                            className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition tracking-widest text-sm"
                            onClick={() => setShowModal(true)}
                        >
                            認&nbsp;證
                        </button>
                    </div>
                </div>
                <button className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition">
                    更新資料
                </button>

            </form>



            {/* 模態窗口 */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-8 rounded-lg shadow-lg max-w-sm w-full">
                        <h3 className="text-lg font-bold text-gray-800 mb-4">認證</h3>
                        <div>
                            <label className="block text-gray-700 text-sm font-semibold mb-2">認證碼</label>
                            <input
                                type="text"
                                className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                                value={verificationCode}
                                onChange={(e) => setVerificationCode(e.target.value)}
                            />
                        </div>

                        <div className="flex justify-end space-x-4 mt-4">
                            <button
                                onClick={() => setShowModal(false)}
                                className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition"
                            >
                                取消
                            </button>

                            <button
                                // onClick={handleVerification}
                                className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition"
                            >
                                確認
                            </button>
                        </div>
                    </div>
                </div>
            )}






        </div>
    );
};
const InputField = ({ label, value, onChange, type = "text", readOnly = false, errorMessage }) => {
    return (
        <div className="mb-4">
            <label className="block text-gray-700 text-sm font-semibold mb-2">{label}</label>
            <input
                type={type}
                className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                value={value}
                onChange={onChange}
                readOnly={readOnly}
            />
            {errorMessage && <p className="text-red-500 text-sm">{errorMessage}</p>}
        </div>
    );
};
export default UserUpdate;