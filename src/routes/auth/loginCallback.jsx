import React, { useState, useEffect } from 'react';

import { useAuth } from "react-oidc-context";
import { Navigate } from "react-router-dom";

export default function AuthCallback() {
    const auth = useAuth();
    // const navigate = useNavigate();
    const [isAuth, setIsAuth] = useState(false);

    useEffect(() => {
        console.log(auth)
        if (auth.isAuthenticated) {
            setIsAuth(true)   
            // navigate('/user_profile');
        } else {
            setIsAuth(false)
        }
        // auth.isAuthenticated.then(() => {
        //     navigate('/userprofile');
        // });
    }, [auth]);

    if (isAuth) {
        return <Navigate to="/user_profile" />
    } else {
        return <div>Processing signin...</div>;
    }
    
}