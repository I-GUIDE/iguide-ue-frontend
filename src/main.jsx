import React from 'react'
import ReactDOM from 'react-dom/client'
import ErrorPage from "./error-page";

import Root from "./routes/root";
import Datasets from "./routes/datasets";
import Notebooks from "./routes/notebooks";

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
                path: "/datasets",
                element: <Datasets />,
            },
            {
                path: "/notebooks",
                element: <Notebooks />,
            },
        ]
    },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <RouterProvider router={router} />
    </React.StrictMode>,
)
