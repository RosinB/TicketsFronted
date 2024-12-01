import React, { useState, useEffect } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';
import { Timer, CalendarDays, Music,TrendingUp } from 'lucide-react'; // 引入需要的 icon


function NewsSection({ allEvent }) {
    const [timers, setTimers] = useState({}); // 修正變數名稱
    
    // 取得未來的售票活動（最多3場）
    const upcomingSales = allEvent
        .filter(event => new Date(`${event.eventSalesDate} ${event.eventSalesTime}`) > new Date())
        .sort((a, b) => 
            new Date(`${a.eventSalesDate} ${a.eventSalesTime}`) - 
            new Date(`${b.eventSalesDate} ${b.eventSalesTime}`)
        )
        .slice(0, 2);



    const popularityData = allEvent.map(event => ({
        name: event.eventName,
        popularity: Math.floor(Math.random() * 100),
        interest: Math.floor(Math.random() * 80 + 20)
    }));

    // 倒數計時邏輯
    useEffect(() => {
        const timer = setInterval(() => {
            const newTimers = {};
            upcomingSales.forEach(event => {
                const saleDate = new Date(`${event.eventSalesDate} ${event.eventSalesTime}`);
                const now = new Date();
                const difference = saleDate - now;

                if (difference > 0) {
                    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
                    const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
                    const minutes = Math.floor((difference / 1000 / 60) % 60);
                    const seconds = Math.floor((difference / 1000) % 60);

                    newTimers[event.eventId] = { days, hours, minutes, seconds };
                }
            });
            setTimers(newTimers);
        }, 1000);

        return () => clearInterval(timer);
    }, [upcomingSales]);
    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white p-4 rounded-lg shadow-lg border border-blue-100">
                    <div className="flex items-center gap-2 mb-2">
                        <Music className="w-4 h-4 text-blue-500" />
                        <p className="font-semibold text-gray-800">
                            {payload[0].payload.name}
                        </p>
                    </div>
                    <p className="text-gray-600 mb-1">
                        {payload[0].payload.performer}
                    </p>
                    <p className="text-blue-600 font-semibold flex items-center gap-1">
                        <TrendingUp className="w-4 h-4" />
                        熱度: {payload[0].value}
                    </p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-12">
            <div className="grid md:grid-cols-2 gap-8">
                {/* 熱門演唱會圖表 */}
                <div className="bg-white rounded-xl p-6 shadow-xl border border-gray-100">
    <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
        <TrendingUp className="w-6 h-6 text-blue-500" /> {/* 添加圖標 */}
        <span className="bg-gradient-to-r from-blue-600 to-teal-500 text-transparent bg-clip-text">
            演唱會熱度
        </span>
    </h2>
    <div className="h-[300px] p-2 rounded-lg border-2 border-blue-100 bg-white">
        <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={popularityData}>
                <CartesianGrid 
                    strokeDasharray="3 3" 
                    stroke="#e5e7eb" 
                />
                <XAxis 
                    dataKey="name" 
                    tick={{ fill: '#4B5563' }} 
                    angle={-15}
                    height={60}
                    textAnchor="end"
                />
                <YAxis 
                    tick={{ fill: '#4B5563' }}
                    domain={[0, 100]}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area 
                    type="monotone" 
                    dataKey="popularity" 
                    stroke="#0ea5e9"
                    strokeWidth={2}
                    fill="url(#colorPopularity)" 
                    name="熱度"
                />
                <defs>
                    <linearGradient id="colorPopularity" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0.05}/>
                    </linearGradient>
                </defs>
            </AreaChart>
        </ResponsiveContainer>
    </div>
</div>

                {/* 倒數計時區塊 */}
                <div className="bg-white rounded-xl p-6 shadow-xl border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <Timer className="w-6 h-6 text-blue-500" />
            售票倒數
        </h2>
        <div className="space-y-8">
            {upcomingSales.map(event => (
                <div 
                    key={event.eventId} 
                    className="p-5 rounded-lg bg-white border-2 border-blue-100 hover:border-blue-200 transition-all duration-300 shadow-sm"
                >
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <Music className="w-5 h-5 text-blue-500" />
                        <span className="bg-gradient-to-r from-blue-600 to-teal-500 text-transparent bg-clip-text">
                            {event.eventName}
                        </span>
                    </h3>
                    {timers[event.eventId] && (
                        <div className="grid grid-cols-4 gap-4">
                            {Object.entries(timers[event.eventId]).map(([key, value]) => (
                                <motion.div
                                    key={key}
                                    className="relative overflow-hidden rounded-lg bg-gradient-to-b from-gray-50 to-gray-100 border border-gray-200 shadow-sm"
                                    whileHover={{ scale: 1.05 }}
                                    transition={{ type: "spring", stiffness: 300 }}
                                >
                                    <div className="px-3 py-2">
                                        <div className="text-2xl font-bold text-gray-800 text-center">
                                            {String(value).padStart(2, '0')}
                                        </div>
                                        <div className="text-xs text-gray-500 text-center font-medium mt-1">
                                            {key === 'days' ? '天' :
                                            key === 'hours' ? '時' :
                                            key === 'minutes' ? '分' : '秒'}
                                        </div>
                                    </div>
                                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-teal-500 opacity-80" />
                                </motion.div>
                            ))}
                        </div>
                    )}
                    <div className="mt-4 flex justify-between items-center text-sm">
                        <span className="text-gray-600 flex items-center gap-1">
                            <CalendarDays className="w-4 h-4 text-blue-500" />
                            開售時間：
                            <span className="text-blue-600 font-medium ml-1">
                                {event.eventSalesDate} {event.eventSalesTime}
                            </span>
                        </span>
                        <span className="text-gray-600">
                            表演者：
                            <span className="text-blue-600 font-medium ml-1">
                                {event.eventPerformer}
                            </span>
                        </span>
                    </div>
                </div>
            ))}
        </div>
</div>
            </div>
        </div>
    );
}

export default NewsSection;


