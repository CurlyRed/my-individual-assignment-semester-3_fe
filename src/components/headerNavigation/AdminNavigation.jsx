import {Link} from 'react-router-dom';
import '../../css/components/NavigationBar.css';

function AdminNavigation(){
    return(
        <nav>
            <Link className="nav-logo" to="/">
                <img src="/icons/Logo.png" alt="home" />
            </Link>
            <div className = 'nav-links'>
                <Link to = '/admindashboard'>
                    <span>Dashboard</span>
                </Link>
            </div>
        </nav>
    )
}

export default AdminNavigation;