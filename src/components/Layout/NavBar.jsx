import { React, useState, useRef } from "react";

import { Link as RouterLink, useLocation } from "react-router";

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
import ButtonGroup from "@mui/joy/ButtonGroup";
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
import UserAvatar from "../UserAvatar";
import HoverOverMenuTab from "../HoverOverMenuTab";

import { userLogin, userLogout } from "../../utils/UserManager";

import { NAVBAR_HEIGHT } from "../../configs/VarConfigs";
import { PERMISSIONS } from "../../configs/Permissions";

const aboutDropdown = [
  ["Getting Started", "/docs/getting-started"],
  ["FAQ", "/docs/frequently-asked-questions"],
  ["Tutorials", "/tutorials"],
];

const pages = [
  ["Maps", "/maps"],
  ["Datasets", "/datasets"],
  ["Notebooks", "/notebooks"],
  ["Publications", "/publications"],
  ["Educational Resources", "/oers"],
];
const AUTH_BACKEND_URL = import.meta.env.VITE_EXPRESS_BACKEND_URL;
const TEST_MODE = import.meta.env.VITE_TEST_MODE;

export default function NavBar(props) {
  const isAuthenticated = props.isAuthenticated;
  const localUserInfo = props.localUserInfo ? props.localUserInfo : {};
  const currentLocation = useLocation();

  const buttonRef = useRef(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Check if the current user is admin, if yes, allow edit
  const canEditOER = localUserInfo.role <= PERMISSIONS["edit_oer"];
  const canEditMap = localUserInfo.role <= PERMISSIONS["edit_map"];
  const canEditAllElements = localUserInfo.role <= PERMISSIONS["edit_all"];
  const canContributeElements = localUserInfo.role <= PERMISSIONS["contribute"];

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

  // If the user is logged in, display the logout button, otherwise login
  function AuthButton() {
    const [open, setOpen] = useState(false);
    if (isAuthenticated) {
      return (
        <Tooltip
          placement="bottom-start"
          variant="outlined"
          open={open}
          onOpen={() => setOpen(true)}
          onClose={() => setOpen(false)}
          leaveDelay={100}
          title={
            <List>
              <Link
                to="/user-profile"
                underline="none"
                component={RouterLink}
                sx={{ color: "text.tertiary" }}
              >
                <ListItem sx={{ width: "100%" }}>
                  <ListItemButton onClick={() => setOpen(false)}>
                    My Profile
                  </ListItemButton>
                </ListItem>
              </Link>
              <Link
                to="/user-profile-update"
                underline="none"
                component={RouterLink}
                sx={{ color: "text.tertiary" }}
              >
                <ListItem sx={{ width: "100%" }}>
                  <ListItemButton onClick={() => setOpen(false)}>
                    Update Profile
                  </ListItemButton>
                </ListItem>
              </Link>
              {canEditAllElements && (
                <>
                  <ListDivider />
                  <Typography
                    level="body-xs"
                    textTransform="uppercase"
                    fontWeight="lg"
                    sx={{ px: 1.5, py: 1 }}
                  >
                    Admin
                  </Typography>
                  <Link
                    to="/new-doc"
                    underline="none"
                    component={RouterLink}
                    sx={{ color: "text.tertiary" }}
                  >
                    <ListItem sx={{ width: "100%" }}>
                      <ListItemButton onClick={() => setOpen(false)}>
                        New Documentation
                      </ListItemButton>
                    </ListItem>
                  </Link>
                </>
              )}
              {canContributeElements && (
                <>
                  <ListDivider />
                  <Typography
                    level="body-xs"
                    textTransform="uppercase"
                    fontWeight="lg"
                    sx={{ px: 1.5, py: 1 }}
                  >
                    New Contribution
                  </Typography>
                  {canEditMap && (
                    <Link
                      to="/contribution/map"
                      underline="none"
                      component={RouterLink}
                      sx={{ color: "text.tertiary" }}
                    >
                      <ListItem sx={{ width: "100%" }}>
                        <ListItemButton onClick={() => setOpen(false)}>
                          New Map
                        </ListItemButton>
                      </ListItem>
                    </Link>
                  )}
                  <Link
                    to="/contribution/dataset"
                    underline="none"
                    component={RouterLink}
                    sx={{ color: "text.tertiary" }}
                  >
                    <ListItem sx={{ width: "100%" }}>
                      <ListItemButton onClick={() => setOpen(false)}>
                        New Dataset
                      </ListItemButton>
                    </ListItem>
                  </Link>
                  <Link
                    to="/contribution/notebook"
                    underline="none"
                    component={RouterLink}
                    sx={{ color: "text.tertiary" }}
                  >
                    <ListItem sx={{ width: "100%" }}>
                      <ListItemButton onClick={() => setOpen(false)}>
                        New Notebook
                      </ListItemButton>
                    </ListItem>
                  </Link>
                  <Link
                    to="/contribution/publication"
                    underline="none"
                    component={RouterLink}
                    sx={{ color: "text.tertiary" }}
                  >
                    <ListItem sx={{ width: "100%" }}>
                      <ListItemButton onClick={() => setOpen(false)}>
                        New Publication
                      </ListItemButton>
                    </ListItem>
                  </Link>
                  {canEditOER && (
                    <Link
                      to="/contribution/oer"
                      underline="none"
                      component={RouterLink}
                      sx={{ color: "text.tertiary" }}
                    >
                      <ListItem sx={{ width: "100%" }}>
                        <ListItemButton onClick={() => setOpen(false)}>
                          New Educational Resource
                        </ListItemButton>
                      </ListItem>
                    </Link>
                  )}
                </>
              )}
              <ListDivider />
              <Link
                to="/contact-us"
                underline="none"
                component={RouterLink}
                sx={{ color: "text.tertiary" }}
              >
                <ListItem sx={{ width: "100%" }}>
                  <ListItemButton onClick={() => setOpen(false)}>
                    Contact Us
                  </ListItemButton>
                </ListItem>
              </Link>
              <ListDivider />
              <ListItem sx={{ width: "100%" }}>
                <ListItemButton onClick={userLogout}>Logout</ListItemButton>
              </ListItem>
            </List>
          }
        >
          <Button
            variant="plain"
            color="neutral"
            size="sm"
            sx={{ alignSelf: "center" }}
          >
            <UserAvatar
              userAvatarUrls={localUserInfo["avatar_url"]}
              userId={localUserInfo.id}
              avatarResolution="low"
              isLoading={Object.keys(localUserInfo).length === 0}
            />
          </Button>
        </Tooltip>
      );
    } else {
      return (
        <Button size="sm" color="primary" onClick={userLogin}>
          Login
        </Button>
      );
    }
  }

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
                to="/new-doc"
                underline="none"
                component={RouterLink}
                sx={{ color: "text.tertiary" }}
              >
                <ListItem sx={{ width: "100%" }}>
                  <ListItemButton>New Documentation</ListItemButton>
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
              {canEditMap && (
                <Link
                  to="/contribution/map"
                  underline="none"
                  component={RouterLink}
                  sx={{ color: "text.tertiary" }}
                >
                  <ListItem sx={{ width: "100%" }}>
                    <ListItemButton>New Map</ListItemButton>
                  </ListItem>
                </Link>
              )}
              <Link
                to="/contribution/dataset"
                underline="none"
                component={RouterLink}
                sx={{ color: "text.tertiary" }}
              >
                <ListItem sx={{ width: "100%" }}>
                  <ListItemButton>New Dataset</ListItemButton>
                </ListItem>
              </Link>
              <Link
                to="/contribution/notebook"
                underline="none"
                component={RouterLink}
                sx={{ color: "text.tertiary" }}
              >
                <ListItem sx={{ width: "100%" }}>
                  <ListItemButton>New Notebook</ListItemButton>
                </ListItem>
              </Link>
              <Link
                to="/contribution/publication"
                underline="none"
                component={RouterLink}
                sx={{ color: "text.tertiary" }}
              >
                <ListItem sx={{ width: "100%" }}>
                  <ListItemButton>New Publication</ListItemButton>
                </ListItem>
              </Link>
              {canEditOER && (
                <Link
                  to="/contribution/oer"
                  underline="none"
                  component={RouterLink}
                  sx={{ color: "text.tertiary" }}
                >
                  <ListItem sx={{ width: "100%" }}>
                    <ListItemButton>New Educational Resource</ListItemButton>
                  </ListItem>
                </Link>
              )}
            </>
          )}
          <Divider sx={{ my: 1 }} />
          <Link
            to="/contact-us"
            underline="none"
            component={RouterLink}
            sx={{ color: "text.tertiary" }}
          >
            <ListItem sx={{ width: "100%" }}>
              <ListItemButton>Contact Us</ListItemButton>
            </ListItem>
          </Link>
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
        <AppBar position="sticky" color="inherit">
          <Box
            sx={{
              height: NAVBAR_HEIGHT,
              pt: 1,
              mx: 2,
              display: "auto",
              bgcolor: "neutral",
            }}
          >
            {/* When page is narrower than 960px */}
            <Stack
              direction="row"
              justifyContent="flex-start"
              alignItems="center"
              spacing={2}
              sx={{ display: { xs: "flex", lg: "none" } }}
            >
              <Stack
                direction="row"
                justifyContent="flex-start"
                alignItems="center"
              >
                <Button
                  size="lg"
                  ref={buttonRef}
                  id="composition-button"
                  aria-label="View menu"
                  aria-controls={"composition-menu"}
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
                      <Typography
                        level="body-xs"
                        textTransform="uppercase"
                        fontWeight="lg"
                        sx={{ px: 1.5, py: 1 }}
                      >
                        About
                      </Typography>
                      <Link
                        key={"about"}
                        to={"/about"}
                        underline="none"
                        component={RouterLink}
                        sx={{ color: "text.tertiary" }}
                      >
                        <ListItem sx={{ width: "100%" }}>
                          <ListItemButton>About Us</ListItemButton>
                        </ListItem>
                      </Link>
                      {aboutDropdown?.map((page) => (
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
                    <Divider sx={{ my: 1 }} />
                    <List>
                      <Typography
                        level="body-xs"
                        textTransform="uppercase"
                        fontWeight="lg"
                        sx={{ px: 1.5, py: 1 }}
                      >
                        Elements
                      </Typography>
                      {pages?.map((page) => (
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
                    <Divider sx={{ my: 1 }} />
                    <AuthInDrawer />
                  </Box>
                </Drawer>
                <Link
                  to={"/"}
                  underline="none"
                  component={RouterLink}
                  sx={{ color: "text.tertiary" }}
                >
                  <Tooltip title="I-GUIDE Platform Home" variant="solid">
                    <Box
                      component="img"
                      sx={{ height: 40, mt: 1, px: 2 }}
                      alt="Logo"
                      src="/images/Logo.png"
                    />
                  </Tooltip>
                </Link>
              </Stack>
            </Stack>

            {/* When page is wider than 960px */}
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              sx={{ display: { xs: "none", lg: "flex" } }}
            >
              <Stack
                direction="row"
                justifyContent="flex-start"
                alignItems="center"
              >
                <Link
                  to={"/"}
                  underline="none"
                  component={RouterLink}
                  sx={{ color: "text.tertiary" }}
                >
                  <Tooltip title="I-GUIDE Platform Home" variant="solid">
                    <Box
                      component="img"
                      sx={{ height: 40, mt: 1, px: 2 }}
                      alt="Logo"
                      src="/images/Logo.png"
                    />
                  </Tooltip>
                </Link>
                <HoverOverMenuTab menu={aboutDropdown} tabLink="/about">
                  About
                </HoverOverMenuTab>
                {pages?.map((page) => (
                  <Link
                    key={page[1]}
                    to={page[1]}
                    underline="none"
                    component={RouterLink}
                    sx={{ color: "text.tertiary" }}
                  >
                    <Button
                      key={page[0]}
                      variant="plain"
                      color="neutral"
                      size="sm"
                      sx={{ alignSelf: "center" }}
                    >
                      {page[0]}
                    </Button>
                  </Link>
                ))}
              </Stack>
              <Stack
                direction="row"
                justifyContent="flex-start"
                alignItems="center"
                spacing={0.1}
              >
                <SearchBar placeholder="Search..." />
                <ButtonGroup
                  color="primary"
                  orientation="horizontal"
                  size="sm"
                  variant="plain"
                  spacing="0.1rem"
                >
                  <Tooltip
                    title="Questions, help, or bug report"
                    variant="solid"
                  >
                    <Button
                      size="sm"
                      component={RouterLink}
                      to="/contact-us"
                      color="primary"
                    >
                      Help
                    </Button>
                  </Tooltip>
                  <Tooltip title="Open I-GUIDE JupyterHub" variant="solid">
                    <Button
                      size="sm"
                      component="a"
                      href="https://jupyter.iguide.illinois.edu/"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Avatar
                        variant="plain"
                        alt="jupyterhub"
                        src="/images/Jupyter-logo.png"
                      />
                    </Button>
                  </Tooltip>
                  <AuthButton />
                </ButtonGroup>
              </Stack>
            </Stack>
          </Box>
        </AppBar>
      </JoyCssVarsProvider>
    </MaterialCssVarsProvider>
  );
}
