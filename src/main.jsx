import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from "react-router-dom";

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
import Tag from './routes/tag';

import UserProfile from './routes/userProfile';
import UserProfileUpdate from './routes/userProfileUpdate';
import ResourceSubmission from './routes/resourceSubmission';
import ResourceUpdate from './routes/resourceUpdate';

import ErrorPage from "./error-page";

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
                path: "/tag/:id",
                element: <Tag />,
            },
            {
                path: "/user_profile",
                element: <UserProfile />,
            },
            {
                path: "/user_profile_update",
                element: <UserProfileUpdate />,
            },
            {
                path: "/resource_submission",
                element: <ResourceSubmission />,
            },
            {
                path: "/resource_update/:id",
                element: <ResourceUpdate />,
            },
        ]
    },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <RouterProvider router={router} />
    </React.StrictMode>,
)
