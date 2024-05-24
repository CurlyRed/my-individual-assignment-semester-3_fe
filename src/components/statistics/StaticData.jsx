import React from 'react';

const StaticData = ({ data, activeTab }) => {
    return (
        <div className="bg-white p-4 rounded shadow mb-4">
            <h2 className="text-xl font-semibold mb-2">Static Data</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {activeTab === 'users' ? (
                    <>
                        <div className="bg-gray-100 p-4 rounded">
                            <h3 className="text-lg font-semibold">Total Users</h3>
                            <p>{data.totalUsers}</p>
                        </div>
                        <div className="bg-gray-100 p-4 rounded">
                            <h3 className="text-lg font-semibold">User Demographics By Age</h3>
                            <p>{JSON.stringify(data.userDemographicByAge)}</p>
                        </div>
                        <div className="bg-gray-100 p-4 rounded">
                            <h3 className="text-lg font-semibold">User Demographics By Gender</h3>
                            <p>{JSON.stringify(data.userDemographicByGender)}</p>
                        </div>
                        <div className="bg-gray-100 p-4 rounded">
                            <h3 className="text-lg font-semibold">User Demographics By Location</h3>
                            <p>{JSON.stringify(data.userDemographicByLocation)}</p>
                        </div>
                    </>
                ) : (
                    <>
                        <div className="bg-gray-100 p-4 rounded">
                            <h3 className="text-lg font-semibold">Total Products</h3>
                            <p>{data.totalProducts}</p>
                        </div>
                        <div className="bg-gray-100 p-4 rounded">
                            <h3 className="text-lg font-semibold">Promoted Products</h3>
                            <p>{data.promotedProducts}</p>
                        </div>
                        <div className="bg-gray-100 p-4 rounded">
                            <h3 className="text-lg font-semibold">Product Listings By Category</h3>
                            <p>{JSON.stringify(data.productListingsByCategory)}</p>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default StaticData;