import React, { lazy, Suspense } from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Root from "./routes/root";
import Home from "./routes/home";

import SearchHome from "./routes/SearchHome";
import SearchResults from "./routes/searchResults";

import Datasets from "./routes/datasets";
import Notebooks from "./routes/notebooks";
import Publications from "./routes/publications";
import OERs from "./routes/oers";
import Maps from "./routes/maps";
import Tag from "./routes/tag";

import DatasetPage from "./routes/ResourcePages/DatasetPage";
import NotebookPage from "./routes/ResourcePages/NotebookPage";
import PublicationPage from "./routes/ResourcePages/PublicationPage";
import OERPage from "./routes/ResourcePages/OERPage";
import MapPage from "./routes/ResourcePages/MapPage";

import UserProfile from "./routes/userProfile";
import UserProfileUpdate from "./routes/userProfileUpdate";
const ResourceSubmission = lazy(() => import("./routes/resourceSubmission"));
const ResourceUpdate = lazy(() => import("./routes/resourceUpdate"));
import About from "./routes/About";
import Tutorials from "./routes/Tutorials";
import TermsOfUse from "./routes/Legal/TermsOfUse";
import LicenseAgreement from "./routes/Legal/LicenseAgreement";

import NetworkVisualizer from "./routes/NetworkVisualizer";
const DocSubmission = lazy(() => import("./routes/DocSubmission"));
const DocUpdate = lazy(() => import("./routes/DocUpdate"));
import DocPage from "./routes/DocPage";

import ErrorPage from "./ErrorPage";
import ContributorProfile from "./routes/contributorProfile";
import ContactUs from "./routes/ContactUs";

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
        element: <ResourceSubmission />,
      },
      {
        path: "/element-update/:id",
        element: <ResourceUpdate />,
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
    <Suspense fallback={<div>Loading...</div>}>
      <RouterProvider router={router} />
    </Suspense>
  </React.StrictMode>
);
