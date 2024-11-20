
export default function TicketInfo({ data }) {
    return (
        <div>
            <h1 className="text-lg font-bold mb-4">票務資訊</h1>
            {data.map((event) => (
                <div key={event.eventId} className="mb-6">
                    <h2 className="text-md font-semibold mb-2">{event.eventName}</h2>
                    <table className="table-auto w-full text-left border-collapse bg-gray-800 text-white">
                        <thead>
                            <tr>
                                <th className="px-4 py-2 border border-gray-700 bg-gray-700 font-bold">票名</th>
                                <th className="px-4 py-2 border border-gray-700 bg-gray-700 font-bold">票價</th>
                                <th className="px-4 py-2 border border-gray-700 bg-gray-700 font-bold">剩餘</th>
                                <th className="px-4 py-2 border border-gray-700 bg-gray-700 font-bold">是否可用</th>
                            </tr>
                        </thead>
                        <tbody>
                            {event.ticketDtos.map((ticket, index) => (
                                <tr key={index}>
                                    <td className="px-4 py-2 border border-gray-700">{ticket.ticketName}</td>
                                    <td className="px-4 py-2 border border-gray-700">{ticket.ticketPrice}</td>
                                    <td className="px-4 py-2 border border-gray-700">{ticket.ticketRemaining}</td>
                                    <td className="px-4 py-2 border border-gray-700">
                                        {ticket.ticketIsAvailable ? "可用" : "不可用"}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ))}
        </div>
    );
}
