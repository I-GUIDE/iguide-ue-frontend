import React from 'react';
import { Outlet } from "react-router-dom";
import { StyledEngineProvider } from '@mui/material/styles';

import NavBar from '../components/Layout/NavBar.jsx';
import Footer from '../components/Layout/Footer.jsx';

import { useAuth } from "react-oidc-context";

export default function Root() {
    const auth = useAuth();

    switch (auth.activeNavigator) {
        case "signinSilent":
            return <div>Signing you in...</div>;
        case "signoutRedirect":
            return <div>Signing you out...</div>;
    }

    if (auth.isLoading) {
        return <div>Loading...</div>;
    }

    if (auth.error) {
        return (
            <div>
                <p>An error occurred during authentication:</p>
                <pre>{auth.error.message}</pre>
            </div>
        );
    }

    if (auth.isAuthenticated) {
        return (
            <div>
                Hello {auth.user?.profile.sub}{" "}
                <button onClick={() => void auth.removeUser()}>Log out</button>
            </div>
        );
    }

    return (
        <StyledEngineProvider injectFirst>
            <NavBar />
            <div id="outlet">
                <Outlet />
            </div>
            <Footer />
            <button onClick={() => void auth.signinRedirect()}>Log in</button>
        </StyledEngineProvider>
    )
}