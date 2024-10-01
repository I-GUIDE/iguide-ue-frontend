import { React, useState, useRef } from "react";

import { Link } from "react-router-dom";

import {
  experimental_extendTheme as materialExtendTheme,
  Experimental_CssVarsProvider as MaterialCssVarsProvider,
  THEME_ID as MATERIAL_THEME_ID,
} from "@mui/material/styles";
import { CssVarsProvider as JoyCssVarsProvider } from "@mui/joy/styles";
import CssBaseline from "@mui/material/CssBaseline";
const materialTheme = materialExtendTheme();
import AppBar from "@mui/material/AppBar";

import Box from "@mui/joy/Box";
import Typography from "@mui/joy/Typography";
import Stack from "@mui/joy/Stack";
import Button from "@mui/joy/Button";
import ButtonGroup from "@mui/joy/ButtonGroup";
import MenuItem from "@mui/joy/MenuItem";
import Menu from "@mui/joy/Menu";
import ListDivider from "@mui/joy/ListDivider";
import MenuButton from "@mui/joy/MenuButton";
import Dropdown from "@mui/joy/Dropdown";
import Avatar from "@mui/joy/Avatar";
import Drawer from "@mui/joy/Drawer";
import List from "@mui/joy/List";
import Divider from "@mui/joy/Divider";
import ListItem from "@mui/joy/ListItem";
import ListItemButton from "@mui/joy/ListItemButton";
import ModalClose from "@mui/joy/ModalClose";
import MenuIcon from "@mui/icons-material/Menu";
import Tooltip from "@mui/joy/Tooltip";

import SearchBar from "../SearchBar";
import UserAvatar from "../UserAvatar";

import { NAVBAR_HEIGHT } from "../../configs/VarConfigs";
import { PERMISSIONS } from "../../configs/Permissions";

const aboutDropdown = [
  ["About Us", "/about"],
  ["Getting Started", "/docs/getting-started"],
  ["FAQ", "/docs/frequently-asked-questions"],
  ["Tutorials", "/tutorials"],
];

const pages = [
  ["Datasets", "/datasets"],
  ["Notebooks", "/notebooks"],
  ["Publications", "/publications"],
  ["Educational Resources", "/oers"],
  ["Maps", "/maps"],
];
const AUTH_BACKEND_URL = import.meta.env.VITE_EXPRESS_BACKEND_URL;

export default function NavBar(props) {
  const isAuthenticated = props.isAuthenticated;
  const localUserInfo = props.localUserInfo ? props.localUserInfo : {};

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

  // Redirect users to the auth backend for login
  function login() {
    window.open(AUTH_BACKEND_URL + "/login", "_self");
  }

  // Redirect users to auth backend for logout
  function logout() {
    window.open(AUTH_BACKEND_URL + "/logout", "_self");
  }

  // About button
  function AboutButton() {
    return (
      <Dropdown>
        <MenuButton
          variant="plain"
          color="neutral"
          size="sm"
          sx={{ alignSelf: "center" }}
        >
          About
        </MenuButton>
        <Menu
          placement="bottom-end"
          color="primary"
          modifiers={[
            {
              name: "offset",
              options: {
                offset: [80, 25],
              },
            },
          ]}
        >
          {aboutDropdown.map((item) => (
            <Link key={item[0]} to={item[1]} style={{ textDecoration: "none" }}>
              <MenuItem>{item[0]}</MenuItem>
            </Link>
          ))}
        </Menu>
      </Dropdown>
    );
  }

  // If the user is logged in, display the logout button, otherwise login
  function AuthButton() {
    if (isAuthenticated) {
      return (
        <Dropdown>
          <Tooltip title="Open User Menu" variant="solid">
            <MenuButton color="primary">
              <UserAvatar
                link={localUserInfo["avatar_url"]}
                userId={localUserInfo.id}
              />
            </MenuButton>
          </Tooltip>

          <Menu
            placement="bottom-end"
            color="primary"
            modifiers={[
              {
                name: "offset",
                options: {
                  offset: [0, 15],
                },
              },
            ]}
          >
            <Link to={"/user-profile"} style={{ textDecoration: "none" }}>
              <MenuItem>My Profile</MenuItem>
            </Link>
            <Link
              to={"/user-profile-update"}
              style={{ textDecoration: "none" }}
            >
              <MenuItem>Update Profile</MenuItem>
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
                <MenuItem component="a" href="/new-doc">
                  New Documentation
                </MenuItem>
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
                <MenuItem component="a" href="/contribution/dataset">
                  New Dataset
                </MenuItem>
                <MenuItem component="a" href="/contribution/notebook">
                  New Notebook
                </MenuItem>
                <MenuItem component="a" href="/contribution/publication">
                  New Publication
                </MenuItem>
                {canEditOER && (
                  <MenuItem component="a" href="/contribution/oer">
                    New Educational Resource
                  </MenuItem>
                )}
                {canEditMap && (
                  <MenuItem component="a" href="/contribution/map">
                    New Map
                  </MenuItem>
                )}
              </>
            )}
            <ListDivider />
            <MenuItem onClick={logout}>Logout</MenuItem>
          </Menu>
        </Dropdown>
      );
    } else {
      return (
        <Button size="sm" color="primary" onClick={login}>
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
          <Link to={"/user-profile"} style={{ textDecoration: "none" }}>
            <ListItem>My Profile</ListItem>
          </Link>
          <Link to={"/user-profile-update"} style={{ textDecoration: "none" }}>
            <ListItem>Update Profile</ListItem>
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
              <Link to="/new-doc" style={{ textDecoration: "none" }}>
                <ListItem>New Documentation</ListItem>
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
                to="/contribution/dataset"
                style={{ textDecoration: "none" }}
              >
                <ListItem>New Dataset</ListItem>
              </Link>
              <Link
                to="/contribution/notebook"
                style={{ textDecoration: "none" }}
              >
                <ListItem>New Notebook</ListItem>
              </Link>
              <Link
                to="/contribution/publication"
                style={{ textDecoration: "none" }}
              >
                <ListItem>New Publication</ListItem>
              </Link>

              {canEditOER && (
                <Link to="/contribution/oer" style={{ textDecoration: "none" }}>
                  <ListItem>New Educational Resource</ListItem>
                </Link>
              )}
              {canEditMap && (
                <Link to="/contribution/map" style={{ textDecoration: "none" }}>
                  <ListItem>New Map</ListItem>
                </Link>
              )}
            </>
          )}
          <Divider sx={{ my: 1 }} />
          <ListItem onClick={logout}>Logout</ListItem>
        </List>
      );
    } else {
      return (
        <List>
          <ListItem size="sm" color="primary" onClick={login}>
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
                    <SearchBar onSearch={() => setDrawerOpen(false)} />
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
                      {aboutDropdown?.map((page) => (
                        <Link
                          key={page[1]}
                          to={page[1]}
                          style={{ textDecoration: "none" }}
                        >
                          <ListItem key={page[0]}>
                            <Typography textAlign="center">
                              {page[0]}
                            </Typography>
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
                          style={{ textDecoration: "none" }}
                        >
                          <ListItem key={page[0]}>
                            <Typography textAlign="center">
                              {page[0]}
                            </Typography>
                          </ListItem>
                        </Link>
                      ))}
                    </List>
                    <Divider sx={{ my: 1 }} />
                    <AuthInDrawer />
                  </Box>
                </Drawer>
                <Link to={"/"} style={{ textDecoration: "none" }}>
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
                <Link to={"/"} style={{ textDecoration: "none" }}>
                  <Tooltip title="I-GUIDE Platform Home" variant="solid">
                    <Box
                      component="img"
                      sx={{ height: 40, mt: 1, px: 2 }}
                      alt="Logo"
                      src="/images/Logo.png"
                    />
                  </Tooltip>
                </Link>
                <AboutButton />
                {pages?.map((page) => (
                  <Link
                    key={page[1]}
                    to={page[1]}
                    style={{ textDecoration: "none" }}
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
                <SearchBar />
                <ButtonGroup
                  color="primary"
                  orientation="horizontal"
                  size="sm"
                  variant="plain"
                  spacing="0.1rem"
                >
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
