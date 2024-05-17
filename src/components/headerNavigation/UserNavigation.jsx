import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import '../../css/components/NavigationBar.css';
import { GoHeart, GoPerson, GoCommentDiscussion } from 'react-icons/go'
import AuthenticationService from '../../services/AuthenticationService';
import TokenManager from '../../services/TokenManager';

function UserNavigation() {

    const navigate = useNavigate();

    const handleLogout = () => {
        AuthenticationService.logout();
        navigate('/');
        window.location.reload();
    }
    
    return (
        <nav>
            <Link className="nav-logo" to="/">
                <img src="/icons/Logo.png" alt="home" />
            </Link>
            <div className="nav-links">
                <Link to="/profile/messages">
                <GoCommentDiscussion />
                    <span>  Messages</span>
                </Link>
                <Link to="/wishlist">
                    <GoHeart />
                </Link>
                <Link to="/profile">
                    <GoPerson /> 
                    <span>  My Profile</span>
                </Link>             
                <Link to="/postproduct">
                    <span className='post-product-button'>Post Product</span>
                </Link>
                {TokenManager.isAuthenticated() && (
                    <Link to='/'>
                        <span onClick={handleLogout}>Logout</span>
                    </Link>
                )}
            </div>
        </nav>
    )
}

export default UserNavigation;
