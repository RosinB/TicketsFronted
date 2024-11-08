import React from "react";

const Home = () => {
    return (
        <div className="text-center">
            <h2 className="text-4xl font-bold text-gray-800">歡迎來到首頁</h2>
            <p className="text-gray-600 mt-4 text-lg">
                這裡是專業網站的首頁。使用者可以瀏覽更多資訊或註冊新帳戶。
            </p>
            <div className="mt-6">
                <button className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition">
                    立即註冊
                </button>
            </div>
        </div>
    );
};

export default Home;
