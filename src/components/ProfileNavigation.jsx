import { Link, useLocation } from "react-router-dom";
import {FaTruck} from "react-icons/fa";
import "../css/components/ProfileNavigation.css"

function ProfileNavigation() {
  const location = useLocation();
  const path = location.pathname.split("/")[2]; // Get the subpath under /profile

  return (
    <div className="block">
      <div className="block-2">
        <div className="page-info-buttons">
          <div>
            <h2>{path ? path.charAt(0).toUpperCase() + path.slice(1) : 'Products'}</h2> 
          </div>
          <div className="info-buttons">
            <div className="info-buttons-2">
              <div className="info-buttons-3">
                <ul className="ul-info-style">
                  <li className="li-text-style">Your balance: 0$</li>
                </ul>
                <button className="topup-button">Top up wallet</button>
              </div>
            </div>
          </div>
        </div>
          <ul className="ul-style">
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
                <span className="button-selected"> <FaTruck />  Delivery</span>
              </Link>
            </li>
            <li className={path === 'settings' ? 'li-selected' : 'li-notselected'}>
              <Link to="/profile/settings">
                <span className="button-selected">Settings</span>
              </Link>
            </li>
          </ul>
      </div>
    </div>
  );
}

export default ProfileNavigation;
