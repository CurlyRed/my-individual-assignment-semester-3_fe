import { Outlet } from 'react-router-dom'; 
import ProfileNavigation from '../../../components/ProfileNavigation.jsx';

function SupportDashboard({ userRole }) {
    return(
        <div>
            <ProfileNavigation userRole={userRole} />
            <Outlet />
        </div>
    )
}

export default SupportDashboard;