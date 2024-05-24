import React, { useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { FaGoogle } from 'react-icons/fa';
import AuthenticationService from '../../services/AuthenticationService';
import UserService from '../../services/UserService';
import { useNavigate } from 'react-router-dom';
import TokenManager from '../../services/TokenManager';
import '../../css/pages/Login.css';

function Login() {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [passwordValidation, setPasswordValidation] = useState({
        length: false,
        upperCase: false,
        number: false,
        specialChar: false,
    });
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const loginData = { email, password };
            const signupData = { email, password, roleId: 1 };

            if (isLogin) {
                const response = await AuthenticationService.login(loginData);
                TokenManager.setAccessToken(response);
                toast.success('Login successful!');
                navigate('/');
                window.location.reload();
            } else {
                if (password !== confirmPassword) {
                    toast.error('Passwords do not match!');
                    return;
                }
                if (!validateEmail(email) || !validatePassword(password)) {
                    return;
                }
                await UserService.createUser(signupData);
                toast.success('Sign up was successful! You can now log in to your account!');
                handleTabChange(true);
            }
        } catch (error) {
            console.error(error);
            if (error.response) {
                if (error.response.status === 400) {
                    toast.error(error.response.data);
                } else {
                    toast.error('Unknown error occurred. Please try again.');
                }
            } else if (error.message === 'Server is not accessible') {
                toast.error('Server is not accessible. Please try again later.');
            } else {
                toast.error('Unknown error occurred. Please try again.');
            }
        }
    };

    const handleTabChange = (isLoginSelected) => {
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        setEmailError('');
        setPasswordError('');
        setPasswordValidation({
            length: false,
            upperCase: false,
            number: false,
            specialChar: false,
        });
        setIsLogin(isLoginSelected);
    };

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email) && email !== '') {
            setEmailError('Invalid email address');
            return false;
        } else {
            setEmailError('');
            return true;
        }
    };

    const validatePassword = (password) => {
        const length = password.length >= 8;
        const upperCase = /[A-Z]/.test(password);
        const number = /\d/.test(password);
        const specialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

        setPasswordValidation({
            length,
            upperCase,
            number,
            specialChar,
        });

        if ((length && upperCase && number && specialChar) || password === '') {
            setPasswordError('');
            return true;
        } else {
            setPasswordError('Password does not meet the requirements');
            return false;
        }
    };

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
        if (!isLogin) validateEmail(e.target.value);
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
        if (!isLogin) validatePassword(e.target.value);
    };

    return (
        <div className='login-page'>
            <Toaster />
            <div className='animated-background'></div>
            <div className='login-box'>
                <div className='continue-with-box'>
                    <div className='continue-with-style'>
                        <button className='continue-with-button' type='button'>
                            <span className='continue-with-button-text'>
                                <FaGoogle />
                                Continue with Google
                            </span>
                        </button>
                    </div>
                    <div className='or-separator'>
                        <div className='line' />
                        <div className='or'>or</div>
                        <div className='line' />
                    </div>
                </div>
                <div className='login-signup-box'>
                    <div className='tabs'>
                        <div className='tabs-style'>
                            <div className='tab-header-style'>
                                <button className={isLogin ? 'tab-header-selected' : 'tab-header-notselected'}
                                    onClick={() => handleTabChange(true)}>Login</button>
                                <button className={!isLogin ? 'tab-header-selected' : 'tab-header-notselected'}
                                    onClick={() => handleTabChange(false)}>Sign up</button>
                            </div>
                        </div>
                    </div>
                    <div className='signup-login-input'>
                        <form className='input-form' onSubmit={handleSubmit}>
                            <label>
                                Email address
                                {emailError && <span className='text-red-500 ml-2'>✖</span>}
                            </label>
                            <input
                                type='email'
                                className='input-field'
                                value={email}
                                onChange={handleEmailChange}
                                required
                            />
                            {emailError && <p className='text-red-500'>{emailError}</p>}
                            <label>
                                Password
                                {passwordError && <span className='text-red-500 ml-2'>✖</span>}
                            </label>
                            <input
                                type='password'
                                className='input-field'
                                value={password}
                                onChange={handlePasswordChange}
                                required
                            />
                            {!isLogin && password && (
                                <div className='password-requirements'>
                                    <p>Password must include:</p>
                                    <ul>
                                        <li className={passwordValidation.length ? 'text-green-500' : 'text-red-500'}>
                                            {passwordValidation.length ? '✔' : '✖'} At least 8 characters
                                        </li>
                                        <li className={passwordValidation.upperCase ? 'text-green-500' : 'text-red-500'}>
                                            {passwordValidation.upperCase ? '✔' : '✖'} An uppercase letter
                                        </li>
                                        <li className={passwordValidation.number ? 'text-green-500' : 'text-red-500'}>
                                            {passwordValidation.number ? '✔' : '✖'} A number
                                        </li>
                                        <li className={passwordValidation.specialChar ? 'text-green-500' : 'text-red-500'}>
                                            {passwordValidation.specialChar ? '✔' : '✖'} A special character
                                        </li>
                                    </ul>
                                </div>
                            )}
                            {passwordError && <p className='text-red-500'>{passwordError}</p>}
                            {!isLogin && (
                                <>
                                    <label>Confirm Password</label>
                                    <input
                                        type='password'
                                        className='input-field'
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        required
                                    />
                                </>
                            )}
                            <button className='submit-button' type='submit'>
                                <span className='submit-button-style'>{isLogin ? 'Login' : 'Sign up'}</span>
                            </button>
                        </form>
                        <p>By {isLogin ? 'logging in' : 'signing up'} you agree to our terms of use.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;

