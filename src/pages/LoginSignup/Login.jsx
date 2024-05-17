import { useState } from 'react';
import '../../css/pages/Login.css';
import {FaGoogle} from 'react-icons/fa';
import AuthenticationService from '../../services/AuthenticationService';
import UserService from '../../services/UserService';
import { useNavigate } from 'react-router-dom';
import TokenManager from '../../services/TokenManager';

function Login() {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError('');
        setSuccess('');
        try {
            const loginData = { email, password };
            const signupData = {email, password, roleId: 1};

            if (isLogin) {
                // Login
                const response = await AuthenticationService.login(loginData);
                TokenManager.setAccessToken(response);
                console.log('Login successful:', new Date().toString());

                navigate('/');
                window.location.reload();
            } else {
                // Signup
                const response = await UserService.createUser(signupData);
                setSuccess('Sign up was successful! You can now log in to your account!');
                console.log('Signup successful:', new Date().toString());
            }
        } catch (error) {
            console.error(error)
            if (error.response) {
                if (error.response.status === 400) {
                    setError(error.response.data);
                } else {
                    setError('Unknown error occurred. Please try again.');
                }
            } else if (error.message === 'Server is not accessible') {
                setError('Server is not accessible. Please try again later.');
            } else {
                setError('Unknown error occurred. Please try again.');
            }
        }        
    };

    const handleTabChange = (isLoginSelected) => {
        setEmail('');
        setPassword('');
        setError('');
        setSuccess('');
        setIsLogin(isLoginSelected);
    }

    return (
        <div className='login-page'>
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
                            <label>Email address</label>
                            <input 
                                type='email' 
                                className='input-field' 
                                value={email} 
                                onChange={(e) => setEmail(e.target.value)} 
                            />
                            <label>Password</label>
                            <input  
                                type='password' 
                                className='input-field' 
                                value={password} 
                                onChange={(e) => setPassword(e.target.value)} 
                            />
                            <p className={error ? 'error-message' : success ? 'success-message' : ''}>
                                {error ? error : success ? success : ''}
                            </p>
                            <button className='submit-button' type='submit'>
                                <span className='submit-button-style'>{isLogin ? 'Login' : 'Sign up'}</span>
                            </button>
                        </form>
                        <p>By {isLogin ? 'logging in' : 'signing up'} you agree to our terms of use.</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login;