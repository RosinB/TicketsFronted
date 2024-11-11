import React from "react";

function Home() {
    return (
        <div className="text-center">
               {/* 放圖片的區域 */}
               <div className="bg-gray-300  mb-8 h-96 flex justify-center items-center -mt-2">
               <img
                    src="/path/to/your/image.jpg" // 替換為你的圖片路徑
                    alt="圖片"
                    className="max-h-full max-w-full object-contain"
                />
            </div>

      

         
            {/* 註冊按鈕 */}
            <div className="mt-6">
                <button className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition">
                    註冊會員 可能會改掉
                </button>
            </div>

            {/* 消息區 */}
            <div className="bg-gray-100 text-gray-800 p-6 mt-12 rounded-md shadow-lg max-w-4xl mx-auto">
                <h3 className="text-2xl font-semibold mb-4">最新消息</h3>
                <p className="text-lg">
                    我們將於 2024 年 12 月 25 日舉行一場音樂會，您可以在本網站上購買票券。敬請期待！
                </p>
            </div>
        </div>
    );
}

export default Home;
