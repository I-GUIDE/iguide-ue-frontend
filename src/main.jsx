import React from 'react'
import ReactDOM from 'react-dom/client'
import ErrorPage from "./error-page";

import Root from "./routes/root";
import Home from "./routes/home";
import Datasets from "./routes/datasets";
import Notebooks from "./routes/notebooks";
import Publications from "./routes/publications";
import NotebookPage from "./components/Pages/NotebookPage";
import DatasetPage from "./components/Pages/DatasetPage";
import PublicationPage from "./components/Pages/PublicationPage";

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
                path: "/home",
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
        ]
    },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <RouterProvider router={router} />
    </React.StrictMode>,
)
