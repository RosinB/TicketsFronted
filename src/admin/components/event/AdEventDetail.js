import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ApiService from "../../../api/ApiService";
import LoadingSpinner from "../../../components/ui/LoadingSpinner";

function AdEventDetail() {
    const { eventId } = useParams();
    const [event, setEvent] = useState(null); // 原始資料
    const [editableEvent, setEditableEvent] = useState(null); // 編輯中的副本
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);

    const fetchEvent = async () => {
        try {
            const response = await ApiService.fetchAdminEventById(eventId);
            setEvent(response.data.data); // 初始化主資料
            setEditableEvent({ ...response.data.data }); // 初始化副本
        } catch (error) {
            console.error("無法獲取演唱會資料:", error);
        } finally {
            setLoading(false);
        }
    };
    const eventData={
        ...editableEvent,eventId
    }


    const saveChanges = async () => {
        try {
            console.log("傳達的資料:",eventData)
           const response= await ApiService.updateEventById(eventData); // 發送更新 API
            setEvent(response.data.data); // 更新主資料
            setIsEditing(false); // 結束編輯模式
            alert("更新成功！");
        } catch (error) {
            console.error("儲存失敗:", error);
            alert("更新失敗，請稍後再試！");
        }
    };

    useEffect(() => {
        fetchEvent();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    if (loading) return <LoadingSpinner />;

    return (
        <div className="container mx-auto px-4 py-6 text-white">
            {/* 標題與按鈕 */}
            <div className="flex items-center space-x-4 mb-6">
            {/* 標題 */}
            <h1 className="text-3xl font-bold">演唱會詳情</h1>

            {/* 編輯與儲存按鈕 */}
            {!isEditing ? (
                <button
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg"
                    onClick={() => setIsEditing(true)}
                >
                    編輯
                </button>
            ) : (
                <>
                    <button
                        className="bg-green-500 text-white px-4 py-2 rounded-lg mr-2"
                        onClick={saveChanges}
                    >
                        更新
                    </button>
                    <button
                        className="bg-gray-500 text-white px-4 py-2 rounded-lg"
                        onClick={() => {
                            setEditableEvent({ ...event }); // 還原資料
                            setIsEditing(false);
                        }}
                    >
                        取消
                    </button>
                </>
            )}
        </div>
    
            {/* 基本資訊表格 */}
            <h2 className="text-2xl font-bold mt-8 mb-4">基本資訊</h2>
            <table className="table-auto border-collapse w-full bg-gray-800 text-left rounded-lg shadow-lg">
                <thead>
                    <tr className="bg-gray-700">
                        <ColumnName name="項目" />
                        <ColumnName name="內容" />
                    </tr>
                </thead>
                <tbody>
                    <ColumnData
                        name="演唱會ID"
                        value={editableEvent?.eventId}
                        isEditing={false} // 禁止編輯
                    />
                    <ColumnData
                        name="演唱會名稱"
                        value={editableEvent?.eventName}
                        isEditing={isEditing}
                        onChange={(newValue) =>
                            setEditableEvent({ ...editableEvent, eventName: newValue })
                        }
                    />
                    <ColumnData
                        name="表演者"
                        value={editableEvent?.eventPerformer}
                        isEditing={isEditing}
                        onChange={(newValue) =>
                            setEditableEvent({ ...editableEvent, eventPerformer: newValue })
                        }
                    />
                    <ColumnData
                        name="描述"
                        value={editableEvent?.eventDescription}
                        isEditing={isEditing}
                        onChange={(newValue) =>
                            setEditableEvent({ ...editableEvent, eventDescription: newValue })
                        }
                    />
                    <ColumnData
                        name="地點"
                        value={editableEvent?.eventLocation}
                        isEditing={isEditing}
                        onChange={(newValue) =>
                            setEditableEvent({ ...editableEvent, eventLocation: newValue })
                        }
                    />
                    <ColumnData
                        name="日期"
                        value={editableEvent?.eventDate}
                        isEditing={isEditing}
                        onChange={(newValue) =>
                            setEditableEvent({ ...editableEvent, eventDate: newValue })
                        }
                    />
                    <ColumnData
                        name="時間"
                        value={editableEvent?.eventTime}
                        isEditing={isEditing}
                        onChange={(newValue) =>
                            setEditableEvent({ ...editableEvent, eventTime: newValue })
                        }
                    />
                    <ColumnData
                        name="類型"
                        value={editableEvent?.eventType}
                        isEditing={isEditing}
                        onChange={(newValue) =>
                            setEditableEvent({ ...editableEvent, eventType: newValue })
                        }
                    />
                    <ColumnData
                        name="主辦"
                        value={editableEvent?.hostName}
                        isEditing={isEditing}
                        onChange={(newValue) =>
                            setEditableEvent({ ...editableEvent, hostName: newValue })
                        }
                    />
                    <ColumnData
                        name="狀態"
                        value={editableEvent?.eventStatus}
                        isEditing={false}
                        onChange={(newValue) =>
                            setEditableEvent({ ...editableEvent, eventStatus: newValue })
                        }
                    />
                    <ColumnData
                        name="銷售狀態"
                        value={editableEvent?.salesStatus}
                        isEditing={false}
                        onChange={(newValue) =>
                            setEditableEvent({ ...editableEvent, salesStatus: newValue })
                        }
                    />
                </tbody>
            </table>
            {/* 圖片表格 */}
            <h2 className="text-2xl font-bold mt-8 mb-4">圖片表格</h2>
            <table className="table-auto border-collapse w-full bg-gray-800 text-left rounded-lg shadow-lg">
                <thead>
                    <tr className="bg-gray-700">
                        <ColumnName name="首頁圖片" />
                        <ColumnName name="List圖片" />
                        <ColumnName name="票價區圖片" />
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <ColumnData1
                            value={editableEvent?.picEventTicket}
                            isEditing={isEditing}
                            onChange={(newValue) =>
                                setEditableEvent({ ...editableEvent, picEventTicket: newValue })
                            }
                        />
                        <ColumnData1
                            value={editableEvent?.picEventList}
                            isEditing={isEditing}
                            onChange={(newValue) =>
                                setEditableEvent({ ...editableEvent, picEventList: newValue })
                            }
                        />
                        <ColumnData1
                            value={editableEvent?.picEventSection}
                            isEditing={isEditing}
                            onChange={(newValue) =>
                                setEditableEvent({ ...editableEvent, picEventSection: newValue })
                            }
                        />
                    </tr>
                </tbody>
            </table>
    
            {/* 票務資訊 */}
            <h2 className="text-2xl font-bold mt-8 mb-4">票務資訊</h2>
            <table className="table-auto border-collapse w-full bg-gray-800 text-left rounded-lg shadow-lg">
                <thead>
                    <tr className="bg-gray-700">
                        <ColumnName name="區域" />
                        <ColumnName name="價格" />
                        <ColumnName name="總數量" />
                    </tr>
                </thead>
                <tbody>
                    {editableEvent?.ticketDtos.map((ticket, index) => (
                        <tr key={index}>
                            <ColumnData1
                                value={ticket.ticketSection}
                                isEditing={false}
                                onChange={(newValue) => {
                                    const updatedTickets = [...editableEvent.ticketDtos];
                                    updatedTickets[index].ticketSection = newValue;
                                    setEditableEvent({ ...editableEvent, ticketDtos: updatedTickets });
                                }}
                            />
                            <ColumnData1
                                value={ticket.ticketPrice}
                                isEditing={isEditing}
                                onChange={(newValue) => {
                                    const updatedTickets = [...editableEvent.ticketDtos];
                                    updatedTickets[index].ticketPrice = newValue;
                                    setEditableEvent({ ...editableEvent, ticketDtos: updatedTickets });
                                }}
                            />
                            <ColumnData1
                                value={ticket.ticketQuantity}
                                isEditing={isEditing}
                                onChange={(newValue) => {
                                    const updatedTickets = [...editableEvent.ticketDtos];
                                    updatedTickets[index].ticketQuantity = newValue;
                                    setEditableEvent({ ...editableEvent, ticketDtos: updatedTickets });
                                }}
                            />
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
    
}

export default AdEventDetail;

/** 表格資料顯示元件 */
const ColumnData = ({ name, value, isEditing, onChange }) => {
    return (
        <tr>
            <td className="px-4 py-2 border border-gray-600">{name}</td>
            <td className="px-4 py-2 border border-gray-600">
                {isEditing ? (
                    <input
                        type="text"
                        className="w-full px-2 py-1 bg-gray-700 text-white rounded-md"
                        value={value ?? ""} 
                        onChange={(e) => onChange(e.target.value)}
                        style={{ boxSizing: "border-box" }}
                    />
                ) : (
                    value
                )}
            </td>
        </tr>
    );
};

const ColumnData1 = ({ value, isEditing, onChange }) => {
    return (
        <td className="px-4 py-2 border border-gray-600">
            {isEditing ? (
                <input
                    type="text"
                    className="w-full px-2 py-1 bg-gray-700 text-white rounded-md"
                    value={value ?? ""}                     
                    onChange={(e) => onChange(e.target.value)}
                    style={{ boxSizing: "border-box" }}
                />
            ) : (
                value
            )}
        </td>
    );
};

const ColumnName = ({ name }) => {
    return (
        <th className="px-4 py-2 border border-gray-600 font-semibold">{name}</th>
    );
};
