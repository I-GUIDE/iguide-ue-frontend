import { React, useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { StyledEngineProvider } from '@mui/material/styles';

import NavBar from '../components/Layout/NavBar.jsx';
import Footer from '../components/Layout/Footer.jsx';

import { checkUser, fetchUser, addUser } from "../utils/UserManager.jsx";

const AUTH_BACKEND_URL = import.meta.env.VITE_EXPRESS_BACKEND_URL;
const BACKEND_URL_PORT = import.meta.env.VITE_DATABASE_BACKEND_URL;

export default function Root() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userInfo, setUserInfo] = useState(null);
    const [localUserInfo, setLocalUserInfo] = useState(null);

    // Check if the user existed in the auth backend, if yes, setUser
    useEffect(() => {
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
                throw new Error("User not logged in via CILogon!");
            }).then((resObject) => {
                console.log('User is authenticated via CILogon', resObject.isAuthenticated)
                setIsAuthenticated(resObject.isAuthenticated);
            }).catch((err) => {
                console.log(err);
            });
        };
        checkIfLoggedIn();
    }, []);

    useEffect(() => {
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
                throw new Error("CILogon has failed!");
            }).then((resObject) => {
                console.log('Getting user info from CILogon...', resObject.userInfo)
                setUserInfo(resObject.userInfo);
            }).catch((err) => {
                console.log(err);
            });
        };
        if (isAuthenticated) {
            console.log("Logged in via CILogon")
            getUserInfo();
        } else {
            console.log("Not logged in")
            setUserInfo({ userInfo: null })
        }
    }, [isAuthenticated]);

    // Check if the user exists on the local DB, if not, add the user
    // Save the user information from CILogon to the local DB
    const saveUserToLocalDB = async () => {
        const ret_msg = await addUser(userInfo.sub, userInfo.given_name, userInfo.family_name, userInfo.email, userInfo.idp_name, "");
        console.log('saving user to the local db...', ret_msg);
    }

    useEffect(() => {
        const handleCheckUser = async () => {
            if (userInfo.sub) {
                const localUserExists = await checkUser(userInfo.sub);
                if (localUserExists) {
                    console.log('Found the user from our database');
                } else {
                    console.log('Couldn\'t find the user from our database...');
                    await saveUserToLocalDB();
                }
                const returnedLocalUser = await fetchUser(userInfo.sub);
                setLocalUserInfo(returnedLocalUser);
            }
        };
        if (userInfo) {
            handleCheckUser();
        }
    }, [userInfo]);

    return (
        <StyledEngineProvider injectFirst>
            <NavBar isAuthenticated={isAuthenticated} />
            <Outlet context={[isAuthenticated, setIsAuthenticated, userInfo, setUserInfo, localUserInfo, setLocalUserInfo]} />
            <Footer />
        </StyledEngineProvider>
    )
}