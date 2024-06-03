import { Outlet, Link, useLoaderData, Form } from "react-router-dom";
import { StyledEngineProvider } from '@mui/material/styles';
import Header from "../components/Layout/Header.jsx";

export default function Root() {
    return (
        <StyledEngineProvider injectFirst>
            <Header />
            <div id="detail">
                <Outlet />
            </div>
        </StyledEngineProvider>
    )
}