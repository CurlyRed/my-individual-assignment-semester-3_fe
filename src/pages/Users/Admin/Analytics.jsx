import React, { useState, useEffect } from 'react';

import '../../../css/components/ProfileDashboardNavigation.css';

import WebsiteStatisticsService from '../../../services/WebsiteStatisticsService.js';
import StaticData from '../../../components/statistics/StaticData.jsx';
import FloatingData from '../../../components/statistics/FloatingData.jsx';


const Analytics = () => {
    const [activeTab, setActiveTab] = useState('users');
    const [staticData, setStaticData] = useState({});
    const [filters, setFilters] = useState({ startDate: '', endDate: '' });
    const [filteredData, setFilteredData] = useState({});

    const handleTabChange = (tab) => {
        setActiveTab(tab);
        setFilters({ startDate: '', endDate: '' });
        setFilteredData({});
    };

    useEffect(() => {
        const fetchStaticData = async () => {
            try {
                if (activeTab === 'users') {
                    const totalUsers = await WebsiteStatisticsService.getTotalUsers();
                    const userDemographicByAge = await WebsiteStatisticsService.getUserDemographicsByAge();
                    console.log(userDemographicByAge)
                    const userDemographicByGender = await WebsiteStatisticsService.getUserDemographicsByGender();
                    const userDemographicByLocation = await WebsiteStatisticsService.getUserDemographicsByLocation();
                    console.log(userDemographicByLocation)
                    setStaticData({ totalUsers, userDemographicByAge, userDemographicByGender, userDemographicByLocation });
                } else if (activeTab === 'products') {
                    const totalProducts = await WebsiteStatisticsService.getTotalProducts();
                    const promotedProducts = await WebsiteStatisticsService.getPromotedProducts();
                    const productListingsByCategory = await WebsiteStatisticsService.getProductListingsByCategory();
                    setStaticData({ totalProducts, promotedProducts, productListingsByCategory });
                }
            } catch (error) {
                console.error('Error fetching static data:', error);
            }
        };
        fetchStaticData();
    }, [activeTab]);

    const handleFilterChange = (event) => {
        const { name, value } = event.target;
        setFilters({ ...filters, [name]: value });
    };

    const removeFilter = (filterName) => {
        setFilters({ ...filters, [filterName]: '' });
        setFilteredData({});
    };

    const applyFilters = async () => {
        const { startDate, endDate } = filters;
        try {
            if (activeTab === 'users') {
                const newUsers = await WebsiteStatisticsService.getNewUsers(startDate, endDate);
                const activeUsers = await WebsiteStatisticsService.getActiveUsers(startDate, endDate);
                setFilteredData({ newUsers, activeUsers });
            } else if (activeTab === 'products') {
                const totalSales = await WebsiteStatisticsService.getTotalSales(startDate, endDate);
                const averageOrderValue = await WebsiteStatisticsService.getAverageOrderValue(startDate, endDate);
                const salesByCategory = await WebsiteStatisticsService.getSalesByCategory(startDate, endDate);
                const monthlyRevenue = await WebsiteStatisticsService.getMonthlyRevenue(startDate, endDate);
                const transactionsByType = await WebsiteStatisticsService.getTransactionsByType(startDate, endDate);
                setFilteredData({ totalSales, averageOrderValue, salesByCategory, monthlyRevenue, transactionsByType });
            }
        } catch (error) {
            console.error('Error applying filters:', error);
        }
    };

    useEffect(() => {
        if (filters.startDate && filters.endDate) {
            applyFilters();
        } else {
            setFilteredData({});
        }
    }, [filters, activeTab]);

    return (
        <div className="container mx-auto p-4">
            <div className="flex mb-4">
                <ul className="ul-style flex space-x-8">
                    <li
                        className={`cursor-pointer ${activeTab === 'users' ? 'li-selected' : 'li-notselected'}`}
                        onClick={() => handleTabChange('users')}
                    >
                        <span className="button-selected">Users</span>
                    </li>
                    <li
                        className={`cursor-pointer ${activeTab === 'products' ? 'li-selected' : 'li-notselected'}`}
                        onClick={() => handleTabChange('products')}
                    >
                        <span className="button-selected">Products/Revenue</span>
                    </li>
                </ul>
            </div>

            <StaticData data={staticData} activeTab={activeTab} />

            <div className="bg-white p-4 rounded shadow mb-4">
                <h2 className="text-xl font-semibold mb-2">Select Date Range</h2>
                <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                        <label htmlFor="startDate" className="block mb-2 font-semibold">From Date</label>
                        <input
                            type="date"
                            className="border p-2 rounded w-full"
                            name="startDate"
                            value={filters.startDate}
                            onChange={handleFilterChange}
                        />
                    </div>
                    <div>
                        <label htmlFor="endDate" className="block mb-2 font-semibold">To Date</label>
                        <input
                            type="date"
                            className="border p-2 rounded w-full"
                            name="endDate"
                            value={filters.endDate}
                            onChange={handleFilterChange}
                        />
                    </div>
                </div>
                <div className="mt-4">
                    <h3 className="text-lg font-semibold">Applied Filters</h3>
                    <div className="flex space-x-2 mt-2">
                        {filters.startDate && (
                            <div className="flex items-center bg-gray-200 p-2 rounded">
                                <span>From: {filters.startDate}</span>
                                <button onClick={() => removeFilter('startDate')} className="ml-2 text-red-500">x</button>
                            </div>
                        )}
                        {filters.endDate && (
                            <div className="flex items-center bg-gray-200 p-2 rounded">
                                <span>To: {filters.endDate}</span>
                                <button onClick={() => removeFilter('endDate')} className="ml-2 text-red-500">x</button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {activeTab === 'users' && (
                <>
                    <FloatingData data={filteredData} activeTab={activeTab} />
                </>
            )}
            {activeTab === 'products' && (
                <>
                    <FloatingData data={filteredData} activeTab={activeTab} />
                </>
            )}
        </div>
    );
};

export default Analytics;