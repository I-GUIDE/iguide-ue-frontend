import { React, useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { CookiesProvider, useCookies } from "react-cookie";

import { StyledEngineProvider } from "@mui/material/styles";

import NavBar from "../components/Layout/NavBar.jsx";
import Footer from "../components/Layout/Footer.jsx";

import Box from "@mui/material/Box";
import PropTypes from "prop-types";
import useScrollTrigger from "@mui/material/useScrollTrigger";
import Fab from "@mui/material/Fab";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import Fade from "@mui/material/Fade";

import {
  checkUser,
  fetchUser,
  addUser,
  getUserRole,
} from "../utils/UserManager.jsx";

import { PERMISSIONS } from "../configs/Permissions.jsx";

const AUTH_BACKEND_URL = import.meta.env.VITE_EXPRESS_BACKEND_URL;
const USE_DEMO_USER = import.meta.env.VITE_USE_DEMO_USER === "true";
const TEST_MODE = import.meta.env.VITE_TEST_MODE;

export default function Root(props) {
  const customOutlet = props.customOutlet;
  const [cookies, setCookie] = useCookies(["user"]);

  const [isAuthenticated, setIsAuthenticated] = useState(cookies.IGPAU);
  const [userInfo, setUserInfo] = useState(null);
  const [localUserInfo, setLocalUserInfo] = useState(null);

  const [userId, setUserId] = useState();

  const demoCILogonUser = {
    email: "user@example.com",
    family_name: "Person",
    given_name: "Happy",
    idp_name: "I-GUIDE",
    iss: "https://cilogon.org",
    sub: "http://cilogon.org/serverE/users/do-not-use",
  };

  const demoLocalUser = {
    affiliation: "I-GUIDE",
    avatar_url:
      "https://media.licdn.com/dms/image/D560BAQFiEtnyQGMPqg/company-logo_200_200/0/1688432335582/nsf_i_guide_logo?e=2147483647&v=beta&t=UtNQYXjEIdSjsDrsVrVuTf_d53Rb26QZqeImQNt19qw",
    bio: "Hi! This is my bio.",
    email: "user@example.com",
    first_name: "Happy",
    last_name: "Person",
    openid: "http://cilogon.org/serverE/users/do-not-use",
    role: 1,
    gitHubLink: "https://github.com",
    linkedInLink: "https://linkedin.com",
    googleScholarLink: "https://scholar.google.com",
    personalWebsiteLink: "https://i-guide.io",
  };

  useEffect(() => {
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
          setUserInfo(resObject.userInfo);
          setUserId(resObject.userInfo.sub);
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
  }, []);

  useEffect(() => {
    // Check if the user exists on the local DB, if not, add the user
    // Save the user information from CILogon to the local DB
    async function saveUserToLocalDB() {
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

    async function handleCheckUser(uid) {
      if (uid) {
        const localUserExists = await checkUser(uid);
        if (localUserExists) {
          TEST_MODE && console.log("Found the user from our database");
        } else {
          TEST_MODE &&
            console.log("Couldn't find the user from our database...", uid);
          await saveUserToLocalDB();
        }
        const returnedLocalUser = await fetchUser(uid);
        const userRole = await getUserRole(uid);
        // Make sure the function returns a number, otherwise assign 10
        returnedLocalUser.role =
          typeof userRole === "number" ? userRole : PERMISSIONS["default_user"];

        TEST_MODE && console.log("set local user: ", returnedLocalUser);

        setLocalUserInfo(returnedLocalUser);
      }
    }

    if (USE_DEMO_USER) {
      setLocalUserInfo(demoLocalUser);
    } else {
      handleCheckUser(userId);
    }
  }, [userId]);

  function ScrollTop(props) {
    const { children, window } = props;
    // Note that you normally won't need to set the window ref as useScrollTrigger
    // will default to window.
    // This is only being set here because the demo is in an iframe.
    const trigger = useScrollTrigger({
      target: window ? window() : undefined,
      disableHysteresis: true,
      threshold: 100,
    });

    function handleClick(event) {
      const anchor = (event.target.ownerDocument || document).querySelector(
        "#back-to-top-anchor"
      );

      if (anchor) {
        anchor.scrollIntoView({
          block: "center",
          behavior: "smooth",
        });
      }
    }

    return (
      <Fade in={trigger}>
        <Box
          onClick={handleClick}
          role="presentation"
          sx={{ position: "fixed", bottom: 170, right: 20 }}
        >
          {children}
        </Box>
      </Fade>
    );
  }

  ScrollTop.propTypes = {
    children: PropTypes.element.isRequired,
    /**
     * Injected by the documentation to work in an iframe.
     * You won't need it on your project.
     */
    window: PropTypes.func,
  };

  return (
    <StyledEngineProvider injectFirst>
      <NavBar isAuthenticated={isAuthenticated} localUserInfo={localUserInfo} />
      <div id="back-to-top-anchor" />
      {customOutlet ? (
        customOutlet
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
      <ScrollTop>
        <Fab
          sx={{ display: { xs: "none", md: "flex" } }}
          size="small"
          color="neutral"
          aria-label="scroll back to top"
        >
          <KeyboardArrowUpIcon />
        </Fab>
      </ScrollTop>
      <Footer />
    </StyledEngineProvider>
  );
}
