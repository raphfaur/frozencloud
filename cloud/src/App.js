import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import Navbar from "./components/Navgigation/Navbar";
import Profil from "./components/Profil/Profil";
import Login from "./components/Login/Login";
import { useState } from "react";
import useToken from "./components/App/useToken";
import Gallery from "./components/Gallery/Gallery";
import Import from "./components/Import/Import";
import 'jwt-decode'
import jwtDecode from "jwt-decode";
import AuthWrapper from "./components/App/AuthWrapper";
import Signup from "./components/Signup/Signup";


function App() {
    return (
      <BrowserRouter>
        <Navbar></Navbar>
        <AuthWrapper></AuthWrapper>
      </BrowserRouter>
    )
  }



export default App;
