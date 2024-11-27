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
    const [chartData, setChartData] = useState(null);
    const [error, setError] = useState(null);

    const fetchTrafficData = async () => {
        try {
            const now = Math.floor(Date.now() / 1000); // 當前秒
            const start = now - 60; // 過去 60 秒
            const end = now;

            const response = await ApiService.fetchTrafficPerSecond(start, end); // 調用秒級流量 API
            const data = response.data;

            // 處理數據
            const labels = Object.keys(data).map((ts) =>
                new Date(ts * 1000).toLocaleTimeString()
            );
            const values = Object.values(data);

            // 更新圖表數據
            setChartData({
                labels,
                datasets: [
                    {
                        label: "每秒流量",
                        data: values,
                        borderColor: "#3B82F6",
                        backgroundColor: "rgba(59, 130, 246, 0.2)",
                        pointBackgroundColor: "#FFF",
                        pointBorderColor: "#3B82F6",
                    },
                ],
            });
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
        <div className="container mx-auto px-4 py-6 text-white">
            <h1 className="text-center text-xl font-bold mb-6">每秒流量統計圖表</h1>
            <div className="bg-gray-800 p-4 rounded-md shadow-lg">
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
                                },
                                grid: {
                                    color: "rgba(255, 255, 255, 0.1)",
                                },
                            },
                            y: {
                                ticks: {
                                    color: "#FFF",
                                },
                                grid: {
                                    color: "rgba(255, 255, 255, 0.1)",
                                },
                            },
                        },
                    }}
                />
            </div>
        </div>
    );
};

export default TrafficStatsChart;
