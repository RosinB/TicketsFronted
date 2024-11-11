import React from "react";

const EventLayout = () => {
  return (
    <div className="flex flex-col items-center p-4">
      {/* 橘色區塊 */}
      <div className="bg-orange-500 w-full h-96 flex justify-center items-center">
        {/* 圖片放置區 */}
        <img
          src="/apple.jpg" // 替換為你的圖片路徑
          alt="圖片"
          className="h-full"
        />
      </div>

      {/* 藍色區塊 */}
      <div className="bg-blue-600 w-full h-24 flex flex-col items-center justify-center text-white text-lg font-bold">
        {/* 標題 */}
        <div className="w-full flex justify-around">
          <span>名稱</span>
          <span>場地</span>
          <span>時間</span>
          <span>購票</span>
        </div>
        {/* 值 */}
        <div className="w-full flex justify-around text-sm font-normal">
          <span>音樂會</span>
          <span>台北小巨蛋</span>
          <span>2024/12/25</span>
          <span>立即購票</span>
        </div>
      </div>

      {/* 淺藍色區塊 */}
      <div className="bg-blue-100 w-full h-64 flex justify-center items-center">
        {/* 放資訊 */}
        <p className="text-gray-700">這裡是資訊區域</p>
      </div>
    </div>
  );
};

export default EventLayout;
