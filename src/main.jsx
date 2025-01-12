import React, { lazy, Suspense } from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router";

import Root from "./routes/Root";
import Home from "./routes/Home";

import SearchHome from "./routes/SearchHome";
import SearchResults from "./routes/SearchResults";

import Datasets from "./routes/Datasets";
import Notebooks from "./routes/Notebooks";
import Publications from "./routes/Publications";
import OERs from "./routes/Oers";
import Maps from "./routes/Maps";
import Tag from "./routes/Tag";

import DatasetPage from "./routes/ElementPage/DatasetPage";
import NotebookPage from "./routes/ElementPage/NotebookPage";
import PublicationPage from "./routes/ElementPage/PublicationPage";
import OERPage from "./routes/ElementPage/OERPage";
import MapPage from "./routes/ElementPage/MapPage";

import UserProfile from "./routes/UserProfile";
import UserProfileUpdate from "./routes/UserProfileUpdate";
import ElementSubmission from "./routes/ElementSubmission";
import ElementUpdate from "./routes/ElementUpdate";
import About from "./routes/About";
import Tutorials from "./routes/Tutorials";
import TermsOfUse from "./routes/Legal/TermsOfUse";
import LicenseAgreement from "./routes/Legal/LicenseAgreement";

import NetworkVisualizer from "./routes/NetworkVisualizer";
import DocSubmission from "./routes/DocSubmission";
import DocUpdate from "./routes/DocUpdate";
import DocPage from "./routes/DocPage";

import ErrorPage from "./routes/ErrorPage";
import ContributorProfile from "./routes/ContributorProfile";
import ContactUs from "./routes/ContactUs";

import { TourProvider } from "@reactour/tour/";
import TourSteps from "./configs/TourSteps";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <Root customOutlet={<ErrorPage />} />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/search-home",
        element: <SearchHome />,
      },
      {
        path: "/search",
        element: <SearchResults />,
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
        element: <OERs />,
      },
      {
        path: "/oers/:id",
        element: <OERPage />,
      },
      {
        path: "/maps",
        element: <Maps />,
      },
      {
        path: "/maps/:id",
        element: <MapPage />,
      },
      {
        path: "/element-network",
        element: <NetworkVisualizer />,
      },
      {
        path: "/tag/:id",
        element: <Tag />,
      },
      {
        path: "/user-profile",
        element: <UserProfile />,
      },
      {
        path: "/contributor/:id",
        element: <ContributorProfile />,
      },
      {
        path: "/user-profile-update",
        element: <UserProfileUpdate />,
      },
      {
        path: "/contribution/:elementType",
        element: <ElementSubmission />,
      },
      {
        path: "/element-update/:id",
        element: <ElementUpdate />,
      },
      {
        path: "/terms-of-use",
        element: <TermsOfUse />,
      },
      {
        path: "/contributor-license-agreement",
        element: <LicenseAgreement />,
      },
      {
        path: "/about",
        element: <About />,
      },
      {
        path: "/tutorials",
        element: <Tutorials />,
      },
      {
        path: "/new-doc",
        element: <DocSubmission />,
      },
      {
        path: "/doc-update/:id",
        element: <DocUpdate />,
      },
      {
        path: "/docs/:id",
        element: <DocPage />,
      },
      {
        path: "/contact-us",
        element: <ContactUs />,
      },
    ],
  },
]);



ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <TourProvider steps={TourSteps}> 
      <Suspense fallback={<div>Loading...</div>}>
        <RouterProvider router={router} />
      </Suspense>
    </TourProvider>
  </React.StrictMode>
);
