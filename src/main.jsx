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

import AuthCallback from './routes/auth/loginCallback';

import { AuthProvider } from 'react-oidc-context';
import { IDENTITY_CONFIG, METADATA_OIDC } from './utils/authConst';

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
                element: <AuthCallback />,
            },
        ]
    },
]);

const oidcConfig = {
    authority: "https://cilogon.org/.well-known/openid-configuration",
    client_id: IDENTITY_CONFIG.client_id,
    client_secret: IDENTITY_CONFIG.client_secret,
    redirect_uri: IDENTITY_CONFIG.redirect_uri,
    response_type: 'code',
    scope: 'openid profile email',
    loadUserInfo: false,
    metadata: {
        authorization_endpoint: "https://cilogon.org/authorize",
        token_endpoint: "https://cilogon.org/oauth2/token",
        revocation_endpoint: "https://cilogon.org/oauth2/revoke",
        introspection_endpoint: "https://cilogon.org/oauth2/introspect",
        userinfo_endpoint: "https://cilogon.org/oauth2/userinfo",
        jwks_uri: "https://cilogon.org/oauth2/certs",
    },
};

const onSigninCallback = (_user) => {
    window.history.replaceState(
        {},
        document.title,
        window.location.pathname
    )
}

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <AuthProvider {...oidcConfig} onSigninCallback={onSigninCallback}>
            <RouterProvider router={router} />
        </AuthProvider>
    </React.StrictMode>,
)
