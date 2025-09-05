import { useState, useEffect } from "react";

import { Outlet, useLocation } from "react-router";
import { useCookies } from "react-cookie";

import { StyledEngineProvider } from "@mui/material/styles";
import Snackbar from "@mui/joy/Snackbar";
import Button from "@mui/joy/Button";
import Stack from "@mui/joy/Stack";
import Typography from "@mui/joy/Typography";

import NavBar from "../components/Layout/NavBar.jsx";
import Footer from "../components/Layout/Footer.jsx";
import ErrorPage from "./ErrorPage.jsx";

import {
  fetchUser,
  getUserRole,
  userLogout,
  checkTokens,
} from "../utils/UserManager.jsx";
import { PERMISSIONS } from "../configs/Permissions.jsx";
import { ScrollToTop, ClickToTop } from "../helpers/Scroll.jsx";
import RouteChangeListener from "../utils/RouteChangeListener.jsx";

const TEST_MODE = import.meta.env.VITE_TEST_MODE;
const DEEP_TEST_MODE = import.meta.env.VITE_DEEP_TEST_MODE;
const COOKIE_SUFFIX = import.meta.env.VITE_COOKIE_SUFFIX;
const SNACKBAR_MESSAGE = import.meta.env.VITE_SNACKBAR_MESSAGE;

// Demo user setting
const USE_DEMO_USER = import.meta.env.VITE_USE_DEMO_USER === "true";
const DEMO_USERID = import.meta.env.VITE_DEMO_USERID;
const DEMO_USER_ROLE = parseInt(import.meta.env.VITE_DEMO_USER_ROLE);

export default function Root(props) {
  const customOutlet = props.customOutlet;
  const [cookies] = useCookies();
  const jwtTokensExistName = "iguide-jwt-tokens-exist-" + COOKIE_SUFFIX;
  const [openSnackbar, setOpenSnackbar] = useState(true);

  // Define the routes where Footer should be hidden
  const location = useLocation();
  const hideFooterRoutes = ["/smart-search", "/element-map"];
  const shouldShowFooter = !hideFooterRoutes.includes(location.pathname);

  // If the JWT tokens exist, set the status as isAuthenticated
  const [isAuthenticated, setIsAuthenticated] = useState(
    USE_DEMO_USER ? true : cookies[jwtTokensExistName]
  );
  const [localUserInfo, setLocalUserInfo] = useState(null);

  // Scroll bar always appears to prevent layout shifts
  useEffect(() => {
    document.documentElement.style.overflowY = "scroll";
  }, []);

  useEffect(() => {
    const demoLocalUser = {
      affiliation: "I-GUIDE",
      avatar_url: "/images/Logo.png",
      bio: "NSF I-GUIDE enhances STEM participation for underserved populations through innovative education and community partnerships.",
      email: "user@example.com",
      auth_first_name: "Happy",
      auth_last_name: "Person",
      first_name: "Personne",
      last_name: "Heureuse",
      openid: "http://cilogon.org/serverE/users/do-not-use",
      id: DEMO_USERID,
      role: DEMO_USER_ROLE,
      gitHubLink: "https://github.com",
      linkedInLink: "https://linkedin.com",
      googleScholarLink: "https://scholar.google.com",
      personalWebsiteLink: "https://i-guide.io",
    };

    async function setupLocalUserInfo() {
      // If the demo user mode is on, set the demo user as user
      if (USE_DEMO_USER) {
        TEST_MODE && console.log("Using demo user...");
        setLocalUserInfo(demoLocalUser);
        return;
      }

      // If the user is not authenticated, set local user as null.
      if (!isAuthenticated) {
        setLocalUserInfo(null);
        return;
      }

      // Get user information from the JWT token. Refresh token if needed.
      //   userInfoFromToken will be undefined or null if the token is no longer valid
      const userInfoFromToken = await checkTokens();
      if (!userInfoFromToken) {
        console.warn("Token doesn't contain user info. Logging user out...");
        userLogout();
        return;
      }

      if (userInfoFromToken === "ERROR") {
        TEST_MODE &&
          console.log(
            "Error during checkTokens. User should have been logged out."
          );
        return;
      }

      // Get user openid from the token
      const openId = userInfoFromToken.id;
      if (!openId) {
        console.warn("Token doesn't contain openid. Logging user out...");
        userLogout();
        return;
      }

      // Get user information and role from the database
      const returnedLocalUser = await fetchUser(openId);
      const userRole = await getUserRole(openId);
      // Make sure the function returns a number, otherwise assign 10
      returnedLocalUser.role =
        typeof userRole === "number" ? userRole : PERMISSIONS["default_user"];

      TEST_MODE &&
        console.log("Local user returned from the database", returnedLocalUser);
      const localUserInfoObject = {
        affiliation: returnedLocalUser.affiliation,
        avatar_url: returnedLocalUser["avatar-url"],
        bio: returnedLocalUser.bio,
        email: returnedLocalUser.email,
        auth_first_name: returnedLocalUser["first-name"],
        auth_last_name: returnedLocalUser["last-name"],
        first_name: returnedLocalUser["display-first-name"],
        last_name: returnedLocalUser["display-last-name"],
        openid: returnedLocalUser.openid,
        id: returnedLocalUser.id,
        role: returnedLocalUser.role,
        gitHubLink: returnedLocalUser.gitHubLink,
        linkedInLink: returnedLocalUser.linkedInLink,
        googleScholarLink: returnedLocalUser.googleScholarLink,
        personalWebsiteLink: returnedLocalUser.personalWebsiteLink,
      };

      TEST_MODE && console.log("localUserInfo to be set", localUserInfoObject);
      setLocalUserInfo(localUserInfoObject);
    }

    setupLocalUserInfo();
  }, [isAuthenticated]);

  return (
    <StyledEngineProvider injectFirst>
      <NavBar isAuthenticated={isAuthenticated} localUserInfo={localUserInfo} />
      {/* Update the auth state whenever there is a route change */}
      <RouteChangeListener
        onRouteChange={(path) => {
          const currentIsAuth = USE_DEMO_USER
            ? true
            : !!cookies[jwtTokensExistName];
          setIsAuthenticated(currentIsAuth);
          DEEP_TEST_MODE &&
            console.log(`Is auth: ${currentIsAuth}. Path: ${path}`);
        }}
      />
      <div id="back-to-top-anchor" />
      {customOutlet ? (
        customOutlet.type === ErrorPage ? (
          <ErrorPage
            isAuthenticated={isAuthenticated}
            localUserInfo={localUserInfo}
          />
        ) : (
          customOutlet
        )
      ) : (
        <Outlet
          context={{
            isAuthenticated,
            setIsAuthenticated,
            localUserInfo,
            setLocalUserInfo,
          }}
        />
      )}
      <ScrollToTop />
      <ClickToTop />
      {shouldShowFooter && <Footer />}
      {/* For displaying notifications or alerts. */}
      {SNACKBAR_MESSAGE && (
        <Snackbar
          open={openSnackbar}
          variant="soft"
          color="danger"
          size="md"
          onClose={(event, reason) => {
            if (reason === "clickaway") {
              return;
            }
            setOpenSnackbar(false);
          }}
        >
          <Stack
            direction="row"
            spacing={1}
            sx={{
              justifyContent: "space-between",
              alignItems: "center",
              width: "100%",
            }}
          >
            <Typography level="title-sm">{SNACKBAR_MESSAGE}</Typography>
            <Button
              variant="plain"
              color="danger"
              onClick={() => setOpenSnackbar(false)}
            >
              Close
            </Button>
          </Stack>
        </Snackbar>
      )}
    </StyledEngineProvider>
  );
}
