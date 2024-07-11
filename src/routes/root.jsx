import React from 'react';
import { Outlet } from "react-router-dom";
import { StyledEngineProvider } from '@mui/material/styles';

import NavBar from '../components/Layout/NavBar.jsx';
import Footer from '../components/Layout/Footer.jsx';

const AUTH_BACKEND_URL = import.meta.env.VITE_EXPRESS_BACKEND_URL;
const BACKEND_URL_PORT = import.meta.env.VITE_DATABASE_BACKEND_URL

export default function Root() {
    const [isAuthenticated, setIsAuthenticated] = React.useState(false);
    const [hasLocalProfile, setHasLocalProfile] = React.useState(false);
    const [userInfo, setUserInfo] = React.useState(null);

    // Check if the user existed in the auth backend, if yes, setUser
    React.useEffect(() => {
        const checkIfLoggedIn = () => {
            fetch(AUTH_BACKEND_URL + "/auth-validation", {
                method: "GET",
                credentials: "include",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Credentials": true,
                },
            }).then((response) => {
                if (response.status === 200) return response.json();
                throw new Error("authentication has been failed!");
            }).then((resObject) => {
                console.log('root user res', resObject.isAuthenticated)
                setIsAuthenticated(resObject.isAuthenticated);
            }).catch((err) => {
                console.log(err);
            });
        };
        checkIfLoggedIn();
    }, []);

    React.useEffect(() => {
        const getUserInfo = () => {
            fetch(AUTH_BACKEND_URL + "/userinfo", {
                method: "GET",
                credentials: "include",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Credentials": true,
                },
            }).then((response) => {
                if (response.status === 200) return response.json();
                throw new Error("authentication has been failed!");
            }).then((resObject) => {
                console.log('userinfo', resObject.userInfo)
                setUserInfo(resObject.userInfo);
            }).catch((err) => {
                console.log(err);
            });
        };
        if (isAuthenticated) {
            console.log("Logged in... getting user info...")
            getUserInfo();
        } else {
            console.log("Not logged in")
            setUserInfo({ userInfo: null })
        }
    }, [isAuthenticated]);

    return (
        <StyledEngineProvider injectFirst>
            <NavBar isAuthenticated={isAuthenticated} />
            <Outlet context={[isAuthenticated, setIsAuthenticated, userInfo, setUserInfo]} />
            <Footer />
        </StyledEngineProvider>
    )
}