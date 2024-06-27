import React from 'react'
import ReactDOM from 'react-dom/client'
import ErrorPage from "./error-page";

import Root from "./routes/root";
import Home from "./routes/home";
import Datasets from "./routes/datasets";
import Notebooks from "./routes/notebooks";
import Publications from "./routes/publications";
import OERS from './routes/oers';
import NotebookPage from "./routes/ResourcePages/NotebookPage";
import DatasetPage from "./routes/ResourcePages/DatasetPage";
import PublicationPage from "./routes/ResourcePages/PublicationPage";
import OERPage from './routes/ResourcePages/OERPage';
import UserProfile from './routes/userprofile';

import { AuthProvider } from 'react-oidc-context';
import { IDENTITY_CONFIG } from './utils/authConst';

import {
    createBrowserRouter,
    RouterProvider,
} from "react-router-dom";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Root />,
        errorElement: <ErrorPage />,
        children: [
            {
                path: "/",
                element: <Home />,
            },
            {
                path: "/datasets",
                element: <Datasets />,
            },
            {
                path: "/notebooks",
                element: <Notebooks />,
            },
            {
                path: "/publications",
                element: <Publications />,
            },
            {
                path: "/notebooks/:id",
                element: <NotebookPage />,
            },
            {
                path: "/datasets/:id",
                element: <DatasetPage />,
            },
            {
                path: "/publications/:id",
                element: <PublicationPage />,
            },
            {
                path: "/oers",
                element: <OERS />,
            },
            {
                path: "/oers/:id",
                element: <OERPage />,
            },
            {
                path: "/user_profile",
                element: <UserProfile />,
            },
            {
                path: "/cilogon-callback",
                element: <UserProfile />,
            },
        ]
    },
]);

const oidcConfig = {
    authority: IDENTITY_CONFIG.authority,
    client_id: IDENTITY_CONFIG.client_id,
    client_secret: import.meta.env.VITE_REACT_APP_IDENTITY_CLIENT_SECRET,
    redirect_uri: IDENTITY_CONFIG.redirect_uri,
    response_type: 'code',
    scope: 'openid profile email'
};

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <AuthProvider {...oidcConfig}>
            {console.log(oidcConfig.authority)}
            <RouterProvider router={router} />
        </AuthProvider>
    </React.StrictMode>,
)
