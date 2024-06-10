import { Outlet, Link, useLoaderData, Form } from "react-router-dom";
import { StyledEngineProvider } from '@mui/material/styles';

import NavBar from "../components/Layout/NavBar.jsx";

export default function Root() {
    return (
        <StyledEngineProvider injectFirst>
            <NavBar />
            <div id="detail">
                <Outlet />
            </div>
        </StyledEngineProvider>
    )
}