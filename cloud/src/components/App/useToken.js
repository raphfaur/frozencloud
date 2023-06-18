import React, { useState } from "react";

export default function useToken(){
    const getToken = () => localStorage.getItem('token');

    const [token, setToken] = useState(getToken())

    const saveToken = userToken => {
        localStorage.setItem('token', userToken);
        setToken(userToken);
    }

    return ([token,saveToken])
}