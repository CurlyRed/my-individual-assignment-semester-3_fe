import '../../../css/pages/WalletTopUp.css';
function WalletTopUp() {
    return (
        <div className= 'page-content'>
            <h6>
                <div className="h6-number">1</div>
                Choose top up amount
            </h6>
            <div className="top-up-description-box">
                <p className="p-description">Your balance can be used for payments for:</p>
                <ol>
                    <li>
                        <span className='span-allowed'>1</span>
                        <p className='ol-items'>advertisemnt</p>
                    </li>
                    <li>
                        <span className='span-allowed'>2</span>
                        <p className='ol-items'>product posts</p>
                    </li>
                    <li>
                        <span className='span-allowed'>3</span>
                        <p className='ol-items'>other paid services</p>
                    </li>                
                </ol>
                <p className="p-description">Can not be used for payments for:</p>
                <ol>
                    <li>
                        <span className='span-not-allowed'>1</span>
                        <p className='ol-items'>sponsoring war</p>
                    </li>
                </ol>
            </div>
            <div>
                <label>
                    <input type='radio'></input>
                    <div></div>
                    <div>1 000, 00 $</div>
                </label>
            </div>
            <div>
                <div>
                    <div>
                        <button>Cancel</button>
                        <button>Pay</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default WalletTopUp;