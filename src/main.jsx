import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Root from "./routes/root";
import Home from "./routes/home";
import SearchResults from "./routes/searchResults";

import Datasets from "./routes/datasets";
import Notebooks from "./routes/notebooks";
import Publications from "./routes/publications";
import OERS from "./routes/oers";
import Maps from "./routes/maps";
import NotebookPage from "./routes/ResourcePages/NotebookPage";
import DatasetPage from "./routes/ResourcePages/DatasetPage";
import PublicationPage from "./routes/ResourcePages/PublicationPage";
import OERPage from "./routes/ResourcePages/OERPage";
import MapPage from "./routes/ResourcePages/MapPage";
import Tag from "./routes/tag";

import UserProfile from "./routes/userProfile";
import UserProfileUpdate from "./routes/userProfileUpdate";
import ResourceSubmission from "./routes/resourceSubmission";
import ResourceUpdate from "./routes/resourceUpdate";
import TermsOfUse from "./routes/Legal/TermsOfUse";
import About from "./routes/About";

import ErrorPage from "./ErrorPage";
import ContributorProfile from "./routes/contributorProfile";

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
        path: "/search-results",
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
        element: <OERS />,
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
        path: "about",
        element: <About />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
