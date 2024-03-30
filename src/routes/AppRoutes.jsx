import { Route, Routes, Navigate } from 'react-router-dom';

{/* General imports */}
import DefaultLayout from '../layouts/DefaultLayout.jsx';
import Home from '../pages/general/Home.jsx';

{/* Imports for user role */}
import Messages from '../pages/Users/User/Messages.jsx';
import Wishlist from '../pages/Users/User/Wishlist.jsx';
import Profile from '../pages/Users/User/Profile.jsx';
import Products from '../pages/Users/User/Products.jsx';
import Payments from '../pages/Users/User/Payments.jsx';
import Delivery from '../pages/Users/User/Delivery.jsx';
import Settings from '../pages/Users/User/Settings.jsx';
import PostProduct from '../pages/general/PostProduct.jsx';

{/* Imports for support role */}
import Tickets from '../pages/Users/Support/Tickets.jsx';
import MessagesSupport from '../pages/Users/Support/Messages.jsx';
import FeedbackManagement from '../pages/Users/Support/FeedbackManagement.jsx';
import SupportDashboard from '../pages/Users/Support/SupportDashboard.jsx';
import Verifications from '../pages/Users/Support/Verifications.jsx';

{/* Imports for admin role */}
import Analytics from '../pages/Users/Admin/Analytics.jsx';
import CategoryManagement from '../pages/Users/Admin/CategoryManagement.jsx';
import AdminDashboard from '../pages/Users/Admin/AdminDashboard.jsx'; 

import Login from '../pages/loginSignup/Login.jsx';

function AppRoutes({ isAuthorized, userRole }) {
  return (
    <Routes>
      <Route path="/" element={<DefaultLayout userRole={userRole} />}>
        <Route index element={<Home />} />
        <Route path="/messages" element={isAuthorized ? <Messages /> : <Navigate to="/login" />} />
        <Route path="/wishlist" element={isAuthorized ? <Wishlist /> : <Navigate to="/login" />} />
        <Route path="/postproduct" element={isAuthorized ? <PostProduct /> : <Navigate to="/login" />} />
        <Route path="/profile" element={isAuthorized ? <Profile userRole={userRole}/> : <Navigate to="/login" />}>
          <Route index element={<Products />} />
          <Route path="messages" element={<Messages />} />
          <Route path="payments" element={<Payments />} />
          <Route path="delivery" element={<Delivery />} />
          <Route path="settings" element={<Settings />} />
        </Route>

        {/* Support routing */}
        <Route path="/supportdashboard" element={isAuthorized ? <SupportDashboard userRole={userRole}/> : <Navigate to="/login" />}>
          <Route index element={<Tickets/>}/>
          <Route path="messages" element={<MessagesSupport />} />
          <Route path="feedbacks" element={<FeedbackManagement />} />
          <Route path="verifications" element={<Verifications />} />
        </Route>


        {/* Admin routing */}
        <Route path="admindashboard" element={isAuthorized ? <AdminDashboard userRole={userRole}/> : <Navigate to = "/login" />}>
          <Route index element={<CategoryManagement />} />
          <Route path="analytics" element={<Analytics />} />
        </Route>
      </Route>

      <Route path="/login" element={<Login />} />
    </Routes>
  );
}

export default AppRoutes;

