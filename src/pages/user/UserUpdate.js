import React, { useEffect, useState } from "react";
import ApiService from "../../api/ApiService";

function UserUpdate() {
    // console.log("當前路徑:", window.location.pathname);
    const [User, setUser] = useState({}); // 從後端獲取的資料
    const [userPhone, setUserPhone] = useState(""); // 電話
    const [userEmail, setUserEmail] = useState(""); // 電子郵件
    const [userName, setUserName] = useState("")
    const [userBirthDate, setUserBirthDate] = useState("")
    const [userIsVerified, setUserVerified] = useState("");

    const [message, setMessage] = useState(null); // 提示訊息
    const [fieldErrors, setFieldErrors] = useState({});
    const [showModal, setShowModal] = useState(false); // 控制模態窗口的狀態
    const [verificationCode, setVerificationCode] = useState(""); // 認證碼
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await ApiService.fetchUserUpdate();

                const userdata = response.data.data;
                setUser(userdata); // 將回應資料存入 state
                setUserPhone(userdata.userPhone || "");
                setUserEmail(userdata.userEmail || "");
                setUserName(userdata.userName || "")
                setUserBirthDate(userdata.userBirthDate || "")
                setUserVerified(userdata.userIsVerified);

            } catch (err) {
                console.error("獲取用戶資料失敗：", err);
            }
        };
        fetchUser();
    }, []);


    const handleVerification = () => {
        // try {
        //     const response = await ApiService.verifyUser({
        //         userIdCard: User.userIdCard,
        //         verificationCode,
        //     });
        //     console.log(response);
        //     alert("認證成功！");
        setUserVerified(true); // 更新認證狀態
        setShowModal(false); // 關閉模態窗口
        // } catch (err) {
        //     console.error("認證失敗:", err);
        //     alert("認證失敗，請稍後再試。");
        // }
    };


    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await ApiService.updateUser({ userName, userPhone, userEmail, userBirthDate });
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
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-semibold mb-2">
                        帳號:
                    </label>
                    <input
                        type="text"
                        className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                        value={User.userName || ""}
                        readOnly
                    />

                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-semibold mb-2">
                        密碼:
                    </label>
                    <input
                        type="password"
                        className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                        value={123456789}
                        readOnly
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-semibold mb-2">
                        電話:
                    </label>
                    <input
                        type="text"
                        className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                        value={userPhone}
                        onChange={(e) => { setUserPhone(e.target.value) }}
                    />
                    {fieldErrors.userPhone && <p className="text-red-500 text-sm">{fieldErrors.userPhone}</p>}

                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-semibold mb-2">
                        電子信箱:
                    </label>
                    <input
                        type="email"
                        className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                        value={userEmail}
                        onChange={(e) => setUserEmail(e.target.value)}
                    />

                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-semibold mb-2">
                        身分證:
                    </label>
                    <input
                        type="text"
                        className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                        value={User.userIdCard || ""}

                        readOnly
                    />

                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-semibold mb-2">
                        出生日期:
                    </label>
                    <input
                        type="date"
                        className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                        value={User.userBirthDate || ""}
                        onChange={(e) => setUserBirthDate(e.target.value)}

                    />
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-semibold mb-2">
                        有無認證
                    </label>
                    <div className="flex items-center space-x-4">
                        <input
                            type="text"
                            className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                            value={userIsVerified ? "有認證" : "沒認證"}
                            onChange={(e) => setUserBirthDate(e.target.value)}
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
                                onClick={handleVerification}
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

export default UserUpdate;