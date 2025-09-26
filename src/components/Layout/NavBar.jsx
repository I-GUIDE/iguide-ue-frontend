import { useState, useRef, useEffect } from "react";

import { Link as RouterLink } from "react-router";

import {
  extendTheme as materialExtendTheme,
  ThemeProvider as MaterialCssVarsProvider,
  THEME_ID as MATERIAL_THEME_ID,
} from "@mui/material/styles";
import { CssVarsProvider as JoyCssVarsProvider } from "@mui/joy/styles";
import CssBaseline from "@mui/material/CssBaseline";
const materialTheme = materialExtendTheme();

import AppBar from "@mui/material/AppBar";

import Box from "@mui/joy/Box";
import Link from "@mui/joy/Link";
import Typography from "@mui/joy/Typography";
import Stack from "@mui/joy/Stack";
import Button from "@mui/joy/Button";
import ListDivider from "@mui/joy/ListDivider";
import Avatar from "@mui/joy/Avatar";
import Drawer from "@mui/joy/Drawer";
import List from "@mui/joy/List";
import Divider from "@mui/joy/Divider";
import ListItem from "@mui/joy/ListItem";
import ListItemButton from "@mui/joy/ListItemButton";
import ModalClose from "@mui/joy/ModalClose";
import Tooltip from "@mui/joy/Tooltip";

import MenuIcon from "@mui/icons-material/Menu";

import SearchBar from "../SearchBar";
import SearchModal from "./SearchModal";
import HoverOverMenuTab from "../HoverOverMenuTab";
import UserProfileButton from "../UserProfileButton";

import { userLogin, userLogout } from "../../utils/UserManager";

import { NAVBAR_HEIGHT } from "../../configs/VarConfigs";
import { PERMISSIONS } from "../../configs/Permissions";

import iguideLogo from "../../assets/images/iguide-logo.png";
import jupyterLogo from "../../assets/images/jupyter-logo.png";

const ENV = import.meta.env.VITE_ENV;
const JUPYTERHUB_URL = import.meta.env.VITE_JUPYTERHUB_URL;

const supportPages = [
  ["Getting Started", "/docs/getting-started"],
  ["Tutorials", "/tutorials"],
  ["FAQ", "/docs/frequently-asked-questions"],
  ["Contact Us", "/contact-us"],
];

const elementPages = [
  ["Maps", "/maps"],
  ["Datasets", "/datasets"],
  ["Notebooks", "/notebooks"],
  ["Publications", "/publications"],
  ["Educational Resources", "/oers"],
  ["Code", "/code"],
];

export default function NavBar(props) {
  const isAuthenticated = props.isAuthenticated;
  const localUserInfo = props.localUserInfo ? props.localUserInfo : {};

  const firstFocusableRef = useRef(null);
  const buttonRef = useRef(null);
  const navItemsRef = useRef([]);
  const [menuIndex, setMenuIndex] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const canAccessHPC =
    localUserInfo.role <= PERMISSIONS["display_hpc"] &&
    localUserInfo.affiliation === "ACCESS";
  const canEditOER = localUserInfo.role <= PERMISSIONS["edit_oer"];
  const canEditAllElements = localUserInfo.role <= PERMISSIONS["edit_all"];
  const canAccessLLMSearch = localUserInfo.role <= PERMISSIONS["access_llm"];
  const canContributeElements = localUserInfo.role <= PERMISSIONS["contribute"];
  const canAccessJupyterHub =
    localUserInfo.role <= PERMISSIONS["access_jupyterhub"];
  const isSuperAdmin = localUserInfo.role <= PERMISSIONS["super_admin"];

  function toggleDrawer(inOpen) {
    return (event) => {
      if (
        event.type === "keydown" &&
        (event.key === "Tab" || event.key === "Shift")
      ) {
        return;
      }

      if (event.type === "keydown") {
        if (event.key === "Escape") {
          setDrawerOpen(inOpen);
        }
        return;
      }

      setDrawerOpen(inOpen);
    };
  }

  function openNextNavItem() {
    if (typeof menuIndex === "number") {
      const nextIndex = (menuIndex + 1) % navItemsRef.current.length;
      setMenuIndex(nextIndex);
      navItemsRef.current[nextIndex]?.focus();
    }
  }

  function openPrevNavItem() {
    if (typeof menuIndex === "number") {
      const prevIndex =
        (menuIndex - 1 + navItemsRef.current.length) %
        navItemsRef.current.length;
      setMenuIndex(prevIndex);
      navItemsRef.current[prevIndex]?.focus();
    }
  }

  function createHandleButtonKeyDown() {
    return (event) => {
      if (event.key === "ArrowRight") {
        openNextNavItem();
      } else if (event.key === "ArrowLeft") {
        openPrevNavItem();
      }
    };
  }

  function handleCloseDrawer(event) {
    return toggleDrawer(false)(event);
  }

  useEffect(() => {
    if (drawerOpen && firstFocusableRef.current) {
      firstFocusableRef.current.focus();
    }
  }, [drawerOpen]);

  // Used when window width is smaller than 1200px
  function AuthInDrawer() {
    if (isAuthenticated) {
      return (
        <>
          <Typography
            level="body-xs"
            textTransform="uppercase"
            fontWeight="lg"
            sx={{ px: 1.5, py: 1 }}
          >
            User profile
          </Typography>
          <ListItem role="none">
            <ListItemButton
              role="menuitem"
              component={RouterLink}
              to="/user-profile"
              ref={firstFocusableRef}
              onClick={(e) => toggleDrawer(false)(e)}
            >
              My Profile
            </ListItemButton>
          </ListItem>
          <ListItem role="none">
            <ListItemButton
              role="menuitem"
              component={RouterLink}
              to="/user-profile-update"
              ref={firstFocusableRef}
              onClick={(e) => toggleDrawer(false)(e)}
            >
              Edit Profile
            </ListItemButton>
          </ListItem>
          {canEditAllElements && (
            <>
              <Divider sx={{ my: 1 }} />
              <Typography
                level="body-xs"
                textTransform="uppercase"
                fontWeight="lg"
                sx={{ px: 1.5, py: 1 }}
              >
                Admin
              </Typography>
              <ListItem role="none">
                <ListItemButton
                  role="menuitem"
                  component="a"
                  href="/new-doc"
                  ref={firstFocusableRef}
                  onClick={(e) => toggleDrawer(false)(e)}
                >
                  New Documentation
                </ListItemButton>
              </ListItem>
              {isSuperAdmin && (
                <ListItem role="none">
                  <ListItemButton
                    role="menuitem"
                    component="a"
                    href="/admin-panel"
                    ref={firstFocusableRef}
                    onClick={(e) => toggleDrawer(false)(e)}
                  >
                    Admin Panel
                  </ListItemButton>
                </ListItem>
              )}
            </>
          )}

          {canAccessHPC && (
            <>
              <Divider sx={{ my: 1 }} />
              <Typography
                level="body-xs"
                textTransform="uppercase"
                fontWeight="lg"
                sx={{ px: 1.5, py: 1 }}
              >
                Advanced Resources
              </Typography>
              <ListItem role="none">
                <ListItemButton
                  role="menuitem"
                  component="a"
                  href="https://ondemand.anvil.rcac.purdue.edu"
                  target="_blank"
                  rel="noopener noreferrer"
                  ref={firstFocusableRef}
                  onClick={(e) => toggleDrawer(false)(e)}
                >
                  Anvil HPC
                </ListItemButton>
              </ListItem>
              <ListItem role="none">
                <ListItemButton
                  role="menuitem"
                  component="a"
                  href="https://portal-aces.hprc.tamu.edu"
                  target="_blank"
                  rel="noopener noreferrer"
                  ref={firstFocusableRef}
                  onClick={(e) => toggleDrawer(false)(e)}
                >
                  TAMU ACES
                </ListItemButton>
              </ListItem>
            </>
          )}

          {canAccessLLMSearch && (
            <>
              <Divider sx={{ my: 1 }} />
              <Typography
                level="body-xs"
                textTransform="uppercase"
                fontWeight="lg"
                sx={{ px: 1.5, py: 1 }}
              >
                Beta feature
              </Typography>
              <ListItem role="none">
                <ListItemButton
                  role="menuitem"
                  component="a"
                  href="/smart-search"
                  ref={firstFocusableRef}
                  onClick={(e) => toggleDrawer(false)(e)}
                >
                  Smart Search
                </ListItemButton>
              </ListItem>
            </>
          )}
          {canContributeElements && (
            <>
              <Divider sx={{ my: 1 }} />
              <Typography
                level="body-xs"
                textTransform="uppercase"
                fontWeight="lg"
                sx={{ px: 1.5, py: 1 }}
              >
                New Contribution
              </Typography>
              <ListItem role="none">
                <ListItemButton
                  role="menuitem"
                  component="a"
                  href="/contribution/map"
                  ref={firstFocusableRef}
                  onClick={(e) => toggleDrawer(false)(e)}
                >
                  New Map
                </ListItemButton>
              </ListItem>
              <ListItem role="none">
                <ListItemButton
                  role="menuitem"
                  component="a"
                  href="/contribution/dataset"
                  ref={firstFocusableRef}
                  onClick={(e) => toggleDrawer(false)(e)}
                >
                  New Dataset
                </ListItemButton>
              </ListItem>
              <ListItem role="none">
                <ListItemButton
                  role="menuitem"
                  component="a"
                  href="/contribution/notebook"
                  ref={firstFocusableRef}
                  onClick={(e) => toggleDrawer(false)(e)}
                >
                  New Notebook
                </ListItemButton>
              </ListItem>
              <ListItem role="none">
                <ListItemButton
                  role="menuitem"
                  component="a"
                  href="/contribution/publication"
                  ref={firstFocusableRef}
                  onClick={(e) => toggleDrawer(false)(e)}
                >
                  New Publication
                </ListItemButton>
              </ListItem>
              {canEditOER && (
                <ListItem role="none">
                  <ListItemButton
                    role="menuitem"
                    component="a"
                    href="/contribution/oer"
                    ref={firstFocusableRef}
                    onClick={(e) => toggleDrawer(false)(e)}
                  >
                    New Educational Resource
                  </ListItemButton>
                </ListItem>
              )}
              <ListItem role="none">
                <ListItemButton
                  role="menuitem"
                  component="a"
                  href="/contribution/code"
                  ref={firstFocusableRef}
                  onClick={(e) => toggleDrawer(false)(e)}
                >
                  New Code
                </ListItemButton>
              </ListItem>
            </>
          )}
          <Divider sx={{ my: 1 }} />
          <ListItem role="none">
            <ListItemButton
              role="menuitem"
              ref={firstFocusableRef}
              onClick={userLogout}
            >
              Log Out
            </ListItemButton>
          </ListItem>
        </>
      );
    } else {
      return (
        <ListItem role="none">
          <ListItemButton
            role="menuitem"
            ref={firstFocusableRef}
            onClick={userLogin}
          >
            Sign In with CILogon
          </ListItemButton>
        </ListItem>
      );
    }
  }

  return (
    <MaterialCssVarsProvider theme={{ [MATERIAL_THEME_ID]: materialTheme }}>
      <JoyCssVarsProvider>
        <CssBaseline enableColorScheme />
        <AppBar
          color="inherit"
          sx={{
            position: { xs: "absolute", md: "fixed" },
            top: { xs: 0, md: 10 },
            left: { md: "50%" },
            transform: { md: "translateX(-50%)" },
            maxWidth: "lg",
            borderRadius: { xs: 0, md: 6 },
            boxShadow: 3,
            zIndex: 1100,
            backgroundColor: {
              xs: "rgba(255, 255, 255, 0.95)",
              md: "rgba(255, 255, 255, 0.8)",
            },
            backdropFilter: { xs: "none", md: "blur(5px)" },
            WebkitBackdropFilter: { xs: "none", md: "blur(5px)" },
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Box
            sx={{
              height: { xs: NAVBAR_HEIGHT, md: NAVBAR_HEIGHT - 10 },
              px: 2,
              display: "flex",
              bgcolor: "neutral",
            }}
          >
            {ENV !== "production" && (
              // Warning for non-production environments
              <Typography
                color="danger"
                sx={{
                  position: "absolute",
                  top: "1px",
                  left: "30px",
                  fontSize: "0.7rem",
                  fontWeight: 800,
                  whiteSpace: "nowrap",
                  pointerEvents: "none",
                  zIndex: 0,
                }}
              >
                FOR TESTING ONLY
              </Typography>
            )}
            {/* When page is narrower than 1200px */}
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              spacing={2}
              sx={{ display: { xs: "flex", md: "none" }, width: "100%" }}
            >
              <Tooltip title="Home" enterDelay={500}>
                <Link
                  aria-label="Go back to I-GUIDE Platform homepage"
                  to="/"
                  underline="none"
                  component={RouterLink}
                  sx={{ color: "text.tertiary" }}
                >
                  <Box
                    component="img"
                    sx={{
                      height: 40,
                      px: 2,
                    }}
                    alt="I-GUIDE logo"
                    src={iguideLogo}
                  />
                </Link>
              </Tooltip>
              <Button
                size="md"
                ref={buttonRef}
                id="composition-button"
                aria-label="View menu"
                aria-controls="composition-menu"
                aria-haspopup="true"
                aria-expanded={drawerOpen ? "true" : undefined}
                variant="plain"
                color="neutral"
                onClick={toggleDrawer(true)}
              >
                <MenuIcon />
              </Button>
              <Drawer open={drawerOpen} onClose={toggleDrawer(false)}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 0.5,
                    ml: "auto",
                    mt: 1,
                    mr: 2,
                  }}
                >
                  <Typography
                    component="label"
                    htmlFor="close-icon"
                    fontSize="sm"
                    fontWeight="lg"
                    sx={{ cursor: "pointer" }}
                  >
                    Close
                  </Typography>
                  <ModalClose id="close-icon" sx={{ position: "initial" }} />
                </Box>
                <Box sx={{ px: 2, py: 1 }}>
                  <SearchBar
                    onSearch={() => setDrawerOpen(false)}
                    placeholder="Search..."
                  />
                </Box>
                <Box
                  onClick={handleCloseDrawer}
                  onKeyDown={handleCloseDrawer}
                  sx={{ px: 2, py: 1 }}
                >
                  <List role="menu">
                    <Typography
                      level="title-md"
                      sx={{
                        wordBreak: "break-word",
                        width: "100%",
                        px: 1.5,
                      }}
                    >
                      {localUserInfo.first_name
                        ? `Hello ${localUserInfo.first_name}!`
                        : "Welcome!"}
                    </Typography>
                    <Divider sx={{ my: 1 }} />
                    <Typography
                      level="body-xs"
                      textTransform="uppercase"
                      fontWeight="lg"
                      sx={{ px: 1.5, py: 1 }}
                    >
                      Knowledge Elements
                    </Typography>
                    {elementPages?.map(([label, path]) => (
                      <ListItem role="none" key={path}>
                        <ListItemButton
                          role="menuitem"
                          component={RouterLink}
                          to={path}
                          ref={firstFocusableRef}
                          onClick={(e) => toggleDrawer(false)(e)}
                        >
                          {label}
                        </ListItemButton>
                      </ListItem>
                    ))}
                    <ListDivider />
                    <Typography
                      level="body-xs"
                      textTransform="uppercase"
                      fontWeight="lg"
                      sx={{ px: 1.5, py: 1 }}
                    >
                      Support
                    </Typography>
                    {supportPages?.map(([label, path]) => (
                      <ListItem role="none" key={path}>
                        <ListItemButton
                          role="menuitem"
                          component={RouterLink}
                          to={path}
                          ref={firstFocusableRef}
                          onClick={(e) => toggleDrawer(false)(e)}
                        >
                          {label}
                        </ListItemButton>
                      </ListItem>
                    ))}
                    <ListItem role="none">
                      <ListItemButton
                        role="menuitem"
                        component={RouterLink}
                        to="/about"
                        ref={firstFocusableRef}
                        onClick={(e) => toggleDrawer(false)(e)}
                      >
                        About Us
                      </ListItemButton>
                    </ListItem>
                    <Divider sx={{ my: 1 }} />
                    <AuthInDrawer />
                  </List>
                </Box>
              </Drawer>
            </Stack>

            {/* When page is wider than 1200px */}
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              sx={{ display: { xs: "none", md: "flex" }, width: "100%" }}
            >
              <Stack
                direction="row"
                justifyContent="flex-start"
                alignItems="center"
                spacing={2}
              >
                <Box className="tourid-1">
                  <Tooltip title="Home" enterDelay={1000}>
                    <Link
                      to="/"
                      aria-label="Go back to I-GUIDE Platform homepage"
                      underline="none"
                      component={RouterLink}
                      sx={{ color: "text.tertiary" }}
                      ref={(el) => (navItemsRef.current[0] = el)}
                      onKeyDown={createHandleButtonKeyDown(0)}
                      onMouseEnter={() => setMenuIndex(0)}
                    >
                      <Box
                        component="img"
                        sx={{ height: 40 }}
                        alt="I-GUIDE logo"
                        src={iguideLogo}
                      />
                    </Link>
                  </Tooltip>
                </Box>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Box className="tourid-2">
                    <HoverOverMenuTab
                      ref={(el) => (navItemsRef.current[1] = el)}
                      menu={elementPages}
                      onKeyDown={createHandleButtonKeyDown(1)}
                      onMouseEnter={() => setMenuIndex(1)}
                    >
                      Knowledge Elements
                    </HoverOverMenuTab>
                  </Box>
                  <Box className="tourid-3">
                    <HoverOverMenuTab
                      ref={(el) => (navItemsRef.current[2] = el)}
                      menu={supportPages}
                      onKeyDown={createHandleButtonKeyDown(2)}
                      onMouseEnter={() => setMenuIndex(2)}
                    >
                      Support
                    </HoverOverMenuTab>
                  </Box>
                  <Button
                    ref={(el) => (navItemsRef.current[3] = el)}
                    to="/about"
                    component={RouterLink}
                    variant="plain"
                    color="neutral"
                    size="sm"
                    sx={{ alignSelf: "center", px: 1, py: 1 }}
                    onKeyDown={createHandleButtonKeyDown(3)}
                    onMouseEnter={() => setMenuIndex(3)}
                  >
                    About Us
                  </Button>
                </Stack>
              </Stack>
              <Stack
                direction="row"
                justifyContent="flex-start"
                alignItems="center"
                spacing={1}
              >
                <SearchModal />
                {isAuthenticated && canAccessJupyterHub ? (
                  <Tooltip title="Open I-GUIDE JupyterHub" enterDelay={500}>
                    <Link
                      aria-label="Open I-GUIDE JupyterHub in a new window"
                      component="a"
                      href={JUPYTERHUB_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      underline="none"
                      sx={{ color: "text.tertiary" }}
                    >
                      <Box
                        component="img"
                        className="tourid-5"
                        sx={{
                          height: 40,
                          px: 1,
                        }}
                        alt="JupyterHub logo"
                        src={jupyterLogo}
                      />
                    </Link>
                  </Tooltip>
                ) : (
                  <Tooltip
                    title="To use I-GUIDE JupyterHub, please log in using your academic email"
                    variant="solid"
                  >
                    <span>
                      <Button
                        size="sm"
                        disabled
                        sx={{
                          backgroundColor: "transparent",
                          boxShadow: "none",
                          "&:disabled": {
                            backgroundColor: "transparent",
                            boxShadow: "none",
                          },
                        }}
                      >
                        <Avatar
                          variant="plain"
                          alt="JupyterHub logo"
                          src={jupyterLogo}
                          className="tourid-5"
                          sx={{
                            "& img": {
                              filter: "grayscale(100%)",
                              objectFit: "contain",
                            },
                            borderRadius: 0,
                          }}
                        />
                      </Button>
                    </span>
                  </Tooltip>
                )}
                <UserProfileButton
                  isAuthenticated={isAuthenticated}
                  localUserInfo={localUserInfo}
                  ref={(el) => (navItemsRef.current[4] = el)}
                  onKeyDown={createHandleButtonKeyDown(4)}
                  onMouseEnter={() => setMenuIndex(4)}
                />
              </Stack>
            </Stack>
          </Box>
        </AppBar>
      </JoyCssVarsProvider>
    </MaterialCssVarsProvider>
  );
}
