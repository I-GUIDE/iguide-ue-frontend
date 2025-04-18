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
} from "../utils/UserManager.jsx";
import { PERMISSIONS } from "../configs/Permissions.jsx";
import { ScrollToTop, ClickToTop } from "../helpers/Scroll.jsx";

const AUTH_BACKEND_URL = import.meta.env.VITE_EXPRESS_BACKEND_URL;
const TEST_MODE = import.meta.env.VITE_TEST_MODE;
const SNACKBAR_MESSAGE = import.meta.env.VITE_SNACKBAR_MESSAGE;

// Demo user setting
const USE_DEMO_USER = import.meta.env.VITE_USE_DEMO_USER === "true";
const DEMO_USERID = import.meta.env.VITE_DEMO_USERID;
const DEMO_USER_ROLE = parseInt(import.meta.env.VITE_DEMO_USER_ROLE);

export default function Root(props) {
  const customOutlet = props.customOutlet;
  const [cookies, setCookie] = useCookies(["user"]);
  const [openSnackbar, setOpenSnackbar] = useState(true);

  const [isAuthenticated, setIsAuthenticated] = useState(cookies.IGPAU);
  const [userInfo, setUserInfo] = useState(null);
  const [localUserInfo, setLocalUserInfo] = useState(null);

  useEffect(() => {
    const demoCILogonUser = {
      email: "user@example.com",
      family_name: "Person",
      given_name: "Happy",
      idp_name: "I-GUIDE",
      iss: "https://cilogon.org",
      sub: "http://cilogon.org/serverE/users/do-not-use",
    };

    const getUserInfoFromCILogon = () => {
      fetch(AUTH_BACKEND_URL + "/userinfo", {
        method: "GET",
        credentials: "include",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "Access-Control-Allow-Credentials": true,
        },
      })
        .then((response) => {
          if (response.status === 200) return response.json();
          setIsAuthenticated(false);
          setCookie("IGPAU", false, { path: "/" });
          throw new Error("CILogon has failed!");
        })
        .then((resObject) => {
          TEST_MODE &&
            console.log(
              "Getting user info from CILogon...",
              resObject.userInfo
            );
          // If userInfo doesn't exist in the auth backend anymore, log the user out
          if (!resObject.userInfo) {
            userLogout();
          } else {
            setUserInfo(resObject.userInfo);
          }
        })
        .catch((err) => {
          setIsAuthenticated(false);
          setCookie("IGPAU", false, { path: "/" });
          console.log(err);
        });
    };

    // If the demo user mode is on, set the demo user as user
    if (USE_DEMO_USER) {
      TEST_MODE && console.log("Using demo user...");
      setIsAuthenticated(true);
      setUserInfo(demoCILogonUser);
    } else {
      if (isAuthenticated) {
        getUserInfoFromCILogon();
      } else {
        setLocalUserInfo({ userInfo: null });
        setCookie("IGPAU", false, { path: "/" });
      }
    }
  }, [isAuthenticated, setCookie]);

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

    // Check if the user exists on the local DB, if not, add the user
    // Save the user information from CILogon to the local DB
    async function saveUserToLocalDB(userInfo) {
      const ret_msg = await addUser(
        userInfo.sub,
        userInfo.given_name,
        userInfo.family_name,
        userInfo.email,
        userInfo.idp_name,
        ""
      );
      TEST_MODE && console.log("saving user to the local db...", ret_msg);
    }

    async function handleCheckUser(userInfo) {
      const openId = userInfo.sub;
      if (openId) {
        const localUserExists = await checkUser(openId);
        if (localUserExists) {
          TEST_MODE && console.log("Found the user from our database");
        } else {
          TEST_MODE &&
            console.log("Couldn't find the user from our database...", openId);
          await saveUserToLocalDB(userInfo);
        }
        const returnedLocalUser = await fetchUser(openId);
        const userRole = await getUserRole(openId);
        // Make sure the function returns a number, otherwise assign 10
        returnedLocalUser.role =
          typeof userRole === "number" ? userRole : PERMISSIONS["default_user"];

        TEST_MODE &&
          console.log("Local user returned from DB: ", returnedLocalUser);
        const user = {
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
        TEST_MODE && console.log("Setting localUserInfo: ", user);

        setLocalUserInfo(user);
      }
    }

    if (USE_DEMO_USER) {
      setLocalUserInfo(demoLocalUser);
    } else {
      if (userInfo) {
        handleCheckUser(userInfo);
      }
    }
  }, [userInfo]);

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
