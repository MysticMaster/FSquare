import React from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    PointElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    PointElement,
    Title,
    Tooltip,
    Legend
);

interface Data {
    month: string;
    totalSales: number;
    totalRevenue: number;
}

interface Props {
    data: Data[];
}

const StatisticalChart: React.FC<Props> = ({ data }) => {
    const labels = data.map((item) => item.month);
    const totalSales = data.map((item) => item.totalSales);
    const totalRevenue = data.map((item) => item.totalRevenue);

    const chartData = {
        labels,
        datasets: [
            {
                type: 'bar',
                label: 'Doanh số (sản phẩm)',
                data: totalSales,
                backgroundColor: 'rgba(54, 142, 235, 0.6)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1,
                barThickness: 40, // Đặt độ rộng cố định
                maxBarThickness: 50, // Đặt độ rộng tối đa (nếu responsive)
                yAxisID: 'y1', // Trục y bên phải
            },
            {
                type: 'line',
                label: 'Doanh thu (VNĐ)',
                data: totalRevenue,
                borderColor: '#E02424',
                borderWidth: 2,
                pointBackgroundColor: '#9CA3AF',
                fill: false,
                yAxisID: 'y2', // Trục y bên trái
            },
        ],
    };


    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            tooltip: {
                callbacks: {
                    label: (context) => {
                        const label = context.dataset.label || '';
                        const value = context.raw;
                        if (context.dataset.yAxisID === 'y2') {
                            return `${label}: ${value.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}`;
                        }
                        return `${label}: ${value}`;
                    },
                },
            },
            datalabels: {
                display: true,
                color: '#000',
                anchor: 'end',
                align: 'start',
                formatter: (value, context) => {
                    if (context.dataset.yAxisID === 'y2') {
                        return value.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
                    }
                    return Math.round(value).toLocaleString('vi-VN'); // Làm tròn số nguyên cho doanh số
                },
            },
        },
        scales: {
            y1: {
                position: 'right',
                title: {
                    display: false,
                    text: 'Sản phẩm',
                },
                ticks: {
                    callback: (value) => Math.round(value).toLocaleString('vi-VN'), // Đảm bảo số nguyên
                },
            },
            y2: {
                position: 'left',
                title: {
                    display: false,
                    text: 'VNĐ',
                },
                ticks: {
                    callback: (value) => {
                        if (value >= 1e9) {
                            return `${(value / 1e9).toFixed(1)} b`;
                        } else if (value >= 1e6) {
                            return `${(value / 1e6).toFixed(1)} m`;
                        } else if (value >= 1e3) {
                            return `${(value / 1e3).toFixed(0)} k`;
                        }
                        return value.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
                    },
                },
            },
        },
    };

    return <Bar data={chartData} options={options} />;
};

export default StatisticalChart;
