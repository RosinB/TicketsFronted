// 圖片頁面
export default function ImageGallery({ data }) {
    return (
        <div>
            <h1 className="text-white text-lg">圖片</h1>
            <div className="grid grid-cols-3 gap-4">
                {data.map((event) => (
                    <div key={event.eventId} className="text-center">
                        <img
                            src={event.picEventTicket}
                            alt={`${event.eventName} - Ticket`}
                            className="w-full h-40 object-cover"
                        />
                        <p className="text-white mt-2">{event.eventName}</p>
                    </div>
                ))}
            </div>
        </div>
    );}