import { BrowserRouter, Routes, Route, useNavigate, useLocation } from "react-router-dom";
import Navbar from "../Navgigation/Navbar";
import Profil from "../Profil/Profil";
import Login from "../Login/Login";
import { Fragment, useState } from "react";
import useToken from "./useToken";
import Gallery from "../Gallery/Gallery";
import Import from "../Import/Import";
import 'jwt-decode'
import jwtDecode from "jwt-decode";
import Verification from "../Signup/Verification";
import Signup from "../Signup/Signup";


export default function AuthWrapper() {
    const [token, setToken] = useToken()
    const location = useLocation();
    const navigate = useNavigate();
    function getToken() {
        if (token) {
            const now = new Date();
            const decodedJwt = jwtDecode(token)
            console.log(decodedJwt.exp * 1000 - now.getTime());
            if (decodedJwt.exp * 1000 < now.getTime()) {
                localStorage.removeItem('token');
                setToken(null);
            }
        }
        return token
    }
    if (!token && location.pathname !== "/signup" && location.pathname !== "/verification") {
        return (
            <Login setToken={setToken}></Login>
        )
    }
    else {
        return (
            <Fragment>
                <Navbar></Navbar>
                <Routes>
                    <Route path="/import" element={<Import getToken={getToken} />} />
                    <Route path="/profil" element=<Profil /> />
                    <Route path="/login" element=<Login setToken={setToken} /> />
                    <Route path="/gallery" element=<Gallery getToken={getToken}></Gallery> />
                    <Route path="/verification" element={<Verification></Verification>} />
                    <Route path="/signup" element={<Signup></Signup>} />
                </Routes>
            </Fragment>

        )
    }
}