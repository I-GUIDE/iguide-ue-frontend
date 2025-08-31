import { useState, useRef } from "react";

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

  const buttonRef = useRef(null);
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
      setDrawerOpen(inOpen);
    };
  }

  // Used when window width is smaller than 1200px
  function AuthInDrawer() {
    if (isAuthenticated) {
      return (
        <List>
          <Typography
            level="body-xs"
            textTransform="uppercase"
            fontWeight="lg"
            sx={{ px: 1.5, py: 1 }}
          >
            User profile
          </Typography>
          <Link
            to="/user-profile"
            underline="none"
            component={RouterLink}
            sx={{ color: "text.tertiary" }}
          >
            <ListItem sx={{ width: "100%" }}>
              <ListItemButton>My Profile</ListItemButton>
            </ListItem>
          </Link>
          <Link
            to="/user-profile-update"
            underline="none"
            component={RouterLink}
            sx={{ color: "text.tertiary" }}
          >
            <ListItem sx={{ width: "100%" }}>
              <ListItemButton>Update Profile</ListItemButton>
            </ListItem>
          </Link>
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
              <Link
                href="/new-doc"
                underline="none"
                sx={{ color: "text.tertiary" }}
              >
                <ListItem sx={{ width: "100%" }}>
                  <ListItemButton>New Documentation</ListItemButton>
                </ListItem>
              </Link>
              {isSuperAdmin && (
                <Link
                  to="/admin-panel"
                  underline="none"
                  component={RouterLink}
                  sx={{ color: "text.tertiary" }}
                >
                  <ListItem sx={{ width: "100%" }}>
                    <ListItemButton>Admin Panel</ListItemButton>
                  </ListItem>
                </Link>
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
              <Link
                component="a"
                href="https://ondemand.anvil.rcac.purdue.edu"
                target="_blank"
                rel="noopener noreferrer"
                underline="none"
                sx={{ color: "text.tertiary" }}
              >
                <ListItem sx={{ width: "100%" }}>
                  <ListItemButton>Anvil HPC</ListItemButton>
                </ListItem>
              </Link>
              <Link
                component="a"
                href="https://portal-aces.hprc.tamu.edu"
                target="_blank"
                rel="noopener noreferrer"
                underline="none"
                sx={{ color: "text.tertiary" }}
              >
                <ListItem sx={{ width: "100%" }}>
                  <ListItemButton>TAMU ACES</ListItemButton>
                </ListItem>
              </Link>
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
              <Link
                href="/smart-search"
                underline="none"
                sx={{ color: "text.tertiary" }}
              >
                <ListItem sx={{ width: "100%" }}>
                  <ListItemButton>Smart Search</ListItemButton>
                </ListItem>
              </Link>
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
              <Link
                href="/contribution/map"
                underline="none"
                sx={{ color: "text.tertiary" }}
              >
                <ListItem sx={{ width: "100%" }}>
                  <ListItemButton>New Map</ListItemButton>
                </ListItem>
              </Link>
              <Link
                href="/contribution/dataset"
                underline="none"
                sx={{ color: "text.tertiary" }}
              >
                <ListItem sx={{ width: "100%" }}>
                  <ListItemButton>New Dataset</ListItemButton>
                </ListItem>
              </Link>
              <Link
                href="/contribution/notebook"
                underline="none"
                sx={{ color: "text.tertiary" }}
              >
                <ListItem sx={{ width: "100%" }}>
                  <ListItemButton>New Notebook</ListItemButton>
                </ListItem>
              </Link>
              <Link
                href="/contribution/publication"
                underline="none"
                sx={{ color: "text.tertiary" }}
              >
                <ListItem sx={{ width: "100%" }}>
                  <ListItemButton>New Publication</ListItemButton>
                </ListItem>
              </Link>
              {canEditOER && (
                <Link
                  href="/contribution/oer"
                  underline="none"
                  sx={{ color: "text.tertiary" }}
                >
                  <ListItem sx={{ width: "100%" }}>
                    <ListItemButton>New Educational Resource</ListItemButton>
                  </ListItem>
                </Link>
              )}
              <Link
                href="/contribution/code"
                underline="none"
                sx={{ color: "text.tertiary" }}
              >
                <ListItem sx={{ width: "100%" }}>
                  <ListItemButton>New Code</ListItemButton>
                </ListItem>
              </Link>
            </>
          )}
          <Divider sx={{ my: 1 }} />
          <ListItem onClick={userLogout}>Logout</ListItem>
        </List>
      );
    } else {
      return (
        <List>
          <ListItem size="sm" color="primary" onClick={userLogin}>
            <ListItemButton>Login</ListItemButton>
          </ListItem>
        </List>
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
              xs: "background.paper",
              md: "rgba(255, 255, 255, 0.8)",
            },
            backdropFilter: { md: "blur(6px)" },
            WebkitBackdropFilter: { md: "blur(6px)" },
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Box
            sx={{
              height: NAVBAR_HEIGHT,
              px: 4,
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
              <Tooltip title="Home" enterDelay={1500}>
                <Link
                  to={"/"}
                  underline="none"
                  component={RouterLink}
                  sx={{ color: "text.tertiary" }}
                >
                  <Box
                    component="img"
                    sx={{
                      height: 40,
                      px: 2,
                      transition: "transform 0.3s ease",
                      "&:hover": {
                        transform: "scale(1.05)",
                      },
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
                  onClick={toggleDrawer(false)}
                  onKeyDown={toggleDrawer(false)}
                  sx={{ px: 2, py: 1 }}
                >
                  <List>
                    <ListItem sx={{ width: "100%" }}>
                      <Typography
                        level="title-md"
                        sx={{ wordBreak: "break-word" }}
                      >
                        {localUserInfo.first_name
                          ? `Hello ${localUserInfo.first_name}!`
                          : "Welcome!"}
                      </Typography>
                    </ListItem>
                  </List>
                  <Divider sx={{ my: 1 }} />
                  <List>
                    <Typography
                      level="body-xs"
                      textTransform="uppercase"
                      fontWeight="lg"
                      sx={{ px: 1.5, py: 1 }}
                    >
                      Knowledge Elements
                    </Typography>
                    {elementPages?.map((page) => (
                      <Link
                        key={page[1]}
                        to={page[1]}
                        underline="none"
                        component={RouterLink}
                        sx={{ color: "text.tertiary" }}
                      >
                        <ListItem sx={{ width: "100%" }}>
                          <ListItemButton>{page[0]}</ListItemButton>
                        </ListItem>
                      </Link>
                    ))}
                  </List>
                  <ListDivider />
                  <List>
                    <Typography
                      level="body-xs"
                      textTransform="uppercase"
                      fontWeight="lg"
                      sx={{ px: 1.5, py: 1 }}
                    >
                      Support
                    </Typography>
                    {supportPages?.map((page) => (
                      <Link
                        key={page[1]}
                        to={page[1]}
                        underline="none"
                        component={RouterLink}
                        sx={{ color: "text.tertiary" }}
                      >
                        <ListItem sx={{ width: "100%" }}>
                          <ListItemButton>{page[0]}</ListItemButton>
                        </ListItem>
                      </Link>
                    ))}
                    <Link
                      key="about"
                      to="/about"
                      underline="none"
                      component={RouterLink}
                      sx={{ color: "text.tertiary" }}
                    >
                      <ListItem sx={{ width: "100%" }}>
                        <ListItemButton>About Us</ListItemButton>
                      </ListItem>
                    </Link>
                  </List>
                  <Divider sx={{ my: 1 }} />
                  <AuthInDrawer />
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
              >
                <Box className="tourid-1">
                  <Tooltip title="Home" enterDelay={1500}>
                    <Link
                      to={"/"}
                      underline="none"
                      component={RouterLink}
                      sx={{ color: "text.tertiary" }}
                    >
                      <Box
                        component="img"
                        sx={{
                          height: 40,
                          pr: 3,
                          transition: "transform 0.3s ease",
                          "&:hover": {
                            transform: "scale(1.05)",
                          },
                        }}
                        alt="I-GUIDE logo"
                        src={iguideLogo}
                      />
                    </Link>
                  </Tooltip>
                </Box>
                <Box className="tourid-2">
                  <HoverOverMenuTab menu={elementPages}>
                    Knowledge Elements
                  </HoverOverMenuTab>
                </Box>
                <Box className="tourid-3">
                  <HoverOverMenuTab menu={supportPages}>
                    Support
                  </HoverOverMenuTab>
                </Box>
                <Link
                  to="/about"
                  component={RouterLink}
                  style={{ textDecoration: "none" }}
                >
                  <Button
                    variant="plain"
                    color="neutral"
                    size="sm"
                    sx={{ alignSelf: "center", px: 1.5 }}
                  >
                    About Us
                  </Button>
                </Link>
              </Stack>
              <Stack
                direction="row"
                justifyContent="flex-start"
                alignItems="center"
                spacing={0.5}
              >
                <SearchModal />
                {isAuthenticated && canAccessJupyterHub ? (
                  <Tooltip title="Open I-GUIDE JupyterHub" enterDelay={1500}>
                    <Link
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
                          px: 2,
                          transition: "transform 0.3s ease",
                          "&:hover": {
                            transform: "scale(1.05)",
                          },
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
                />
              </Stack>
            </Stack>
          </Box>
        </AppBar>
      </JoyCssVarsProvider>
    </MaterialCssVarsProvider>
  );
}
