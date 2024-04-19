import { Link } from 'react-router-dom';
import '../../css/components/NavigationBar.css';
import { GoHeart, GoPerson, GoCommentDiscussion } from 'react-icons/go'

function UserNavigation() {
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
            </div>
        </nav>
    )
}

export default UserNavigation;
