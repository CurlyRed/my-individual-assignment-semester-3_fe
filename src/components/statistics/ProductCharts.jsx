import React, { useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

const ProductCharts = ({ data }) => {
    const chartRef = useRef(null);
    const chartInstanceRef = useRef(null);

    useEffect(() => {
        if (chartInstanceRef.current) {
            chartInstanceRef.current.destroy();
        }

        const chartContext = chartRef.current.getContext('2d');

        chartInstanceRef.current = new Chart(chartContext, {
            type: 'bar',
            data: {
                labels: ['Total Sales', 'Average Order Value'],
                datasets: [
                    {
                        label: 'Revenue',
                        data: [data.totalSales, data.averageOrderValue],
                        backgroundColor: ['rgba(255, 99, 132, 0.6)', 'rgba(54, 162, 235, 0.6)'],
                        borderWidth: 1,
                    },
                ],
            },
            options: {
                scales: {
                    x: {
                        type: 'category',
                        labels: ['Total Sales', 'Average Order Value'],
                    },
                    y: {
                        beginAtZero: true,
                    },
                },
            },
        });

        return () => {
            if (chartInstanceRef.current) {
                chartInstanceRef.current.destroy();
            }
        };
    }, [data]);

    return (
        <div className="charts">
            <h2 className="text-xl font-bold mb-2">Product Charts</h2>
            <div className="chart-container">
                <canvas ref={chartRef} />
            </div>
        </div>
    );
};

export default ProductCharts;

