import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";
import ApiService from "../../api/ApiService";
import LoadingSpinner from "../../components/ui/LoadingSpinner";

// 註冊 Chart.js 組件
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const TrafficStatsChart = () => {
    const [loading, setLoading] = useState(true);
    const [chartData, setChartData] = useState({
        labels: [],
        datasets: [
            {
                label: "每秒流量",
                data: [],
                borderColor: "#3B82F6",
                backgroundColor: "rgba(59, 130, 246, 0.2)",
                pointBackgroundColor: "#FFF",
                pointBorderColor: "#3B82F6",
                tension: 0.4, // 增加平滑度
            },
        ],
    });
    const [error, setError] = useState(null);

    const fetchTrafficData = async () => {
        try {
            const now = Math.floor(Date.now() / 1000); // 當前秒
            const start = now - 60; // 過去 60 秒
            const end = now;

            const response = await ApiService.fetchTrafficPerSecond(start, end);
            const data = response.data.data;

            // 補全缺失數據
            const completeData = (start, end, data) => {
                const allTimestamps = Array.from({ length: end - start + 1 }, (_, i) => start + i);
                return allTimestamps.reduce((acc, ts) => {
                    acc[ts] = data[ts] || 0; // 填補缺失數據為 0
                    return acc;
                }, {});
            };

            const filledData = completeData(start, end, data);

            // 過濾極端值
            const filteredValues = Object.values(filledData); // 不限制最大值

            // 處理數據
            const labels = Object.keys(filledData).map((ts) =>
                new Date(ts * 1000).toLocaleTimeString()
            );

            // 更新圖表數據
            setChartData((prev) => ({
                ...prev,
                labels,
                datasets: prev.datasets.map((dataset) => ({
                    ...dataset,
                    data: filteredValues,
                })),
            }));
        } catch (err) {
            console.error("獲取流量數據失敗:", err);
            setError("無法加載每秒流量數據，請稍後再試！");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTrafficData();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <LoadingSpinner />
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center text-red-500">
                <h2 className="text-2xl font-bold mb-4">錯誤</h2>
                <p>{error}</p>
            </div>
        );
    }

    return (
        <div className="container h-full mx-auto px-4 py-6 text-white">
            <h1 className="text-center text-xl font-bold mb-6">每秒流量統計圖表</h1>
            <div className="bg-gray-800 p-4 rounded-md shadow-lg h-[450px]">
            <Line
                    data={chartData}
                    options={{
                        
                        plugins: {
                            legend: {
                                labels: {
                                    color: "#FFF",
                                },
                            },
                            tooltip: {
                                backgroundColor: "#1F2937",
                                titleColor: "#FFF",
                                bodyColor: "#FFF",
                            },
                        },
                        scales: {
                            x: {
                                ticks: {
                                    color: "#FFF",
                                    maxTicksLimit: 5, // 最多顯示 10 個標籤

                                },
                                grid: {
                                    color: "rgba(255, 255, 255, 0.1)",
                                },
                            },
                            y: {
                                min: 0,
                                ticks: {
                                    color: "#FFF",
                                    
                                },
                                grid: {
                                    color: "rgba(255, 255, 255, 0.1)",
                                },
                            },
                        },
                        responsive: true,
                        maintainAspectRatio: false,
                        animation: {
                            duration: 1000,
                            easing: "easeInOutQuad",
                        },
                    }}
                />
            </div>
        </div>
    );
};

export default TrafficStatsChart;
