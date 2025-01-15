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
import ContributorProfile from "./routes/ContributorProfile";
import ContactUs from "./routes/ContactUs";
import Sitemap from "./components/Sitemap";

export const routes = [
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/search-home",
    element: <SearchHome />,
    label: "Search",
    category: "Searching",
  },
  {
    path: "/search",
    element: <SearchResults />,
  },
  {
    path: "/datasets",
    element: <Datasets />,
    label: "Datasets",
    category: "Elements",
  },
  {
    path: "/notebooks",
    element: <Notebooks />,
    label: "Notebooks",
    category: "Elements",
  },
  {
    path: "/publications",
    element: <Publications />,
    label: "Publications",
    category: "Elements",
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
    label: "Educational Resources",
    category: "Elements",
  },
  {
    path: "/oers/:id",
    element: <OERPage />,
  },
  {
    path: "/maps",
    element: <Maps />,
    label: "Maps",
    category: "Elements",
  },
  {
    path: "/maps/:id",
    element: <MapPage />,
  },
  {
    path: "/element-network",
    element: <NetworkVisualizer />,
    label: "Explore Knowledge Network",
    category: "Searching",
  },
  {
    path: "/tag/:id",
    element: <Tag />,
  },
  {
    path: "/user-profile",
    element: <UserProfile />,
    label: "User Profile",
    category: "User",
    requireAuth: true,
  },
  {
    path: "/contributor/:id",
    element: <ContributorProfile />,
  },
  {
    path: "/user-profile-update",
    element: <UserProfileUpdate />,
    label: "Update User Profile",
    category: "User",
    requireAuth: true,
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
    path: "/about",
    element: <About />,
    label: "About",
    category: "About I-GUIDE",
  },
  {
    path: "/terms-of-use",
    element: <TermsOfUse />,
    label: "Legal - Terms of Use",
    category: "About I-GUIDE",
  },
  {
    path: "/contributor-license-agreement",
    element: <LicenseAgreement />,
    label: "Legal - Contributor License Agreement",
    category: "About I-GUIDE",
  },
  {
    path: "/tutorials",
    element: <Tutorials />,
    label: "Tutorials",
    category: "About I-GUIDE",
  },
  {
    path: "/new-doc",
    element: <DocSubmission />,
    label: "Create Documentation",
    category: "Documentation",
    requireAdmin: true,
  },
  {
    path: "/doc-update/:id",
    element: <DocUpdate />,
    label: "Update Documentation",
    category: "Documentation",
    requireAdmin: true,
  },
  {
    path: "/docs/:id",
    element: <DocPage />,
  },
  {
    path: "/contact-us",
    element: <ContactUs />,
    label: "Contact Us",
    category: "About I-GUIDE",
  },
  {
    path: "/sitemap",
    element: <Sitemap />,
  },
];
