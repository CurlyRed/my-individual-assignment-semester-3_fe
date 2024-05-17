import {Link} from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import '../../css/components/NavigationBar.css';
import AuthenticationService from '../../services/AuthenticationService';

function SupportNavigation(){

    const navigate = useNavigate();

    const handleLogout = () => {
        AuthenticationService.logout();
        navigate('/');
        window.location.reload();
    }
    return(
        <nav>
            <Link className="nav-logo" to="/">
                <img src="/icons/Logo.png" alt="home" />
            </Link>
            <div className='nav-links'>
                <Link to = '/supportDashboard'>
                    <span>Dashboard</span>
                </Link>
                <Link to ='/'>
                    <span onClick={handleLogout}>Logout</span>
                </Link>
            </div>
        </nav>
    )
}

export default SupportNavigation;