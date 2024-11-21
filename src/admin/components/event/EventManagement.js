
import { Link } from "react-router-dom";



function EventManagement({ data }) {

    return (
        <div>
            <table className="table-auto w-full text-left border-collapse bg-gray-800 text-white">
                <thead>
                    <tr>
                        <ColumnName value="演唱會Id"/>
                        <ColumnName value="演唱會名稱"/>
                        <ColumnName value="表演者"/>
                        <ColumnName value="日期"/>
                        <ColumnName value="演唱會狀態"/>
                        <ColumnName value="詳情"/>

                    </tr>
                </thead>
                <tbody>
                    {data.map((event) => (
                        <tr key={event.eventId}>
                            <ColumnData value={event.eventId}/>
                            <ColumnData value={event.eventName}/>
                            <ColumnData value={event.eventPerformer}/>
                            <ColumnData value={event.eventDate}/>
                            <ColumnData value={event.eventStatus}/>
                            <ColumnData value={<Link to={`/admin/event/details/${event.eventId}`} 
                                                className="px-3 py-1 bg-blue-500  text-white rounded hover:bg-blue-600">詳情
                                                </Link>}/>

                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}


export default EventManagement

const ColumnData =({value})=>{

    return(
    <td className="px-4 py-2 border border-gray-700">{value}</td>
    )
}
const ColumnName =({value})=>{

    return(
        <th className="px-4 py-2 border border-gray-700 bg-gray-700 font-bold">{value}</th>
    )
}