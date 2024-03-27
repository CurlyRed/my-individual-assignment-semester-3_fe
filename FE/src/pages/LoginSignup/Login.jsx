import { useState } from 'react';
import '../../css/pages/Login.css';
import {FaGoogle} from 'react-icons/fa';

function Login(){
    const [isLogin, setIsLogin] = useState(true);

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
                                <button className={isLogin ? 'tab-header-selected' : 'tab-header-notselected'} onClick={() => setIsLogin(true)}>Login</button>
                                <button className={!isLogin ? 'tab-header-selected' : 'tab-header-notselected'} onClick={() => setIsLogin(false)}>Sign up</button>
                            </div>
                        </div>
                    </div>
                    <div className='signup-login-input'>
                        <form className='input-form' method="post">
                            <label>Email address</label>
                            <input type='email' className='input-field'></input>
                            <label>Password</label>
                            <input  type='password' className='input-field'></input>
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
