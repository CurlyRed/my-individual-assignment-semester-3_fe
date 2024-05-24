import { useEffect, useState } from "react";
import TransactionService from '../../../services/TransactionService.js';
import 'tailwindcss/tailwind.css';
import TokenManager from "../../../services/TokenManager.js";

function Payments() {
    const [transactions, setTransactions] = useState([]);
    const [filters, setFilters] = useState({ fromDate: '', toDate: '', amount: '', type: '' });
    const [filteredTransactions, setFilteredTransactions] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const transactionsPerPage = 12;

    useEffect(() => {
        fetchTransactions();
    }, []);

    useEffect(() => {
        applyFilters();
    }, [filters, transactions]);

    const fetchTransactions = async () => {
        const data = await TransactionService.getTransactionsForUser(TokenManager.getUserId());
        setTransactions(data);
    };

    const handleFilterChange = (e) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    const removeFilter = (filterName) => {
        setFilters({ ...filters, [filterName]: '' });
    };

    const applyFilters = () => {
        let filtered = transactions;

        if (filters.fromDate) {
            filtered = filtered.filter(transaction => new Date(transaction.created_at) >= new Date(filters.fromDate));
        }
        if (filters.toDate) {
            filtered = filtered.filter(transaction => new Date(transaction.created_at) <= new Date(filters.toDate));
        }
        if (filters.amount) {
            filtered = filtered.filter(transaction => transaction.amount >= parseFloat(filters.amount));
        }
        if (filters.type) {
            filtered = filtered.filter(transaction => transaction.type === filters.type);
        }

        setFilteredTransactions(filtered);
        setCurrentPage(1); 
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const [datePart] = dateString.split('T');
        const dateParts = datePart.split('-');
        const year = dateParts[0];
        const month = dateParts[1];
        const day = dateParts[2];
        return `${day}-${month}-${year}`;
    };

    const getPaginatedTransactions = () => {
        const startIndex = (currentPage - 1) * transactionsPerPage;
        const endIndex = startIndex + transactionsPerPage;
        return filteredTransactions.slice(startIndex, endIndex);
    };

    const totalPages = Math.ceil(filteredTransactions.length / transactionsPerPage);

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Payments</h1>
            <div className="bg-white p-4 rounded shadow mb-4">
                <h2 className="text-xl font-semibold mb-2">Filters</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                        <label htmlFor="fromDate" className="block mb-2 font-semibold">From Date</label>
                        <input
                            type="date"
                            name="fromDate"
                            value={filters.fromDate}
                            onChange={handleFilterChange}
                            className="border p-2 rounded w-full"
                        />
                    </div>
                    <div>
                        <label htmlFor="toDate" className="block mb-2 font-semibold">To Date</label>
                        <input
                            type="date"
                            name="toDate"
                            value={filters.toDate}
                            onChange={handleFilterChange}
                            className="border p-2 rounded w-full"
                        />
                    </div>
                    <div>
                        <label htmlFor="amount" className="block mb-2 font-semibold">Amount</label>
                        <input
                            type="number"
                            name="amount"
                            value={filters.amount}
                            onChange={handleFilterChange}
                            placeholder="Amount"
                            className="border p-2 rounded w-full appearance-none"
                        />
                    </div>
                    <div>
                        <label htmlFor="type" className="block mb-2 font-semibold">Type</label>
                        <select
                            name="type"
                            value={filters.type}
                            onChange={handleFilterChange}
                            className="border p-2 rounded w-full"
                        >
                            <option value="">All Types</option>
                            <option value="TOP_UP">Top Up</option>
                            <option value="PROMOTION_PURCHASE">Promotion Purchase</option>
                            {/* Add other transaction types as needed */}
                        </select>
                    </div>
                </div>
                <div className="mt-4">
                    <h3 className="text-lg font-semibold">Applied Filters</h3>
                    <div className="flex space-x-2 mt-2">
                        {filters.fromDate && (
                            <div className="flex items-center bg-gray-200 p-2 rounded">
                                <span>From: {formatDate(filters.fromDate)}</span>
                                <button onClick={() => removeFilter('fromDate')} className="ml-2 text-red-500">x</button>
                            </div>
                        )}
                        {filters.toDate && (
                            <div className="flex items-center bg-gray-200 p-2 rounded">
                                <span>To: {formatDate(filters.toDate)}</span>
                                <button onClick={() => removeFilter('toDate')} className="ml-2 text-red-500">x</button>
                            </div>
                        )}
                        {filters.amount && (
                            <div className="flex items-center bg-gray-200 p-2 rounded">
                                <span>Amount: {filters.amount}</span>
                                <button onClick={() => removeFilter('amount')} className="ml-2 text-red-500">x</button>
                            </div>
                        )}
                        {filters.type && (
                            <div className="flex items-center bg-gray-200 p-2 rounded">
                                <span>Type: {filters.type}</span>
                                <button onClick={() => removeFilter('type')} className="ml-2 text-red-500">x</button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            {filteredTransactions.length === 0 ? (
                <div className="bg-white p-4 rounded shadow">
                    <h2 className="text-xl font-semibold mb-2">No data found based on filters</h2>
                </div>
            ) : (
                <div className="bg-white p-4 rounded shadow mb-4">
                    <h2 className="text-xl font-semibold mb-2">Transactions</h2>
                    <table className="min-w-full bg-white">
                        <thead>
                            <tr>
                                <th className="py-2">Date</th>
                                <th className="py-2">Amount</th>
                                <th className="py-2">Type</th>
                                <th className="py-2">Description</th>
                            </tr>
                        </thead>
                        <tbody>
                            {getPaginatedTransactions().map((transaction) => (
                                <tr key={transaction.id}>
                                    <td className="border px-4 py-2">{formatDate(transaction.created_at)}</td>
                                    <td className="border px-4 py-2">{transaction.amount}</td>
                                    <td className="border px-4 py-2">{transaction.type}</td>
                                    <td className="border px-4 py-2">{transaction.description}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className="flex justify-between items-center mt-4">
                        <button
                            onClick={() => setCurrentPage(currentPage > 1 ? currentPage - 1 : 1)}
                            className={`px-4 py-2 rounded-md bg-gray-200 text-gray-700 hover:bg-amber-600`}
                            disabled={currentPage === 1}
                        >
                            Previous
                        </button>
                        <span>
                            Page {currentPage} of {totalPages}
                        </span>
                        <button
                            onClick={() => setCurrentPage(currentPage < totalPages ? currentPage + 1 : totalPages)}
                            className={`px-4 py-2 rounded-md bg-gray-200 text-gray-700 hover:bg-amber-600`}
                            disabled={currentPage === totalPages}
                        >
                            Next
                        </button>
                    </div>
                </div>
            )}
            <div className="bg-white p-4 rounded shadow">
                <h2 className="text-xl font-semibold mb-2">Charts</h2>
                {/* Placeholder for charts */}
                <div className="h-64">
                    {/* Add chart component here */}
                </div>
            </div>
        </div>
    );
}

export default Payments;