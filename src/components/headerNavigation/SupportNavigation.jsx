import {Link} from 'react-router-dom';
import '../../css/components/NavigationBar.css';

function SupportNavigation(){
    return(
        <nav>
            <Link className="nav-logo" to="/">
                <img src="/icons/Logo.png" alt="home" />
            </Link>
            <div className='nav-links'>
                <Link to = '/supportDashboard'>
                    <span>Dashboard</span>
                </Link>
            </div>
        </nav>
    )
}

export default SupportNavigation;