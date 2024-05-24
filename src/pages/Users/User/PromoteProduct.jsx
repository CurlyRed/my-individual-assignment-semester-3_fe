import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router';
import toast, { Toaster } from 'react-hot-toast';
import ProductService from '../../../services/ProductService.js';
import UserService from '../../../services/UserService.js';
import WalletService from '../../../services/WalletService.js';
import TokenManager from '../../../services/TokenManager.js';

function PromoteProduct() {
    const location = useLocation();
    const navigate = useNavigate();
    const { productId } = location.state;

    const [product, setProduct] = useState({});
    const [useBalance, setUseBalance] = useState(true);
    const [promotionDays, setPromotionDays] = useState(1);
    const [cardNumber, setCardNumber] = useState('');
    const [expiryDate, setExpiryDate] = useState('');
    const [cvv, setCvv] = useState('');
    const [cardHolderName, setCardHolderName] = useState('');
    const [balance, setBalance] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const getPricePerDay = (days) => {
        if (days >= 1 && days < 7) return 6;
        if (days >= 7 && days <= 29) return 5;
        if (days >= 30 && days <= 180) return 4;
        if (days > 180) return 2;
        return 0;
    };
    const pricePerDay = getPricePerDay(promotionDays);

    const totalCharge = pricePerDay * promotionDays;

    useEffect(() => {
        async function fetchProduct() {
            try {
                const productData = await ProductService.getProduct(productId);
                setProduct(productData);
            } catch (error) {
                toast.error('Error fetching product. Please try again.');
                console.error('Error fetching product:', error);
            }
        }
        fetchProduct();
    }, [productId]);

    useEffect(() => {
        async function fetchUser() {
            try {
                const userData = await UserService.getUser(TokenManager.getUserId());
                setBalance(userData.balance.balance);
            } catch (error) {
                toast.error('Error fetching user data. Please try again.');
                console.error('Error fetching user:', error);
            }
        }
        fetchUser();
    }, []);

    const handlePromotionDaysChange = (e) => {
        const value = e.target.value;
        if (value === '') {
            setPromotionDays(0);
        } else {
            setPromotionDays(Number(value));
        }
    };

    const handlePromotion = async () => {
        try {
            if (promotionDays <= 0) {
                toast.error('Promotion days must be greater than 0.');
                return;
            }

            if (useBalance && balance < totalCharge) {
                toast.error('Insufficient balance.');
                return;
            }

            const promotionRequest = {
                amount: totalCharge,
                productId: product.id
            };
            await WalletService.purchasePromotion(promotionRequest);
            toast.success('Promotion successful!');
        } catch (error) {
            console.error('Error promoting product:', error);
            toast.error('Error promoting product. Please try again.');
        }
    };

    const handleConfirmPromotion = () => {
        handlePromotion();
        setIsModalOpen(false);
    };

    return (
        <div className="p-4 flex flex-col items-center">
            <Toaster />
            <h1 className="text-2xl font-bold mb-6">Promote Product</h1>
            <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 bg-white p-4 shadow-md rounded-md">
                    <h2 className="text-xl font-semibold">Product Information</h2>
                    <p><strong>Name:</strong> {product.name}</p>
                    <p><strong>ID:</strong> {product.id}</p>
                    <h2 className="text-xl font-semibold mb-2 mt-6">Payment Method</h2>
                    <select
                        className="w-full p-2 border rounded-md mb-4"
                        value={useBalance ? 'balance' : 'creditCard'}
                        onChange={(e) => setUseBalance(e.target.value === 'balance')}
                    >
                        <option value="balance">Use Balance</option>
                        <option value="creditCard">Use Credit Card</option>
                    </select>
                    {!useBalance && (
                        <div>
                            <div className="mb-4">
                                <label className="block text-gray-700 mb-2">Credit Card Number</label>
                                <input
                                    type="text"
                                    className="w-full p-2 border rounded-md"
                                    value={cardNumber}
                                    onChange={(e) => setCardNumber(e.target.value)}
                                />
                            </div>
                            <div className="mb-4 grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-gray-700 mb-2">Expiry Date</label>
                                    <input
                                        type="text"
                                        className="w-full p-2 border rounded-md"
                                        value={expiryDate}
                                        onChange={(e) => setExpiryDate(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-700 mb-2">CVV</label>
                                    <input
                                        type="text"
                                        className="w-full p-2 border rounded-md"
                                        value={cvv}
                                        onChange={(e) => setCvv(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 mb-2">Card Holder Name</label>
                                <input
                                    type="text"
                                    className="w-full p-2 border rounded-md"
                                    value={cardHolderName}
                                    onChange={(e) => setCardHolderName(e.target.value)}
                                />
                            </div>
                        </div>
                    )}
                    <h2 className="text-xl font-semibold mb-2 mt-6">Promotion Details</h2>
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2">Promotion Days</label>
                        <input
                            type="number"
                            className="w-full p-2 border rounded-md"
                            value={promotionDays}
                            onChange={handlePromotionDaysChange}
                        />
                    </div>
                    <p>You will be charged: ${totalCharge}</p>
                    {useBalance && <p>Your current balance: ${balance}</p>}
                    {useBalance && <p>Your balance after promotion: ${balance - totalCharge}</p>}
                </div>
                <div className="bg-gray-100 p-4 shadow-md rounded-md">
                    <h2 className="text-xl font-semibold mb-2">Pricing Information</h2>
                    <p className="text-gray-700"><strong>Pricing Details</strong></p>
                    <p className="text-sm">1-6 days: $6/day</p>
                    <p className="text-sm">7-29 days: $5/day</p>
                    <p className="text-sm">1-6 months: $4/day</p>
                    <p className="text-sm">6 months: $2/day</p>
                </div>
                <div className="flex flex-col md:col-span-3">
                    <button
                        className="bg-red-500 text-white p-2 rounded-md hover:bg-white hover:text-red-500 border-5 border-red-500 mb-4"
                        onClick={() => navigate(-1)}
                    >
                        Go Back
                    </button>
                    <button
                        className="bg-amber-500 text-white p-2 rounded-md hover:bg-white hover:text-amber-500 border-5 border-amber-500"
                        onClick={() => setIsModalOpen(true)}
                    >
                        Promote
                    </button>
                </div>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50">
                    <div className="bg-white p-6 rounded-md shadow-md">
                        <h2 className="text-xl font-semibold mb-4">Confirm Promotion</h2>
                        <p>Are you sure you want to promote this product for {promotionDays} days at a total cost of ${totalCharge}?</p>
                        <div className="mt-6 flex justify-end space-x-4">
                            <button
                                className="bg-gray-300 text-gray-700 p-2 rounded-md hover:bg-gray-400"
                                onClick={() => setIsModalOpen(false)}
                            >
                                Cancel
                            </button>
                            <button
                                className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
                                onClick={handleConfirmPromotion}
                            >
                                Confirm
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default PromoteProduct;