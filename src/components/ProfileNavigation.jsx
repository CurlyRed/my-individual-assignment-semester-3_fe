import React, { useState, useEffect } from 'react';
import { Link, useLocation } from "react-router-dom";
import { FaTruck } from "react-icons/fa";
import UserService from '../services/UserService.js';
import TokenManager from '../services/TokenManager.js';
import "../css/components/ProfileDashboardNavigation.css";

function ProfileNavigation({ userRole }) {
    const location = useLocation();
    const [user, setUser] = useState(null);
    const path = location.pathname.split("/")[2];
    const defaultTitles = {
        admin: 'Categories',
        support: 'Tickets',
        user: 'Products'
    };

    useEffect(() => {
        async function fetchUser() {
            try {
                const userData = await UserService.getUser(TokenManager.getUserId());
                setUser(userData);
            } catch (error) {
                console.error('Error fetching user:' + error);
            }
        }
        fetchUser();
    }, []);

    // Safely handle the user's balance
    const balance = user?.balance?.balance ?? 0;

    return (
        <div className="block">
            <div className="block-2">
                <div className="page-info-buttons">
                    <div>
                        <h2>
                            {path
                                ? path.charAt(0).toUpperCase() + path.slice(1)
                                : defaultTitles[userRole] || 'Products'}
                        </h2>
                    </div>
                    {userRole === 'USER' && (
                        <div className="info-buttons">
                            <div className="info-buttons-2">
                                <div className="info-buttons-3">
                                    <ul className="ul-info-style">
                                        <li className="li-text-style">
                                            Your balance: {user ? `${balance}$` : 'Loading...'}
                                        </li>
                                    </ul>
                                    <Link to="/topup">
                                        <button className="topup-button">Top up wallet</button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
                <ul className="ul-style">
                    {userRole === 'ADMIN' && (
                        <>
                            <li className={path === undefined ? 'li-selected' : 'li-notselected'}>
                                <Link to="/admindashboard">
                                    <span className="button-selected">Categories</span>
                                </Link>
                            </li>
                            <li className={path === 'analytics' ? 'li-selected' : 'li-notselected'}>
                                <Link to="/admindashboard/analytics">
                                    <span className="button-selected">Analytics</span>
                                </Link>
                            </li>
                        </>
                    )}
                    {userRole === 'SUPPORT' && (
                        <>
                            <li className={path === undefined ? 'li-selected' : 'li-notselected'}>
                                <Link to="/supportdashboard">
                                    <span className="button-selected">Tickets</span>
                                </Link>
                            </li>
                            <li className={path === 'messages' ? 'li-selected' : 'li-notselected'}>
                                <Link to="/supportdashboard/messages">
                                    <span className="button-selected">Messages</span>
                                </Link>
                            </li>
                            <li className={path === 'feedbacks' ? 'li-selected' : 'li-notselected'}>
                                <Link to="/supportdashboard/feedbacks">
                                    <span className="button-selected">Feedbacks</span>
                                </Link>
                            </li>
                            <li className={path === 'verifications' ? 'li-selected' : 'li-notselected'}>
                                <Link to="/supportdashboard/verifications">
                                    <span className="button-selected">Verifications</span>
                                </Link>
                            </li>
                        </>
                    )}
                    {(userRole === 'USER' || !userRole) && (
                        <>
                            <li className={path === undefined ? 'li-selected' : 'li-notselected'}>
                                <Link to="/profile">
                                    <span className="button-selected">Products</span>
                                </Link>
                            </li>
                            <li className={path === 'messages' ? 'li-selected' : 'li-notselected'}>
                                <Link to="/profile/messages">
                                    <span className="button-selected">Messages</span>
                                </Link>
                            </li>
                            <li className={path === 'payments' ? 'li-selected' : 'li-notselected'}>
                                <Link to="/profile/payments">
                                    <span className="button-selected">Payments</span>
                                </Link>
                            </li>
                            <li className={path === 'delivery' ? 'li-selected' : 'li-notselected'}>
                                <Link to="/profile/delivery">
                                    <span className="button-selected"><FaTruck /> Delivery</span>
                                </Link>
                            </li>
                            <li className={path === 'settings' ? 'li-selected' : 'li-notselected'}>
                                <Link to="/profile/settings">
                                    <span className="button-selected">Settings</span>
                                </Link>
                            </li>
                        </>
                    )}
                </ul>
            </div>
        </div>
    );
}

export default ProfileNavigation;

