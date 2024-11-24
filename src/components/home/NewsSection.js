import React from "react";
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";

function NewsSection({ allEvent }) {
    // 分類並排序
    const upcomingPerformances = allEvent
        .sort((a, b) => new Date(a.eventDate) - new Date(b.eventDate))
        .map((event) => ({
            id: event.eventId,
            title: `${event.eventDate} - ${event.eventName} (${event.eventTime})`,
        }));

    const upcomingSales = allEvent
        .sort((a, b) => new Date(a.eventSalesDate) - new Date(b.eventSalesDate))
        .map((event) => ({
            id: event.eventId,
            title: `${event.eventSalesDate} 開售 - ${event.eventName} (${event.eventSalesTime})`,
        }));

    const tabs = [
        {
            name: "即將演出",
            content: upcomingPerformances,
        },
        {
            name: "即將售票",
            content: upcomingSales,
        },
    ];

    return (
        <div className="relative p-6 mt-5 rounded-lg shadow-lg max-w-4xl mx-auto bg-gradient-to-b from-blue-800 via-teal-700 to-teal-900 text-white">
            {/* 標題 */}
            <h3 className="text-2xl font-semibold mb-4 text-white">最新消息</h3>
            <TabGroup>
                {/* 分頁標籤 */}
                <TabList className="flex gap-4 p-2 rounded-md">
                    {tabs.map((tab) => (
                        <Tab
                            key={tab.name}
                            className={({ selected }) =>
                                `px-4 py-2 text-sm font-semibold rounded-md ${
                                    selected
                                        ? "bg-blue-600 text-white"
                                        : "bg-gray-300 text-gray-800 hover:bg-gray-400"
                                }`
                            }
                        >
                            {tab.name}
                        </Tab>
                    ))}
                </TabList>

                {/* 分頁內容 */}
                <TabPanels className="mt-4">
                    {tabs.map((tab) => (
                        <TabPanel
                            key={tab.name}
                            className="p-4 bg-white rounded-md shadow-md"
                        >
                            {tab.content.length > 0 ? (
                                <ul>
                                    {tab.content.map((item) => (
                                        <li
                                            key={item.id}
                                            className="text-gray-700 text-sm p-2 rounded-md hover:bg-gray-100"
                                        >
                                            {item.title}
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-gray-600">暫無數據</p>
                            )}
                        </TabPanel>
                    ))}
                </TabPanels>
            </TabGroup>
        </div>
    );
}

export default NewsSection;
