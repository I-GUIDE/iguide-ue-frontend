import React, { lazy, Suspense } from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Root from "./routes/root";
import Home from "./routes/home";
import SearchHome from "./routes/SearchHome";
const SearchResults = lazy(() => import("./routes/searchResults"));

const Datasets = lazy(() => import("./routes/datasets"));
const Notebooks = lazy(() => import("./routes/notebooks"));
const Publications = lazy(() => import("./routes/publications"));
const OERS = lazy(() => import("./routes/oers"));
const Maps = lazy(() => import("./routes/maps"));
const NotebookPage = lazy(() => import("./routes/ResourcePages/NotebookPage"));
const DatasetPage = lazy(() => import("./routes/ResourcePages/DatasetPage"));
const PublicationPage = lazy(() =>
  import("./routes/ResourcePages/PublicationPage")
);
const OERPage = lazy(() => import("./routes/ResourcePages/OERPage"));
const MapPage = lazy(() => import("./routes/ResourcePages/MapPage"));
const Tag = lazy(() => import("./routes/tag"));

const UserProfile = lazy(() => import("./routes/userProfile"));
const UserProfileUpdate = lazy(() => import("./routes/userProfileUpdate"));
const ResourceSubmission = lazy(() => import("./routes/resourceSubmission"));
const ResourceUpdate = lazy(() => import("./routes/resourceUpdate"));
const TermsOfUse = lazy(() => import("./routes/Legal/TermsOfUse"));
const LicenseAgreement = lazy(() => import("./routes/Legal/LicenseAgreement"));
const About = lazy(() => import("./routes/About"));
const Tutorials = lazy(() => import("./routes/Tutorials"));

const NetworkVisualizer = lazy(() => import("./routes/NetworkVisualizer"));
const DocSubmission = lazy(() => import("./routes/DocSubmission"));
const DocUpdate = lazy(() => import("./routes/DocUpdate"));
const DocPage = lazy(() => import("./routes/DocPage"));

import ErrorPage from "./ErrorPage";
const ContributorProfile = lazy(() => import("./routes/contributorProfile"));
const ContactUs = lazy(() => import("./routes/ContactUs"));

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
