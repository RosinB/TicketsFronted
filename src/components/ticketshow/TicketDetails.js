import React from "react";

function TicketDetails({ event = {} }) {
    return (
        <div className="bg-white rounded-lg p-6 max-w-4xl mx-auto ">
            {/* 活動名稱作為標題 */}
            <h2 className="text-3xl font-bold text-blue-600 mb-6 text-center">
                {event.eventName || "暫無資料"}
            </h2>

            {/* 內容區塊 */}
            <div className="space-y-6">
                <DetailRow label="🎤 演出者" value={event.eventPerformer} />
                <DetailRow label="📍 活動地點" value={event.eventLocation} />
                <DetailRow label="📅 活動日期" value={event.eventDate} />
                <DetailRow label="⏰ 活動時間" value={event.eventTime} />
                {/* 售票日期與售票時間：特別樣式 */}
                <HighlightedRow label="💳 售票日期" value={event.eventSalesDate} />
                <HighlightedRow label="🕒 售票時間" value={event.eventSalesTime} />
                <DetailRow label="⏰ 活動內容" value={event.eventDescription} />
                <DetailRow label="🏢 主辦單位" value={event.hostName} />
                {/* 添加圖片 */}
                {event.picTicketSection && (
                    <div className="flex justify-start mt-6">
                        <img
                            src={event.picTicketSection}
                            alt="票區圖示"
                            className="rounded-lg shadow-md max-w-full h-auto"
                        />
                    </div>
                )}
            </div>
        </div>
    );
}

function DetailRow({ label, value }) {
    return (
        <div className="flex items-center">
            <span className="text-xl font-semibold text-gray-700 w-40">{label}</span>
            <span className="text-lg text-gray-600">{value || "暫無資料"}</span>
        </div>
    );
}

function HighlightedRow({ label, value }) {
    return (
        <div className="flex items-center">
            <span className="text-xl font-bold text-red-600 w-40">{label}</span>
            <span className="text-lg font-bold text-orange-500">{value || "暫無資料"}</span>
        </div>
    );
}

export default TicketDetails;
