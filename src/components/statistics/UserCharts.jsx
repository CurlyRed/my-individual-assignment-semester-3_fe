import React, { useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

const UserCharts = ({ data }) => {
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
                labels: ['New Users', 'Active Users'],
                datasets: [
                    {
                        label: 'Users',
                        data: [data.newUsers, data.activeUsers],
                        backgroundColor: ['rgba(75, 192, 192, 0.6)', 'rgba(153, 102, 255, 0.6)'],
                        borderWidth: 1,
                    },
                ],
            },
            options: {
                scales: {
                    x: {
                        type: 'category',
                        labels: ['New Users', 'Active Users'],
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
            <h2 className="text-xl font-bold mb-2">User Charts</h2>
            <div className="chart-container">
                <canvas ref={chartRef} />
            </div>
        </div>
    );
};

export default UserCharts;
