// NOTE: After fixing bugs, please don't forget to fix HoverOverMenuTab.jsx due to similarity.

import { useState, useRef, useEffect, forwardRef } from "react";

import { Link as RouterLink } from "react-router";

import Button from "@mui/joy/Button";
import Menu from "@mui/joy/Menu";
import MenuItem from "@mui/joy/MenuItem";
import MenuButton from "@mui/joy/MenuButton";
import Dropdown from "@mui/joy/Dropdown";
import Tooltip from "@mui/joy/Tooltip";

import Typography from "@mui/joy/Typography";
import Divider from "@mui/joy/Divider";

import { userLogin, userLogout } from "../utils/UserManager";
import UserAvatar from "./UserAvatar";
import { PERMISSIONS } from "../configs/Permissions";

export default forwardRef(function UserProfileButton(props, ref) {
  const isAuthenticated = props.isAuthenticated;
  const localUserInfo = props.localUserInfo;

  const onKeyDown = props.onKeyDown;
  const onMouseEnter = props.onMouseEnter;

  const [anchorEl, setAnchorEl] = useState(null);
  const isOpen = Boolean(anchorEl);

  const timeoutRef = useRef(null);
  const menuItemsRef = useRef([]);

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

  function handleMenuKeyDown(event, index) {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      const nextIndex = (index + 1) % menuItemsRef.current.length;
      menuItemsRef.current[nextIndex]?.focus();
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      const prevIndex =
        (index - 1 + menuItemsRef.current.length) % menuItemsRef.current.length;
      menuItemsRef.current[prevIndex]?.focus();
    } else if (event.key === "Escape") {
      setAnchorEl(null);
      ref?.current?.focus();
    }
  }

  // Focus the first menu item when menu opens
  useEffect(() => {
    if (isOpen && menuItemsRef.current.length > 0) {
      menuItemsRef.current[0]?.focus();
    }
  }, [isOpen]);

  if (isAuthenticated) {
    return (
      <Dropdown>
        <MenuButton
          variant="plain"
          color="neutral"
          size="sm"
          aria-label="User menu"
          sx={{
            alignSelf: "center",
            "&:hover": {
              backgroundColor: "transparent",
            },
            px: 0,
          }}
          onClick={handleOpen}
          onMouseEnter={(e) => {
            handleOpen(e);
            if (onMouseEnter) onMouseEnter();
          }}
          onMouseLeave={handleClose}
          onKeyDown={onKeyDown}
          className="tourid-4"
        >
          <UserAvatar
            userAvatarUrls={localUserInfo["avatar_url"]}
            userId={localUserInfo.id}
            avatarResolution="low"
            isLoading={Object.keys(localUserInfo).length === 0}
          />
        </MenuButton>

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
          <Typography
            level="title-md"
            sx={{ wordBreak: "break-word", px: 1.5, py: 1 }}
          >
            {localUserInfo.first_name
              ? `Hello ${localUserInfo.first_name}!`
              : "Welcome!"}
          </Typography>
          <Divider sx={{ my: 0.5 }} />
          <MenuItem
            to="/user-profile"
            component={RouterLink}
            sx={{ width: "100%" }}
            onClick={() => setAnchorEl(null)}
            onKeyDown={(e) => handleMenuKeyDown(e, 0)}
          >
            My Profile
          </MenuItem>
          <MenuItem
            to="/user-profile-update"
            component={RouterLink}
            sx={{ width: "100%" }}
            onClick={() => setAnchorEl(null)}
            onKeyDown={(e) => handleMenuKeyDown(e, 1)}
          >
            Edit Profile
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
                onKeyDown={(e) => handleMenuKeyDown(e, 2)}
              >
                New Documentation
              </MenuItem>
              {isSuperAdmin && (
                <MenuItem
                  to="/admin-panel"
                  component={RouterLink}
                  sx={{ width: "100%" }}
                  onClick={() => setAnchorEl(null)}
                  onKeyDown={(e) => handleMenuKeyDown(e, 3)}
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
                onKeyDown={(e) => handleMenuKeyDown(e, 4)}
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
                onKeyDown={(e) => handleMenuKeyDown(e, 5)}
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
                onKeyDown={(e) => handleMenuKeyDown(e, 6)}
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
                onKeyDown={(e) => handleMenuKeyDown(e, 7)}
              >
                New Map
              </MenuItem>
              <MenuItem
                component="a"
                href="/contribution/dataset"
                sx={{ width: "100%" }}
                onClick={() => setAnchorEl(null)}
                onKeyDown={(e) => handleMenuKeyDown(e, 8)}
              >
                New Dataset
              </MenuItem>
              <MenuItem
                component="a"
                href="/contribution/notebook"
                sx={{ width: "100%" }}
                onClick={() => setAnchorEl(null)}
                onKeyDown={(e) => handleMenuKeyDown(e, 9)}
              >
                New Notebook
              </MenuItem>
              <MenuItem
                component="a"
                href="/contribution/publication"
                sx={{ width: "100%" }}
                onClick={() => setAnchorEl(null)}
                onKeyDown={(e) => handleMenuKeyDown(e, 10)}
              >
                New Publication
              </MenuItem>
              {canEditOER && (
                <MenuItem
                  component="a"
                  href="/contribution/oer"
                  sx={{ width: "100%" }}
                  onClick={() => setAnchorEl(null)}
                  onKeyDown={(e) => handleMenuKeyDown(e, 11)}
                >
                  New Educational Resource
                </MenuItem>
              )}
              <MenuItem
                component="a"
                href="/contribution/code"
                sx={{ width: "100%" }}
                onClick={() => setAnchorEl(null)}
                onKeyDown={(e) => handleMenuKeyDown(e, 12)}
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
            onKeyDown={(e) => handleMenuKeyDown(e, 13)}
          >
            Contact Us
          </MenuItem>
          <Divider sx={{ my: 0.5 }} />
          <MenuItem
            sx={{ width: "100%" }}
            onClick={userLogout}
            onKeyDown={(e) => handleMenuKeyDown(e, 14)}
          >
            Log Out
          </MenuItem>
        </Menu>
      </Dropdown>
    );
  } else {
    return (
      <Tooltip title="You'll be redirected to CILogon to sign in with your institution">
        <Button
          size="sm"
          color="primary"
          variant="solid"
          onClick={userLogin}
          sx={{ borderRadius: "999px", px: 2, py: 1 }}
          className="tourid-4"
        >
          Sign In
        </Button>
      </Tooltip>
    );
  }
});
