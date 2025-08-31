import Home from "./routes/Home";

import SearchHome from "./routes/SearchHome";
import SearchResults from "./routes/SearchResults";

import LlmSearch from "./routes/LlmSearch";

import Datasets from "./routes/Datasets";
import Notebooks from "./routes/Notebooks";
import Publications from "./routes/Publications";
import OERs from "./routes/Oers";
import Maps from "./routes/Maps";
import Codes from "./routes/Codes";
import Tag from "./routes/Tag";

import DatasetPage from "./routes/ElementPage/DatasetPage";
import NotebookPage from "./routes/ElementPage/NotebookPage";
import PublicationPage from "./routes/ElementPage/PublicationPage";
import OERPage from "./routes/ElementPage/OERPage";
import MapPage from "./routes/ElementPage/MapPage";
import CodePage from "./routes/ElementPage/CodePage";

import UserProfile from "./routes/UserProfile";
import UserProfileUpdate from "./routes/UserProfileUpdate";
import ElementSubmission from "./routes/ElementSubmission";
import ElementUpdate from "./routes/ElementUpdate";
import About from "./routes/About";
import Tutorials from "./routes/Tutorials";
import TermsOfUse from "./routes/Legal/TermsOfUse";
import LicenseAgreement from "./routes/Legal/LicenseAgreement";

import NetworkVisualizer from "./routes/NetworkVisualizer";
import ElementsMap from "./routes/ElementsMap";
import DocSubmission from "./routes/DocSubmission";
import DocUpdate from "./routes/DocUpdate";
import DocPage from "./routes/DocPage";
import ContributorProfile from "./routes/ContributorProfile";
import ContactUs from "./routes/ContactUs";
import Sitemap from "./routes/Sitemap";

import AdminPanel from "./routes/AdminPanel";

const ENABLE_LLM = import.meta.env.VITE_ENABLE_LLM === "true";

export const routes = [
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/about",
    element: <About />,
    label: "About",
    category: "About",
  },
  {
    path: "/tutorials",
    element: <Tutorials />,
    label: "Tutorials",
    category: "About",
  },
  {
    path: "/terms-of-use",
    element: <TermsOfUse />,
    label: "Terms of Use",
    category: "About",
  },
  {
    path: "/contributor-license-agreement",
    element: <LicenseAgreement />,
    label: "Contributor License Agreement",
    category: "About",
  },
  {
    path: "/contact-us",
    element: <ContactUs />,
    label: "Contact Us",
    category: "About",
  },
  {
    path: "/search-home",
    element: <SearchHome />,
    label: "Search",
    category: "Exploration",
  },
  ENABLE_LLM && {
    path: "/smart-search",
    element: <LlmSearch />,
  },
  {
    path: "/element-network",
    element: <NetworkVisualizer />,
    label: "Element Network",
    category: "Exploration",
  },
  {
    path: "/element-map",
    element: <ElementsMap />,
    label: "Element Map",
    category: "Exploration",
  },
  {
    path: "/search",
    element: <SearchResults />,
  },
  {
    path: "/maps",
    element: <Maps />,
    label: "Maps",
    category: "Knowledge Elements",
  },
  {
    path: "/maps/:id",
    element: <MapPage />,
  },
  {
    path: "/datasets",
    element: <Datasets />,
    label: "Datasets",
    category: "Knowledge Elements",
  },
  {
    path: "/datasets/:id",
    element: <DatasetPage />,
  },
  {
    path: "/notebooks",
    element: <Notebooks />,
    label: "Notebooks",
    category: "Knowledge Elements",
  },
  {
    path: "/notebooks/:id",
    element: <NotebookPage />,
  },
  {
    path: "/publications",
    element: <Publications />,
    label: "Publications",
    category: "Knowledge Elements",
  },
  {
    path: "/publications/:id",
    element: <PublicationPage />,
  },
  {
    path: "/oers",
    element: <OERs />,
    label: "Educational Resources",
    category: "Knowledge Elements",
  },
  {
    path: "/oers/:id",
    element: <OERPage />,
  },
  {
    path: "/code",
    element: <Codes />,
    label: "Code",
    category: "Knowledge Elements",
  },
  {
    path: "/code/:id",
    element: <CodePage />,
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
    path: "/sitemap",
    element: <Sitemap />,
  },
  {
    path: "/admin-panel",
    element: <AdminPanel />,
  },
];
