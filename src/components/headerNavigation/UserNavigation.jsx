import { Link, useNavigate } from 'react-router-dom';
import { GoHeart, GoPerson, GoCommentDiscussion } from 'react-icons/go';
import { FaTruck, FaChevronDown } from 'react-icons/fa';
import AuthenticationService from '../../services/AuthenticationService';
import TokenManager from '../../services/TokenManager';
import UserService from '../../services/UserService';
import { useState, useEffect } from 'react';

function UserNavigation() {
  const navigate = useNavigate();
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    async function fetchUser() {
      try {
        const userData = await UserService.getUser(TokenManager.getUserId());
        if (userData && userData.email) {
          const emailName = userData.email.split('@')[0];
          setUserEmail(emailName);
        }
      } catch (error) {
        console.error('Failed to fetch user data:', error);
      }
    }
    if (TokenManager.isAuthenticated()) {
      fetchUser();
    }
  }, []);

  const handleLogout = () => {
    AuthenticationService.logout();
    navigate('/');
    window.location.reload();
  };

  const userImage = '/icons/Unknown.png'; // Default image or replace with actual user image path

  const isAuthenticated = TokenManager.isAuthenticated();

  return (
    <nav className="flex items-center justify-between w-full">
      <Link className="flex-shrink-0" to="/">
        <img src="/icons/Logo.png" alt="home" className="h-10 w-10" />
      </Link>
      <div className="flex flex-grow justify-end items-center space-x-6 ml-4">
        <Link to="/profile/messages" className="flex items-center space-x-1 text-white hover:text-gray-200 text-lg">
          <GoCommentDiscussion className="text-xl" />
          <span>Messages</span>
        </Link>
        <Link to="/wishlist" className="text-white hover:text-gray-200 text-lg">
          <GoHeart className="text-xl" />
        </Link>
        <div 
          className="relative"
          onMouseEnter={() => isAuthenticated && setDropdownVisible(true)}
          onMouseLeave={() => isAuthenticated && setDropdownVisible(false)}
        >
          <Link to={isAuthenticated ? "#" : "/profile"} className="flex items-center space-x-1 text-white hover:text-gray-200 text-lg cursor-pointer">
            <GoPerson className="text-xl" />
            <span>My Profile</span>
            {isAuthenticated && <FaChevronDown className="text-white" />}
          </Link>
          {isDropdownVisible && isAuthenticated && (
            <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md py-2 z-50">
              <div className="px-4 py-2 flex items-center space-x-2 border-b">
                <img src={userImage} alt="Profile" className="h-8 w-8 rounded-full" />
                <span className="text-gray-800">{userEmail}</span>
              </div>
              <Link to="/profile" className="block px-4 py-2 text-gray-800 hover:bg-[#ffa500]">Products</Link>
              <Link to="/profile/messages" className="block px-4 py-2 text-gray-800 hover:bg-[#ffa500]">Messages</Link>
              <Link to="/profile/payments" className="block px-4 py-2 text-gray-800 hover:bg-[#ffa500]">Payments</Link>
              <Link to="/profile/delivery" className="block px-4 py-2 text-gray-800 hover:bg-[#ffa500] flex items-center space-x-2">
                <FaTruck />
                <span>Delivery</span>
              </Link>
              <Link to="/profile/settings" className="block px-4 py-2 text-gray-800 hover:bg-[#ffa500]">Settings</Link>
              <div className="border-t my-2"></div>
              <button 
                onClick={handleLogout} 
                className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-[#ffa500] border-0 rounded-none"
              >
                Logout
              </button>
            </div>
          )}
        </div>
        <Link to="/postproduct">
          <span className="px-4 py-2 border-2 border-[#ffa500] text-[#ffa500] rounded-md bg-white hover:bg-[#ffa500] hover:text-white hover:border-white transition-colors text-lg">
            Post Product
          </span>
        </Link>
        {isAuthenticated && (
          <div className="flex items-center space-x-6">
            <span className="text-white text-lg">|</span>
            <button onClick={handleLogout} className="text-white hover:text-gray-200 text-lg">
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}

export default UserNavigation;
