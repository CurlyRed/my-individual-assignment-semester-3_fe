import { Route, Routes, Navigate } from "react-router-dom";

import DefaultLayout from "../layouts/DefaultLayout.jsx";
import Home from "../pages/General/Home.jsx";
import Messages from "../pages/UserProfile/Messages.jsx";
import Wishlist from "../pages/UserProfile/Wishlist.jsx";
import Profile from "../pages/UserProfile/Profile.jsx";
import Products from "../pages/UserProfile/Products.jsx"
import Payments from "../pages/UserProfile/Payments.jsx"
import Delivery from "../pages/UserProfile/Delivery.jsx"
import Settings from "../pages/UserProfile/Settings.jsx"

import PostProduct from "../pages/General/PostProduct.jsx";

import Login from "../pages/LoginSignup/Login.jsx";

function AppRoutes({ isAuthorized }) {
  return (
    <Routes>
      <Route path="/" element={<DefaultLayout />}>
        <Route index element={<Home />} />
        <Route path="/messages" element={isAuthorized ? <Messages /> : <Navigate to="/login" />} />
        <Route path="/wishlist" element={isAuthorized ? <Wishlist /> : <Navigate to="/login" />} />
        <Route path="/postproduct" element={isAuthorized ? <PostProduct /> : <Navigate to="/login" />} />
        <Route path="/profile" element={isAuthorized ? <Profile /> : <Navigate to="/login" />}>
          <Route index element={<Products />} />
          <Route path="messages" element={<Messages />} />
          <Route path="payments" element={<Payments />} />
          <Route path="delivery" element={<Delivery />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Route>
      <Route path="/login" element={<Login />} />
    </Routes>
  );
}

export default AppRoutes;
