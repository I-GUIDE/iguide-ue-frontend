import React from 'react';
import { Outlet } from "react-router-dom";
import { StyledEngineProvider } from '@mui/material/styles';

import NavBar from '../components/Layout/NavBar.jsx';
import Footer from '../components/Layout/Footer.jsx';

export default function Root() {
    return (
        <StyledEngineProvider injectFirst>
            <NavBar />
            <Outlet />
            <Footer />
        </StyledEngineProvider>
    )
}