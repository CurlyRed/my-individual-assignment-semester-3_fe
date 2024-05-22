import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/20/solid';
import toast, { Toaster } from 'react-hot-toast';
import walletService from '../../../services/WalletService.js';

const TopUp = () => {
    const [amount, setAmount] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const navigate = useNavigate();

    const handleAmountChange = (e) => {
        setAmount(e.target.value);
    };

    const openModal = () => {
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
    };

    const openConfirmation = () => {
        setShowConfirmation(true);
    };

    const closeConfirmation = () => {
        setShowConfirmation(false);
    };

    const handleTopUp = async () => {
        try {
            await walletService.topUp({ amount: parseFloat(amount) });
            toast.success('Top-up successful!');
            closeConfirmation();
            closeModal();
            setAmount('');
        } catch (error) {
            toast.error('Top-up failed. Please try again.');
            console.error(error);
        }
    };

    return (
        <div className="p-6 max-w-md mx-auto bg-white rounded-xl shadow-md space-y-4">
            <Toaster />
            <div className="bg-gray-100 p-4 rounded-lg shadow-inner">
                <h2 className="text-xl font-bold mb-2">Disclaimer</h2>
                <h3 className="text-lg font-semibold mb-2">You can use your balance for:</h3>
                <ul className="list-none space-y-2">
                    <li className="flex items-center">
                        <CheckCircleIcon className="h-6 w-6 text-green-500 mr-2" />
                        <span>You can use it to buy promotions for products.</span>
                    </li>
                    <li className="flex items-center">
                        <CheckCircleIcon className="h-6 w-6 text-green-500 mr-2" />
                        <span>You can use it for other paid services.</span>
                    </li>
                </ul>
                <h3 className="text-lg font-semibold mt-4">You cannot use your balance for:</h3>
                <ul className="list-none space-y-2">
                    <li className="flex items-center">
                        <XCircleIcon className="h-6 w-6 text-red-500 mr-2" />
                        <span>You are not allowed to use it to sponsor war.</span>
                    </li>
                </ul>
            </div>

            <h3 className="text-lg font-semibold">Choose payment amount</h3>
            <select
                value={amount}
                onChange={handleAmountChange}
                className="block w-full mt-2 p-2 border border-gray-300 rounded-md"
            >
                <option value="">Select Amount</option>
                {[10, 20, 50, 100, 200, 500, 1000].map(value => (
                    <option key={value} value={value}>${value}</option>
                ))}
            </select>

            <div className="flex justify-between mt-4">
                <button
                    onClick={() => navigate(-1)}
                    className="bg-red-500 text-white py-2 px-4 rounded-md border border-red-500 hover:bg-white hover:text-red-500 hover:border-2 hover:border-red-500 transition"
                >
                    Cancel
                </button>
                <button
                    onClick={openModal}
                    className="bg-amber-500 text-white py-2 px-4 rounded-md border border-amber-500 hover:bg-white hover:text-amber-500 hover:border-2 hover:border-amber-500 transition"
                >
                    Pay
                </button>
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-md shadow-md space-y-4">
                        <h3 className="text-lg font-semibold">Enter Credit Card Information</h3>
                        <form className="space-y-4">
                            <div>
                                <label className="block text-gray-700">Card Number</label>
                                <input type="text" name="cardNumber" className="w-full p-2 border border-gray-300 rounded-md" />
                            </div>
                            <div className="flex space-x-4">
                                <div className="flex-1">
                                    <label className="block text-gray-700">Expiration Date</label>
                                    <input type="text" name="expiryDate" className="w-full p-2 border border-gray-300 rounded-md" />
                                </div>
                                <div className="flex-1">
                                    <label className="block text-gray-700">CVV</label>
                                    <input type="text" name="cvv" className="w-full p-2 border border-gray-300 rounded-md" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-gray-700">Name on Card</label>
                                <input type="text" name="cardName" className="w-full p-2 border border-gray-300 rounded-md" />
                            </div>
                        </form>
                        <div className="flex justify-between">
                            <button
                                onClick={closeModal}
                                className="bg-red-500 text-white py-2 px-4 rounded-md border border-red-500 hover:bg-white hover:text-red-500 hover:border-2 hover:border-red-500 transition"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={openConfirmation}
                                className="bg-amber-500 text-white py-2 px-4 rounded-md border border-amber-500 hover:bg-white hover:text-amber-500 hover:border-2 hover:border-amber-500 transition"
                            >
                                Pay
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showConfirmation && (
                <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-md shadow-md space-y-4">
                        <p>Are you sure you want to proceed with the payment?</p>
                        <div className="flex justify-between">
                            <button
                                onClick={closeConfirmation}
                                className="bg-red-500 text-white py-2 px-4 rounded-md border border-red-500 hover:bg-white hover:text-red-500 hover:border-2 hover:border-red-500 transition"
                            >
                                No
                            </button>
                            <button
                                onClick={handleTopUp}
                                className="bg-green-500 text-white py-2 px-4 rounded-md border border-green-500 hover:bg-white hover:text-green-500 hover:border-2 hover:border-green-500 transition"
                            >
                                Yes
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TopUp;
