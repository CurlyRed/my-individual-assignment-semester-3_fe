import React from 'react';

const FloatingData = ({ data, activeTab }) => {
    return (
        <div className="bg-white p-4 rounded shadow mb-4">
            <h2 className="text-xl font-semibold mb-2">Floating Data</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {activeTab === 'users' ? (
                    <>
                        <div className="bg-gray-100 p-4 rounded">
                            <h3 className="text-lg font-semibold">New Users</h3>
                            <p>{data.newUsers}</p>
                        </div>
                        <div className="bg-gray-100 p-4 rounded">
                            <h3 className="text-lg font-semibold">Active Users</h3>
                            <p>{data.activeUsers}</p>
                        </div>
                    </>
                ) : (
                    <>
                        <div className="bg-gray-100 p-4 rounded">
                            <h3 className="text-lg font-semibold">Total Sales</h3>
                            <p>{data.totalSales}</p>
                        </div>
                        <div className="bg-gray-100 p-4 rounded">
                            <h3 className="text-lg font-semibold">Average Order Value</h3>
                            <p>{data.averageOrderValue}</p>
                        </div>
                        <div className="bg-gray-100 p-4 rounded">
                            <h3 className="text-lg font-semibold">Sales By Category</h3>
                            <p>{JSON.stringify(data.salesByCategory)}</p>
                        </div>
                        <div className="bg-gray-100 p-4 rounded">
                            <h3 className="text-lg font-semibold">Monthly Revenue</h3>
                            <p>{JSON.stringify(data.monthlyRevenue)}</p>
                        </div>
                        <div className="bg-gray-100 p-4 rounded">
                            <h3 className="text-lg font-semibold">Transactions By Type</h3>
                            <p>{JSON.stringify(data.transactionsByType)}</p>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default FloatingData;

