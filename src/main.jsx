import React, { Suspense } from "react";

import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router";

import Root from "./routes/Root";
import ErrorPage from "./routes/ErrorPage";
import { routes } from "./routes";
import Maintenance from "./routes/Maintenance";
import { AppProviders } from "./AppProviders";

const MAINTENANCE_MODE = import.meta.env.VITE_MAINTENANCE_MODE === "true";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <Root customOutlet={<ErrorPage />} />,
    children: routes.map((route) => ({
      path: route.path,
      element: route.element,
    })),
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {MAINTENANCE_MODE ? (
      <Maintenance />
    ) : (
      <Suspense fallback={<div>Loading...</div>}>
        <AppProviders>
          <RouterProvider router={router} />
        </AppProviders>
      </Suspense>
    )}
  </React.StrictMode>
);
