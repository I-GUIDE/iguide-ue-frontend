// NOTE: After fixing bugs, please don't forget to fix UserProfileButton.jsx due to similarity.

import { useState, useRef, useEffect, forwardRef } from "react";

import { Link as RouterLink } from "react-router";

import MenuButton from "@mui/joy/MenuButton";
import Menu from "@mui/joy/Menu";
import MenuItem from "@mui/joy/MenuItem";
import Dropdown from "@mui/joy/Dropdown";

import KeyboardArrowDown from "@mui/icons-material/KeyboardArrowDown";

export default forwardRef(function HoverOverMenuTab(props, ref) {
  const menu = props.menu;
  const menuBody = props.menuBody;
  const children = props.children;
  const onKeyDown = props.onKeyDown;
  const onMouseEnter = props.onMouseEnter;

  const [anchorEl, setAnchorEl] = useState(null);
  const isOpen = Boolean(anchorEl);

  const timeoutRef = useRef(null);
  const menuItemsRef = useRef([]);

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

  return (
    <Dropdown>
      <MenuButton
        ref={ref}
        tabIndex={0} // ensures the button is focusable
        variant="plain"
        color="neutral"
        size="sm"
        sx={{ alignSelf: "center", px: 1, py: 1 }}
        endDecorator={
          <span
            style={{
              display: "inline-flex",
              transition: "transform 0.3s ease",
              transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
              transformOrigin: "center",
              mx: "0px",
            }}
          >
            <KeyboardArrowDown style={{ fontSize: "16px" }} />
          </span>
        }
        onClick={handleOpen}
        onMouseEnter={(e) => {
          handleOpen(e);
          if (onMouseEnter) onMouseEnter();
        }}
        onMouseLeave={handleClose}
        onKeyDown={onKeyDown}
      >
        {children}
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
        {menuBody
          ? menuBody
          : menu.map((item, index) => (
              <MenuItem
                component={RouterLink}
                to={item[1]}
                key={item[0]}
                onClick={() => setAnchorEl(null)}
                onKeyDown={(e) => handleMenuKeyDown(e, index)}
              >
                {item[0]}
              </MenuItem>
            ))}
      </Menu>
    </Dropdown>
  );
});
