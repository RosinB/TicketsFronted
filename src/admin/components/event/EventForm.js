import React, { useState, useEffect } from "react";
import ApiService from "../../../api/ApiService";

function EventForm() {
    const [event, setEvent] = useState({
        eventName: "", eventPerformer: "", eventDescription: "", eventLocation: "",
        eventDate: "", eventTime: "", hostName: "", eventType: "",
        eventStatus: "", salesStatus: "", picEventTicket: "", picEventList: "", picEventEvent: ""
    });
    const [tickets, setTickets] = useState([{ section: "", price: "", quantity: "" }]);
    
    const ticketDtos = tickets.map((ticket) => ({
        ticketSection: ticket.section,
        ticketPrice: ticket.price,
        ticketQuantity: ticket.quantity,
    }));
    
    // 要傳送的資料
    const postTicket = { ...event, ticketDtos };   

    const [message,setMessage]=useState("");

    // 初始化時從 localStorage 恢復數據
    useEffect(() => {
        const savedData = localStorage.getItem("eventFormDraft");
        if (savedData) {
            const { event = {}, tickets = [] } = JSON.parse(savedData);
            setEvent({ ...event });
            setTickets(tickets.length ? tickets : [{ section: "", price: "", quantity: "" }]);
        }
    }, []);


    // 保存草稿
    const saveDraft = () => {
        const payload = { event,  tickets };
        localStorage.setItem("eventFormDraft", JSON.stringify(payload));
        alert("草稿已保存！");
    };

    // 更新基本資訊
    const handleEventChange = (e) => {
        const { name, value } = e.target;
        setEvent({ ...event, [name]: value });
    };

    // 更新票務資訊
    const handleTicketChange = (index, field, value) => {
        if (field === "price" && value > 10000) return; // 價格不能超過 10000
        if (field === "quantity" && value > 10000) return; // 數量不能超過 500
        const updatedTickets = [...tickets];
        updatedTickets[index][field] = value;
        setTickets(updatedTickets);
    };

    // 添加新的票務資訊
    const addTicket = () => {
        setTickets([...tickets, { section: "", price: "", quantity: "" }]);
    };



    // 提交表單
    const handleSubmit = async(e) => {
        e.preventDefault();

        console.log("提交的資料：", postTicket);
        try {
            const response=await ApiService.addEvent(postTicket);
            setMessage(response.data.data);
            alert("新增成功");
        } catch (error) {
            console.log("新增活動失敗",error);
        }

        console.log("從後端來的資料",message);

    };





    return (
        <div className="container mx-auto px-4 py-6 text-white">
            <h1 className="text-3xl font-bold mb-6">新增演唱會</h1>
            <form onSubmit={handleSubmit}>
                {/* 演唱會基本資訊 */}
                <div className="mb-6">
                    <h2 className="text-2xl font-semibold mb-4">基本資訊</h2>
                    <div className="grid grid-cols-2 gap-4">
                        <InputForm
                            title="演唱會名稱"
                            type="text"
                            name="eventName"
                            value={event.eventName || ""}
                            onChange={handleEventChange}
                        />
                        <InputForm
                            title="表演者"
                            type="text"
                            name="eventPerformer"
                            value={event.eventPerformer || ""}
                            onChange={handleEventChange}
                        />
                        <InputForm
                            title="地點"
                            type="text"
                            name="eventLocation"
                            value={event.eventLocation || ""}
                            onChange={handleEventChange}
                        />
                        <InputForm
                            title="日期"
                            type="date"
                            name="eventDate"
                            value={event.eventDate || ""}
                            onChange={handleEventChange}
                        />
                        <InputForm
                            title="時間"
                            type="time"
                            name="eventTime"
                            value={event.eventTime || ""}
                            onChange={handleEventChange}
                        />
                        <InputForm
                            title="主辦方"
                            type="text"
                            name="hostName"
                            value={event.hostName || ""}
                            onChange={handleEventChange}
                        />
                        <div>
                            <label className="block mb-2 font-semibold">類型</label>
                            <select
                                name="eventType"
                                value={event.eventType || ""}
                                onChange={handleEventChange}
                                className="w-full p-2 border border-gray-700 rounded bg-gray-800 text-white" >                    
                                    <option value="演唱會">演唱會</option>
                                    <option value="其他">其他</option>
                            </select>
                        </div>
                        <div>
                            <label className="block mb-2 font-semibold">內容</label>
                            <textarea
                                name="eventDescription"
                                value={event.eventDescription || ""}
                                onChange={handleEventChange}
                                className="w-full p-2 border border-gray-700 rounded bg-gray-800 text-white"
                            ></textarea>
                        </div>
                    </div>
                </div>

                {/* 圖片區域 */}
                <div className="mb-6">
                    <h2 className="text-2xl font-semibold mb-4">新增圖片</h2>
                    <div className="grid grid-cols-1 gap-4">
                        <InputForm
                            title="票價區圖片"
                            type="text"
                            name="picEventTicket"
                            value={event.picEventTicket || ""}
                            onChange={handleEventChange}

                        />
                        <InputForm
                            title="List圖片"
                            type="text"
                            name="picEventList"
                            value={event.picEventList || ""}
                            onChange={handleEventChange}

                        />
                        <InputForm
                            title="活動圖片"
                            type="text"
                            name="picEventEvent"
                            value={event.picEventEvent || ""}
                            onChange={handleEventChange}

                        />
                    </div>
                </div>

                {/* 票務資訊 */}
                <div className="mb-6">
                    <h2 className="text-2xl font-semibold mb-4 grid ">票務資訊</h2>

                    {tickets.map((ticket, index) => (
                        <div key={index} className="grid grid-cols-5  mb-4">
                            <ColumnTicket
                                type="text"
                                label="區域"
                                value={ticket.section}
                                onchange={(e) => handleTicketChange(index, "section", e.target.value)}
                            />
                            <ColumnTicket
                                type="number"
                                label="價格"
                                value={ticket.price}
                                onchange={(e) => handleTicketChange(index, "price", e.target.value)}
                            />
                            <ColumnTicket
                                type="number"
                                label="數量"
                                value={ticket.quantity}
                                onchange={(e) => handleTicketChange(index, "quantity", e.target.value)}
                            />
                            {index === tickets.length - 1 && ( // 只在最後一行顯示新增按鈕
                            <button
                                type="button"
                                onClick={addTicket}
                                className="h-10 w-20 px-1 py-0.5 mt-8 bg-blue-500 text-white text-base rounded hover:bg-blue-600">
                                新增</button>
                            )}
                                </div>
                            ))}
                
                    

                </div>

                {/* 按鈕區域 */}
                <div className="flex space-x-4">
                    <button
                        type="button"
                        onClick={saveDraft}
                        className="px-6 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                    >
                        保存
                    </button>
                    <button
                        type="submit"
                        className="px-6 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                    >
                        提交
                    </button>
                </div>

            </form>
        </div>
    );
}

export default EventForm;



const InputForm = ({ title, type, name, value, onChange }) => {
    return (
        <div>
            <label className="block mb-2 font-semibold">{title}</label>
            <input
                type={type}
                name={name}
                value={value || ""}
                onChange={onChange}
                className="w-full p-2 border border-gray-700 rounded bg-gray-800 text-white"
                required
            />
        </div>
    );
};

const ColumnTicket = ({ type,label, value, onchange }) => {
    return (
        <div>
            <label className="block mb-2 font-semibold">{label}</label>
            <input
                type={type}
                value={value || ""}
                onChange={onchange}
                className="p-2 border border-gray-700 rounded bg-gray-800 text-white"
                required
            />
        </div>
    );
};