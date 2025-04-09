import React, { lazy, Suspense } from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router";
import { CookiesProvider } from "react-cookie";

import Root from "./routes/Root";

import ErrorPage from "./routes/ErrorPage";

import { routes } from "./routes";

import { TourProvider } from "@reactour/tour/";
import TourSteps from "./configs/TourSteps";

import GoogleAnalytics from "./utils/GoogleAnalytics";

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
    <TourProvider steps={TourSteps} showBadge={false}>
      <Suspense fallback={<div>Loading...</div>}>
        <GoogleAnalytics>
          <CookiesProvider defaultSetOptions={{ path: "/" }}>
            <RouterProvider router={router} />
          </CookiesProvider>
        </GoogleAnalytics>
      </Suspense>
    </TourProvider>
  </React.StrictMode>
);
