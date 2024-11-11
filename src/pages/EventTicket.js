import React from "react";

function EventTicket() {
  return (
    <div className="flex flex-col items-center pt-0 space-y-6 -mt-8">
      {/* Hero 區塊：展示圖片和標題 */}
      <div className="bg-gradient-to-r from-orange-500 to-red-500 w-full h-96 flex justify-center items-center relative rounded-md shadow-lg mt-2">
        <img
          src="/apple.jpg" // 替換為你的圖片路徑
          alt="圖片"
          className="h-full object-cover w-full rounded-md"
        />
        <div className="absolute bg-black bg-opacity-50 text-white text-4xl font-bold p-4 rounded-lg">
          音樂會售票
        </div>
      </div>

      {/* 資訊區塊 */}
<div className="bg-gradient-to-r from-blue-600 via-indigo-500 to-blue-800 w-full py-4 text-white rounded-md shadow-lg">
  <div className="max-w-4xl mx-auto px-4">
    {/* 標題與值 */}
    <div className="flex justify-between text-center border-b-2 border-solid border-white pb-2 mb-4">
      {/* 標題 */}
      <span className="font-bold w-1/4">名稱</span>
      <span className="font-bold w-1/4">場地</span>
      <span className="font-bold w-1/4">時間</span>
      <span className="font-bold w-1/4">購票</span>
    </div>

    {/* 資料 */}
    <div className="flex justify-between text-center">
      {/* 值 */}
      <span className="font-normal w-1/4">音樂會</span>
      <span className="font-normal w-1/4">台北小巨蛋</span>
      <span className="font-normal w-1/4">2024/12/25</span>
      <button className="bg-white text-blue-600 py-1 px-3 rounded hover:bg-gray-200 transition w-1/4">
        立即購票
      </button>
    </div>
  </div>
</div>


      {/* 描述與額外資訊 */}
      <div className="bg-gray-100 w-full py-12 flex justify-center items-center rounded-md shadow-lg">
        <div className="max-w-4xl text-center text-gray-700">
          <h3 className="text-2xl font-semibold mb-4">活動詳情</h3>
          <p className="text-sm">
            歡迎來到我們的音樂會售票平台！這場音樂會將帶給您前所未有的音樂享受，現場演奏、震撼音效與熱烈氣氛將讓您難以忘懷。快來搶票吧！
          </p>
        </div>
      </div>
    </div>
  );
}

export default EventTicket;
