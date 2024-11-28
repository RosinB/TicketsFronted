import { useNavigate, useParams } from "react-router-dom";
import ApiService from "../../api/ApiService";
import { useEffect, useState } from "react";
import LoadingSpinner from "../ui/LoadingSpinner";


function ResestPassword() {
    const { token } = useParams();  // 從 URL 中獲取 token
    const [loading, setLoading] = useState(true);
    const [userName,setUserName]=useState("");
    const navigate = useNavigate();
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const checkToken = async () => {

        try {
            const response = await ApiService.checkToken(token)
            setUserName(response.data.data)
        } catch (error) {
            navigate("/");
            console.log("token錯誤:" + error)
        } finally {
            setLoading(false);
        }

    }

    useEffect(() => {
        checkToken();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [token])

    const handleSubmit = async (e) => {
        e.preventDefault();

        // 檢查兩個密碼是否一致
        if (newPassword !== confirmPassword) {
            setErrorMessage("密碼不一致，請重新確認。");
            return;
        }
        





    };


    if (loading) return <LoadingSpinner />



    return (
        <div className=" flex items-start justify-center bg-gray-100 py-6 px-4 sm:px-6 lg:px-8">
            <div className="w-full max-w-md space-y-8 bg-white p-8 rounded-lg shadow-lg">
                <h2 className="text-2xl font-extrabold text-center text-gray-900">重設密碼</h2>

                {/* 顯示錯誤訊息 */}
                {errorMessage && <div className="text-red-500 text-center mb-4">{errorMessage}</div>}

                {/* 重設密碼表單 */}
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <h1>{userName}</h1>
                    <div className="rounded-md shadow-sm -space-y-px">
                        <div>
                            <label htmlFor="newPassword" className="sr-only">新密碼</label>
                            <input
                                type="password"
                                id="newPassword"
                                name="newPassword"
                                required
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                placeholder="新密碼"
                            />
                        </div>
                        <div>
                            <label htmlFor="confirmPassword" className="sr-only">確認新密碼</label>
                            <input
                                type="password"
                                id="confirmPassword"
                                name="confirmPassword"
                                required
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                placeholder="確認新密碼"
                            />
                        </div>
                    </div>


                    <button
                        type="submit"
                        className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        重設密碼
                    </button>
                </form>
            </div>
        </div>
    );




}

export default ResestPassword