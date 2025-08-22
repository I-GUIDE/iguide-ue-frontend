// NOTE: After fixing bugs, please don't forget to fix HoverOverMenuTab.jsx due to similarity.

import { useState, useRef } from "react";

import { Link as RouterLink } from "react-router";

import Button from "@mui/joy/Button";
import Menu from "@mui/joy/Menu";
import MenuItem from "@mui/joy/MenuItem";

import Typography from "@mui/joy/Typography";
import Divider from "@mui/joy/Divider";

import { userLogin, userLogout } from "../utils/UserManager";
import UserAvatar from "./UserAvatar";
import { PERMISSIONS } from "../configs/Permissions";

export default function UserProfileButton(props) {
  const isAuthenticated = props.isAuthenticated;
  const localUserInfo = props.localUserInfo;

  const [anchorEl, setAnchorEl] = useState(null);
  const isOpen = Boolean(anchorEl);

  const timeoutRef = useRef(null);

  const canAccessHPC =
    localUserInfo.role <= PERMISSIONS["display_hpc"] &&
    localUserInfo.affiliation === "ACCESS";
  const canEditOER = localUserInfo.role <= PERMISSIONS["edit_oer"];
  const canEditAllElements = localUserInfo.role <= PERMISSIONS["edit_all"];
  const canAccessLLMSearch = localUserInfo.role <= PERMISSIONS["access_llm"];
  const canContributeElements = localUserInfo.role <= PERMISSIONS["contribute"];
  const isSuperAdmin = localUserInfo.role <= PERMISSIONS["super_admin"];

  function handleOpen(event) {
    clearTimeout(timeoutRef.current);
    setAnchorEl(event.currentTarget);
  }

  function handleClose() {
    // Slight delay before closing the menu
    timeoutRef.current = setTimeout(() => {
      setAnchorEl(null);
    }, 100);
  }

  if (isAuthenticated) {
    return (
      <>
        <Button
          variant="plain"
          color="neutral"
          size="sm"
          sx={{ alignSelf: "center", px: 1.5 }}
          onClick={handleOpen}
          onMouseEnter={handleOpen}
          onMouseLeave={handleClose}
        >
          <UserAvatar
            userAvatarUrls={localUserInfo["avatar_url"]}
            userId={localUserInfo.id}
            avatarResolution="low"
            isLoading={Object.keys(localUserInfo).length === 0}
          />
        </Button>

        <Menu
          anchorEl={anchorEl}
          open={isOpen}
          onClose={() => setAnchorEl(null)}
          placement="bottom-start"
          onMouseEnter={() => clearTimeout(timeoutRef.current)}
          onMouseLeave={handleClose}
          disablePortal
          sx={{
            zIndex: 2000,
            p: 0.5,
          }}
        >
          <MenuItem
            disabled
            sx={{ width: "100%" }}
            onClick={() => setAnchorEl(null)}
          >
            <Typography level="title-md" sx={{ wordBreak: "break-word" }}>
              {localUserInfo.first_name
                ? `Hello ${localUserInfo.first_name}!`
                : "Welcome!"}
            </Typography>
          </MenuItem>
          <Divider sx={{ my: 0.5 }} />
          <MenuItem
            to="/user-profile"
            component={RouterLink}
            sx={{ width: "100%" }}
            onClick={() => setAnchorEl(null)}
          >
            My Profile
          </MenuItem>
          <MenuItem
            to="/user-profile-update"
            component={RouterLink}
            sx={{ width: "100%" }}
            onClick={() => setAnchorEl(null)}
          >
            Update Profile
          </MenuItem>
          {canEditAllElements && (
            <>
              <Divider sx={{ my: 0.5 }} />
              <Typography
                level="body-xs"
                textTransform="uppercase"
                fontWeight="md"
                sx={{ px: 1.5, py: 1 }}
              >
                Admin
              </Typography>
              <MenuItem
                component="a"
                href="/new-doc"
                sx={{ width: "100%" }}
                onClick={() => setAnchorEl(null)}
              >
                New Documentation
              </MenuItem>
              {isSuperAdmin && (
                <MenuItem
                  to="/admin-panel"
                  component={RouterLink}
                  sx={{ width: "100%" }}
                  onClick={() => setAnchorEl(null)}
                >
                  Admin Panel
                </MenuItem>
              )}
            </>
          )}
          {canAccessHPC && (
            <>
              <Divider sx={{ my: 0.5 }} />
              <Typography
                level="body-xs"
                textTransform="uppercase"
                fontWeight="md"
                sx={{ px: 1.5, py: 1 }}
              >
                Advanced Resources
              </Typography>
              <MenuItem
                component="a"
                href="https://ondemand.anvil.rcac.purdue.edu"
                target="_blank"
                rel="noopener noreferrer"
                sx={{ width: "100%" }}
                onClick={() => setAnchorEl(null)}
              >
                Anvil HPC
              </MenuItem>
              <MenuItem
                component="a"
                href="https://portal-aces.hprc.tamu.edu"
                target="_blank"
                rel="noopener noreferrer"
                sx={{ width: "100%" }}
                onClick={() => setAnchorEl(null)}
              >
                TAMU ACES
              </MenuItem>
            </>
          )}
          {canAccessLLMSearch && (
            <>
              <Divider sx={{ my: 0.5 }} />
              <Typography
                level="body-xs"
                textTransform="uppercase"
                fontWeight="md"
                sx={{ px: 1.5, py: 1 }}
              >
                Beta feature
              </Typography>
              <MenuItem
                component="a"
                href="/smart-search"
                sx={{ width: "100%" }}
                onClick={() => setAnchorEl(null)}
              >
                Smart Search
              </MenuItem>
            </>
          )}
          {canContributeElements && (
            <>
              <Divider sx={{ my: 0.5 }} />
              <Typography
                level="body-xs"
                textTransform="uppercase"
                fontWeight="md"
                sx={{ px: 1.5, py: 1 }}
              >
                New Contribution
              </Typography>
              <MenuItem
                component="a"
                href="/contribution/map"
                sx={{ width: "100%" }}
                onClick={() => setAnchorEl(null)}
              >
                New Map
              </MenuItem>
              <MenuItem
                component="a"
                href="/contribution/dataset"
                sx={{ width: "100%" }}
                onClick={() => setAnchorEl(null)}
              >
                New Dataset
              </MenuItem>
              <MenuItem
                component="a"
                href="/contribution/notebook"
                sx={{ width: "100%" }}
                onClick={() => setAnchorEl(null)}
              >
                New Notebook
              </MenuItem>
              <MenuItem
                component="a"
                href="/contribution/publication"
                sx={{ width: "100%" }}
                onClick={() => setAnchorEl(null)}
              >
                New Publication
              </MenuItem>
              {canEditOER && (
                <MenuItem
                  component="a"
                  href="/contribution/oer"
                  sx={{ width: "100%" }}
                  onClick={() => setAnchorEl(null)}
                >
                  New Educational Resource
                </MenuItem>
              )}
              <MenuItem
                component="a"
                href="/contribution/code"
                sx={{ width: "100%" }}
                onClick={() => setAnchorEl(null)}
              >
                New Code
              </MenuItem>
            </>
          )}
          <Divider sx={{ my: 0.5 }} />
          <MenuItem
            to="/contact-us"
            component={RouterLink}
            sx={{ width: "100%" }}
            onClick={() => setAnchorEl(null)}
          >
            Contact Us
          </MenuItem>
          <Divider sx={{ my: 0.5 }} />
          <MenuItem sx={{ width: "100%" }} onClick={userLogout}>
            Logout
          </MenuItem>
        </Menu>
      </>
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
