import Home from "./routes/Home";

import SearchHome from "./routes/SearchHome";
import SearchResults from "./routes/SearchResults";

import Datasets from "./routes/Datasets";
import Notebooks from "./routes/Notebooks";
import Publications from "./routes/Publications";
import OERs from "./routes/Oers";
import Maps from "./routes/Maps";
import Repos from "./routes/Repos";
import Tag from "./routes/Tag";

import DatasetPage from "./routes/ElementPage/DatasetPage";
import NotebookPage from "./routes/ElementPage/NotebookPage";
import PublicationPage from "./routes/ElementPage/PublicationPage";
import OERPage from "./routes/ElementPage/OERPage";
import MapPage from "./routes/ElementPage/MapPage";
import RepoPage from "./routes/ElementPage/RepoPage";

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
    path: "/about",
    element: <About />,
    label: "About",
    category: "About I-GUIDE",
  },
  {
    path: "/tutorials",
    element: <Tutorials />,
    label: "Tutorials",
    category: "About I-GUIDE",
  },
  {
    path: "/terms-of-use",
    element: <TermsOfUse />,
    label: "Terms of Use",
    category: "About I-GUIDE",
  },
  {
    path: "/contributor-license-agreement",
    element: <LicenseAgreement />,
    label: "Contributor License Agreement",
    category: "About I-GUIDE",
  },
  {
    path: "/contact-us",
    element: <ContactUs />,
    label: "Contact Us",
    category: "About I-GUIDE",
  },
  {
    path: "/search-home",
    element: <SearchHome />,
    label: "Search",
    category: "Search",
  },
  {
    path: "/element-network",
    element: <NetworkVisualizer />,
    label: "Element Network",
    category: "Search",
  },
  {
    path: "/search",
    element: <SearchResults />,
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
    path: "/repositories",
    element: <Repos />,
    label: "Repositories",
    category: "Elements",
  },
  {
    path: "/repositories/:id",
    element: <RepoPage />,
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
];
