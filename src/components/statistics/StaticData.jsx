import React from 'react';
import { Bar } from 'react-chartjs-2';
import { FaArrowRight } from 'react-icons/fa';
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

const StaticData = ({ data, activeTab }) => {
    if (activeTab === 'users') {
        const ageRanges = [
            '0-10', '10-20', '20-30', '30-40', '40-50',
            '50-60', '60-70', '70-80', '80-90', '90-100', 'Undefined'
        ];

        const ageData = {
            labels: ageRanges,
            datasets: [{
                label: 'Users by Age',
                data: ageRanges.map(range => {
                    const [start, end] = range === 'Undefined' ? [null, null] : range.split('-').map(Number);
                    return data.userDemographicByAge?.reduce((count, [age, value]) => {
                        if (range === 'Undefined') return age === null ? count + value : count;
                        return (age !== null && age >= start && age < end) ? count + value : count;
                    }, 0) || 0;
                }),
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
        };

        const genderData = {
            labels: data.userDemographicByGender?.map(item => item[0] || 'Unknown') || [],
            datasets: [{
                label: 'Users by Gender',
                data: data.userDemographicByGender?.map(item => item[1]) || [],
                backgroundColor: 'rgba(153, 102, 255, 0.6)',
                borderColor: 'rgba(153, 102, 255, 1)',
                borderWidth: 1
            }]
        };

        const locationData = data.userDemographicByLocation?.reduce((acc, [district, city, count]) => {
            if (!acc[district]) acc[district] = [];
            acc[district].push({ city, count });
            return acc;
        }, {}) || {};

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
                <h2 className="text-xl font-semibold mb-2">User Statistics</h2>
                <div className="bg-gray-100 p-4 rounded mb-4">
                    <h3 className="text-lg font-semibold">Total Users</h3>
                    <p>{data.totalUsers}</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-gray-100 p-4 rounded" style={{ height: '300px' }}>
                        <h3 className="text-lg font-semibold">Users by Age</h3>
                        <Bar data={ageData} options={chartOptions} />
                    </div>
                    <div className="bg-gray-100 p-4 rounded" style={{ height: '300px' }}>
                        <h3 className="text-lg font-semibold">Users by Gender</h3>
                        <Bar data={genderData} options={chartOptions} />
                    </div>
                    <div className="bg-gray-100 p-4 rounded">
                        <h3 className="text-lg font-semibold">Users by Location</h3>
                        {Object.entries(locationData).map(([district, cities]) => (
                            <div key={district} className="mb-2">
                                <p className="font-semibold">{district}</p>
                                <div className="ml-4">
                                    {cities.map(({ city, count }) => (
                                        <p key={city} className="flex items-center">
                                            <FaArrowRight className="mr-2" />
                                            {city}: {count}
                                        </p>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    } else if (activeTab === 'products') {
        const productCategoriesData = {
            labels: data.productListingsByCategory?.map(item => item[0]) || [],
            datasets: [{
                label: 'Products by Category',
                data: data.productListingsByCategory?.map(item => item[1]) || [],
                backgroundColor: 'rgba(255, 159, 64, 0.6)',
                borderColor: 'rgba(255, 159, 64, 1)',
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
                <h2 className="text-xl font-semibold mb-2">Product Statistics</h2>
                <div className="bg-gray-100 p-4 rounded mb-4">
                    <h3 className="text-lg font-semibold">Total Products</h3>
                    <p>{data.totalProducts}</p>
                </div>
                <div className="bg-gray-100 p-4 rounded mb-4">
                    <h3 className="text-lg font-semibold">Promoted Products</h3>
                    <p>{data.promotedProducts}</p>
                </div>
                <div className="bg-gray-100 p-4 rounded" style={{ height: '300px' }}>
                    <h3 className="text-lg font-semibold">Product Listings by Category</h3>
                    <Bar data={productCategoriesData} options={chartOptions} />
                </div>
            </div>
        );
    }
    return null;
};

export default StaticData;
