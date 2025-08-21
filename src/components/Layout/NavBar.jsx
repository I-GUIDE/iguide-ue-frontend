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

const ENV = import.meta.env.VITE_ENV;
const JUPYTERHUB_URL = import.meta.env.VITE_JUPYTERHUB_URL;

const docPages = [
  ["About Us", "/about"],
  ["Getting Started", "/docs/getting-started"],
  ["FAQ", "/docs/frequently-asked-questions"],
  ["Tutorials", "/tutorials"],
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
          sx={{ maxWidth: 250 }}
          title={
            <List>
              <ListItem sx={{ width: "100%" }}>
                <Typography level="title-md" sx={{ wordBreak: "break-word" }}>
                  {localUserInfo.first_name
                    ? `Hello ${localUserInfo.first_name}!`
                    : "Hello!"}
                </Typography>
              </ListItem>
              <ListDivider />
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
                    fontWeight="md"
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
                      <ListItemButton onClick={() => setOpen(false)}>
                        New Documentation
                      </ListItemButton>
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
                        <ListItemButton onClick={() => setOpen(false)}>
                          Admin Panel
                        </ListItemButton>
                      </ListItem>
                    </Link>
                  )}
                </>
              )}

              {canAccessHPC && (
                <>
                  <ListDivider />
                  <Typography
                    level="body-xs"
                    textTransform="uppercase"
                    fontWeight="md"
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
                      <ListItemButton onClick={() => setOpen(false)}>
                        Anvil HPC
                      </ListItemButton>
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
                      <ListItemButton onClick={() => setOpen(false)}>
                        TAMU ACES
                      </ListItemButton>
                    </ListItem>
                  </Link>
                </>
              )}

              {canAccessLLMSearch && (
                <>
                  <ListDivider />
                  <Typography
                    level="body-xs"
                    textTransform="uppercase"
                    fontWeight="md"
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
                      <ListItemButton onClick={() => setOpen(false)}>
                        Smart Search
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
                    fontWeight="md"
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
                      <ListItemButton onClick={() => setOpen(false)}>
                        New Map
                      </ListItemButton>
                    </ListItem>
                  </Link>
                  <Link
                    href="/contribution/dataset"
                    underline="none"
                    sx={{ color: "text.tertiary" }}
                  >
                    <ListItem sx={{ width: "100%" }}>
                      <ListItemButton onClick={() => setOpen(false)}>
                        New Dataset
                      </ListItemButton>
                    </ListItem>
                  </Link>
                  <Link
                    href="/contribution/notebook"
                    underline="none"
                    sx={{ color: "text.tertiary" }}
                  >
                    <ListItem sx={{ width: "100%" }}>
                      <ListItemButton onClick={() => setOpen(false)}>
                        New Notebook
                      </ListItemButton>
                    </ListItem>
                  </Link>
                  <Link
                    href="/contribution/publication"
                    underline="none"
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
                      href="/contribution/oer"
                      underline="none"
                      sx={{ color: "text.tertiary" }}
                    >
                      <ListItem sx={{ width: "100%" }}>
                        <ListItemButton onClick={() => setOpen(false)}>
                          New Educational Resource
                        </ListItemButton>
                      </ListItem>
                    </Link>
                  )}
                  <Link
                    href="/contribution/code"
                    underline="none"
                    sx={{ color: "text.tertiary" }}
                  >
                    <ListItem sx={{ width: "100%" }}>
                      <ListItemButton onClick={() => setOpen(false)}>
                        New Code
                      </ListItemButton>
                    </ListItem>
                  </Link>
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
            className="tourid-4"
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
        <Button
          size="sm"
          color="primary"
          onClick={userLogin}
          className="tourid-4"
        >
          Login
        </Button>
      );
    }
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
        <AppBar
          color="inherit"
          sx={{
            position: { xs: "absolute", lg: "fixed" },
            top: { xs: 0, lg: 10 },
            left: { lg: "50%" },
            transform: { lg: "translateX(-50%)" },
            maxWidth: "lg",
            borderRadius: { xs: 0, lg: 6 },
            boxShadow: 3,
            zIndex: 1100,
          }}
        >
          <Box
            sx={{
              height: { xs: NAVBAR_HEIGHT, lg: NAVBAR_HEIGHT - 10 },
              pt: 1,
              mx: 2,
              display: "auto",
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
                      <ListItem sx={{ width: "100%" }}>
                        <Typography
                          level="title-md"
                          sx={{ wordBreak: "break-word" }}
                        >
                          {localUserInfo.first_name
                            ? `Hello ${localUserInfo.first_name}!`
                            : "Hello!"}
                        </Typography>
                      </ListItem>
                      <ListDivider />
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
                      {docPages?.map((page) => (
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

            {/* When page is wider than 1200px */}
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
                <Box className="tourid-1">
                  <Link
                    to={"/"}
                    underline="none"
                    component={RouterLink}
                    sx={{ color: "text.tertiary" }}
                  >
                    <Tooltip title="I-GUIDE Platform Home" variant="solid">
                      <Box
                        component="img"
                        sx={{ height: 40, mt: 1, pl: 2, pr: 3 }}
                        alt="Logo"
                        src="/images/Logo.png"
                      />
                    </Tooltip>
                  </Link>
                </Box>
                <Box className="tourid-3">
                  <HoverOverMenuTab menu={elementPages}>
                    Elements
                  </HoverOverMenuTab>
                </Box>
                <Box className="tourid-2">
                  <HoverOverMenuTab menu={docPages}>
                    Documentation
                  </HoverOverMenuTab>
                </Box>
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
                  {isAuthenticated && canAccessJupyterHub ? (
                    // If the user is logged in, activate the link to JupyterHub
                    <Tooltip title="Open I-GUIDE JupyterHub" variant="solid">
                      <Button
                        size="sm"
                        component="a"
                        href={JUPYTERHUB_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Avatar
                          variant="plain"
                          alt="jupyterhub"
                          src="/images/Jupyter-logo.png"
                          className="tourid-5"
                          sx={{
                            "& img": {
                              objectFit: "contain",
                            },
                            borderRadius: 0,
                          }}
                        />
                      </Button>
                    </Tooltip>
                  ) : (
                    <Tooltip
                      title="To use I-GUIDE JupyterHub, please log in using your academic email"
                      variant="solid"
                    >
                      <span>
                        <Button size="sm" disabled>
                          <Avatar
                            variant="plain"
                            alt="jupyterhub"
                            src="/images/Jupyter-logo.png"
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
