import React from "react";
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";

const tabs = [
    {
        name: "近期表演",
        content: [
            { id: 1, title: "12月15日 - Vaundy巡迴演唱會" },
            { id: 2, title: "12月20日 - Ztmy演唱會" },
        ],
    },
    {
        name: "近期售票",
        content: [
            { id: 1, title: "12月1日開售 - 藤井風演唱會" },
            { id: 2, title: "12月5日開售 - Ztmy 全球巡演" },
        ],
    },
];

export default function NewsSection() {
    return (
        <div className="relative p-6 mt-5 rounded-lg shadow-lg max-w-4xl mx-auto bg-gradient-to-b from-gray-700 via-gray-800 to-black text-white">
            {/* 光暈效果 */}

            <h3 className="text-2xl font-semibold mb-4 text-white">最新消息</h3>
            <TabGroup>
                {/* 分頁標籤 */}
                <TabList className="flex gap-4 p-2  rounded-md">
                    {tabs.map((tab) => (
                        <Tab
                            key={tab.name}
                            className={({ selected }) =>
                                `px-4 py-2 text-sm font-semibold rounded-md 
                ${selected ? "bg-blue-600 text-white" : "bg-gray-300 text-gray-800 hover:bg-gray-400"}`
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
                                            className="text-gray-700 text-sm/6 p-2 rounded-md hover:bg-gray-100"
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
