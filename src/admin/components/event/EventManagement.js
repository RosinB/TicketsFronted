
export default  function EventManagement({ data }) {
    return (
        <div>
            <h1 className="text-lg font-bold mb-4">後台演唱會管理</h1>
            <table className="table-auto w-full text-left border-collapse bg-gray-800 text-white">
                <thead>
                    <tr>
                        <th className="px-4 py-2 border border-gray-700 bg-gray-700 font-bold">演唱會名稱</th>
                        <th className="px-4 py-2 border border-gray-700 bg-gray-700 font-bold">表演者</th>
                        <th className="px-4 py-2 border border-gray-700 bg-gray-700 font-bold">日期</th>
                        <th className="px-4 py-2 border border-gray-700 bg-gray-700 font-bold">地點</th>
                        <th className="px-4 py-2 border border-gray-700 bg-gray-700 font-bold">銷售狀態</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((event) => (
                        <tr key={event.eventId}>
                            <td className="px-4 py-2 border border-gray-700">{event.eventName}</td>
                            <td className="px-4 py-2 border border-gray-700">{event.eventPerformer}</td>
                            <td className="px-4 py-2 border border-gray-700">{event.eventDate}</td>
                            <td className="px-4 py-2 border border-gray-700">{event.eventLocation}</td>
                            <td className="px-4 py-2 border border-gray-700">{event.salesStatus}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
