import { Outlet } from "../../components/ProfileNavigation.jsx"; 

function Profile() {
    return (
        <div>
            <ProfileNavigation />
            <Outlet />
        </div>
    );
}

export default Profile;

