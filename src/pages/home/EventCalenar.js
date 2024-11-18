import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css"; // 引入樣式文件
import "./CustomCalendar.css"; // 自定義樣式

function EventCalendar() {
    const [value, setValue] = useState(new Date());

    const highlightDates = [
        new Date(2024, 11, 1),
        new Date(2024, 11, 20),
    ];

    return (
        <div className="custom-calendar">
            <Calendar
                onChange={setValue}
                value={value}
                tileClassName={({ date }) =>
                    highlightDates.some(
                        (highlightDate) =>
                            date.getDate() === highlightDate.getDate() &&
                            date.getMonth() === highlightDate.getMonth() &&
                            date.getFullYear() === highlightDate.getFullYear()
                    )
                        ? "highlight"
                        : ""
                }
            />
        </div>
    );
}

export default EventCalendar;
