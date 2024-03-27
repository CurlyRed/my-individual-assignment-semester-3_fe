import { Outlet } from "react-router-dom"; 
import ProfileNavigation from "../../components/ProfileNavigation.jsx";

function Profile() {
    return (
        <div>
            <ProfileNavigation />
            <Outlet />
        </div>
    );
}

export default Profile;

