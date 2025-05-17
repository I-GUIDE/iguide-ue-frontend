import { React, useState, useEffect } from "react";

import { Outlet } from "react-router";
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
  checkUser,
  fetchUser,
  addUser,
  getUserRole,
  userLogout,
  checkTokens,
} from "../utils/UserManager.jsx";
import { PERMISSIONS } from "../configs/Permissions.jsx";
import { ScrollToTop, ClickToTop } from "../helpers/Scroll.jsx";

const AUTH_BACKEND_URL = import.meta.env.VITE_EXPRESS_BACKEND_URL;
const TEST_MODE = import.meta.env.VITE_TEST_MODE;
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

  // If the JWT tokens exist, set the status as isAuthenticated
  const [isAuthenticated, setIsAuthenticated] = useState(
    USE_DEMO_USER ? true : cookies[jwtTokensExistName]
  );
  const [localUserInfo, setLocalUserInfo] = useState(null);

  useEffect(() => {
    const demoLocalUser = {
      affiliation: "I-GUIDE",
      avatar_url: "/images/Logo.png",
      bio: "NSF I-GUIDE enhances STEM participation for underserved populations through innovative education and community partnerships.",
      email: "user@example.com",
      first_name: "Happy",
      last_name: "Person",
      openid: "http://cilogon.org/serverE/users/do-not-use",
      id: DEMO_USERID,
      role: DEMO_USER_ROLE,
      gitHubLink: "https://github.com",
      linkedInLink: "https://linkedin.com",
      googleScholarLink: "https://scholar.google.com",
      personalWebsiteLink: "https://i-guide.io",
    };

    // Get user info from the authentication backend using the session cookie
    async function getUserInfoFromAuth() {
      try {
        // Retrieving user information from the auth backend, using credentials
        const response = await fetch(AUTH_BACKEND_URL + "/userinfo", {
          method: "GET",
          credentials: "include",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "Access-Control-Allow-Credentials": true,
          },
        });

        // If the response is no-good, set user status as logged out
        if (!response.ok) {
          setIsAuthenticated(false);
          userLogout();
          throw new Error(
            "Cannot get user info from the authentication backend."
          );
        }

        const resObject = await response.json();
        const userInfoFromAuth = resObject?.userInfo;
        TEST_MODE &&
          console.log("User info from the auth backend", userInfoFromAuth);
        // If userInfo doesn't exist in the auth backend anymore, log the user out
        if (!userInfoFromAuth) {
          setIsAuthenticated(false);
          userLogout();
        } else {
          return userInfoFromAuth;
        }
      } catch (err) {
        setIsAuthenticated(false);
        userLogout();
        console.log(err);
      }
    }

    // Check if the user exists on the local DB, if not, add the user
    // Save the user information from CILogon to the local DB
    async function saveUserInfoToDB(userInfo) {
      const response = await addUser(
        userInfo.sub,
        userInfo.given_name,
        userInfo.family_name,
        userInfo.email,
        userInfo.idp_name,
        ""
      );
      TEST_MODE && console.log("Saving user to the database...", response);
    }

    async function handleSetUpUserInfo() {
      // Get user information from the JWT token. Refresh token if needed.
      //   userInfoFromToken will be undefined or null if the token is no longer valid
      const userInfoFromToken = await checkTokens();
      if (!userInfoFromToken) {
        console.warn("Token doesn't contain user info. Logging user out...");
        userLogout();
        return;
      }

      // Get user openid from the token
      const openId = userInfoFromToken.id;
      if (!openId) {
        console.warn("Token doesn't contain openid. Logging user out...");
        userLogout();
        return;
      }

      // Check if the user exists on the database
      const userExistsInDB = await checkUser(openId);
      if (userExistsInDB) {
        TEST_MODE && console.log("Found the user from the database");
      } else {
        // If the user doesn't exist in the database, get user info from the authentication backend and save to DB
        TEST_MODE &&
          console.log("Couldn't find the user from the database", openId);
        const userInfo = await getUserInfoFromAuth();
        await saveUserInfoToDB(userInfo);
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
        first_name: returnedLocalUser["first-name"],
        last_name: returnedLocalUser["last-name"],
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

    // If the demo user mode is on, set the demo user as user
    if (USE_DEMO_USER) {
      TEST_MODE && console.log("Using demo user...");
      setLocalUserInfo(demoLocalUser);
    } else {
      if (isAuthenticated) {
        handleSetUpUserInfo();
      } else {
        // Make sure localUserInfo is null
        setLocalUserInfo(null);
      }
    }
  }, [isAuthenticated]);

  return (
    <StyledEngineProvider injectFirst>
      <NavBar isAuthenticated={isAuthenticated} localUserInfo={localUserInfo} />
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
      <Footer />
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
