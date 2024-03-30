import { Outlet } from 'react-router-dom'; 
import ProfileNavigation from '../../../components/ProfileNavigation.jsx';

function Profile({ userRole }) {
    return (
        <div>
            <ProfileNavigation userRole={userRole}/>
            <Outlet />
        </div>
    );
}

export default Profile;

