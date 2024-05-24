import { Link, useNavigate } from 'react-router-dom';
import AuthenticationService from '../../services/AuthenticationService';

function AdminNavigation() {
  const navigate = useNavigate();

  const handleLogout = () => {
    AuthenticationService.logout();
    navigate('/');
    window.location.reload();
  };

  return (
    <nav className="flex items-center justify-between w-full">
      <Link className="flex-shrink-0" to="/">
        <img src="/icons/Logo.png" alt="home" className="h-10 w-10" />
      </Link>
      <div className="flex flex-grow justify-end items-center space-x-6 ml-4">
        <Link to="/admindashboard" className="text-white hover:text-gray-200 text-lg">
          Dashboard
        </Link>
        <div className="flex items-center space-x-6">
          <span className="text-white text-lg">|</span>
          <button onClick={handleLogout} className="text-white hover:text-gray-200 text-lg">
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}

export default AdminNavigation;
