import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const FloatingData = ({ data, activeTab }) => {
    if (activeTab === 'products') {
        const salesByCategoryData = {
            labels: data.salesByCategory?.map(item => item[0]) || [],
            datasets: [{
                label: 'Sales by Category',
                data: data.salesByCategory?.map(item => item[1]) || [],
                backgroundColor: 'rgba(255, 99, 132, 0.6)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1
            }]
        };

        const monthlyRevenueData = {
            labels: data.monthlyRevenue?.map(item => item[0]) || [],
            datasets: [{
                label: 'Monthly Revenue',
                data: data.monthlyRevenue?.map(item => item[1]) || [],
                backgroundColor: 'rgba(54, 162, 235, 0.6)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
            }]
        };

        const transactionsByTypeData = {
            labels: data.transactionsByType?.map(item => item[0]) || [],
            datasets: [{
                label: 'Transactions by Type',
                data: data.transactionsByType?.map(item => item[1]) || [],
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
        };

        const chartOptions = {
            maintainAspectRatio: false,
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        };

        return (
            <div className="bg-white p-4 rounded shadow mb-4">
                <h2 className="text-xl font-semibold mb-2">Floating Data</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="bg-gray-100 p-4 rounded">
                        <h3 className="text-lg font-semibold">Total Sales($)</h3>
                        <p>{data.totalSales}</p>
                    </div>
                    <div className="bg-gray-100 p-4 rounded">
                        <h3 className="text-lg font-semibold">Average Order Value($)</h3>
                        <p>{data.averageOrderValue}</p>
                    </div>
                    <div className="bg-gray-100 p-4 rounded" style={{ height: '300px' }}>
                        <h3 className="text-lg font-semibold">Sales By Category($)</h3>
                        <Bar data={salesByCategoryData} options={chartOptions} />
                    </div>
                    <div className="bg-gray-100 p-4 rounded" style={{ height: '300px' }}>
                        <h3 className="text-lg font-semibold">Monthly Revenue($)</h3>
                        <Bar data={monthlyRevenueData} options={chartOptions} />
                    </div>
                    <div className="bg-gray-100 p-4 rounded" style={{ height: '300px' }}>
                        <h3 className="text-lg font-semibold">Transactions By Type</h3>
                        <Bar data={transactionsByTypeData} options={chartOptions} />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white p-4 rounded shadow mb-4">
            <h2 className="text-xl font-semibold mb-2">Floating Data</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <div className="bg-gray-100 p-4 rounded">
                    <h3 className="text-lg font-semibold">New Users</h3>
                    <p>{data.newUsers}</p>
                </div>
                <div className="bg-gray-100 p-4 rounded">
                    <h3 className="text-lg font-semibold">Active Users</h3>
                    <p>{data.activeUsers}</p>
                </div>
            </div>
        </div>
    );
};

export default FloatingData;


