import React, { Suspense } from "react";

import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router";
import { CookiesProvider } from "react-cookie";
import { TourProvider } from "@reactour/tour/";

import Root from "./routes/Root";
import ErrorPage from "./routes/ErrorPage";
import { routes } from "./routes";
import TourSteps from "./configs/TourSteps";
import GoogleAnalytics from "./utils/GoogleAnalytics";
import Maintenance from "./routes/Maintenance";

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
      <TourProvider steps={TourSteps} showBadge={false}>
        <Suspense fallback={<div>Loading...</div>}>
          <GoogleAnalytics>
            <CookiesProvider defaultSetOptions={{ path: "/" }}>
              <RouterProvider router={router} />
            </CookiesProvider>
          </GoogleAnalytics>
        </Suspense>
      </TourProvider>
    )}
  </React.StrictMode>
);
