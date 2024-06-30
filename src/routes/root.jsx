import React from 'react';
import { Outlet } from "react-router-dom";
import { StyledEngineProvider } from '@mui/material/styles';

import NavBar from '../components/Layout/NavBar.jsx';
import Footer from '../components/Layout/Footer.jsx';

const AUTH_BACKEND_URL = import.meta.env.VITE_EXPRESS_BACKEND_URL;

export default function Root() {
    const [user, setUser] = React.useState(null);

    // Check if the user existed in the auth backend, if yes, setUser
    React.useEffect(() => {
        const getUser = () => {
            fetch(AUTH_BACKEND_URL + "/user", {
                method: "GET",
                credentials: "include",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Credentials": true,
                },
            })
                .then((response) => {
                    if (response.status === 200) return response.json();
                    throw new Error("authentication has been failed!");
                })
                .then((resObject) => {
                    setUser(resObject.user);
                })
                .catch((err) => {
                    console.log(err);
                });
        };
        getUser();
    }, []);

    return (
        <StyledEngineProvider injectFirst>
            <NavBar user={user}/>
            <Outlet context={[user, setUser]}/>
            <Footer />
        </StyledEngineProvider>
    )
}