import {Route, Routes} from "react-router-dom"
import DefaultLayout from "../layouts/DefaultLayout.jsx"
import Home from "../pages/General/Home.jsx"
import Messages from "../pages/UserProfile/Messages.jsx"
import Wishlist from "../pages/UserProfile/Wishlist.jsx"
import Profile from "../pages/UserProfile/Profile.jsx"
import PostProduct from "../pages/General/PostProduct.jsx"

function AppRoutes(){
    return (
        <>
            <Routes>
                <Route path = "/" element= {<DefaultLayout/>}>
                    <Route index element = {<Home />} />
                    <Route path = "/messages" element = {<Messages/>} />
                    <Route path = "/wishlist" element = {<Wishlist/>} />
                    <Route path = "/profile" element = {<Profile/>} />
                    <Route path = "/postproduct" element = {<PostProduct/>} />
                </Route>
            </Routes>
        </>
    )
}

export default AppRoutes;