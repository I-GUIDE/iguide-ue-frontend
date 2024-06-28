import React, { useState, useEffect } from 'react';

import { useAuth } from "react-oidc-context";
import { useNavigate } from "react-router-dom";

export default function AuthCallback() {
    const auth = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        console.log(auth)
        if (auth.isAuthenticated) {
            navigate('/user_profile');
        }
        // auth.isAuthenticated.then(() => {
        //     navigate('/userprofile');
        // });
    }, []);

    return <div>Processing signin...</div>;
}