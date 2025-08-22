import { useState, useRef } from "react";

import { Link as RouterLink } from "react-router";

import Button from "@mui/joy/Button";
import Menu from "@mui/joy/Menu";
import MenuItem from "@mui/joy/MenuItem";

import KeyboardArrowDown from "@mui/icons-material/KeyboardArrowDown";

export default function HoverOverMenuTab(props) {
  const menu = props.menu;
  const menuBody = props.menuBody;
  const tabName = props.children;

  const [anchorEl, setAnchorEl] = useState(null);
  const isOpen = Boolean(anchorEl);

  const timeoutRef = useRef(null);

  function handleOpen(event) {
    clearTimeout(timeoutRef.current);
    setAnchorEl(event.currentTarget);
    setShowMenu(true);
  }

  function handleClose() {
    // Slight delay before closing the menu
    timeoutRef.current = setTimeout(() => {
      setAnchorEl(null);
    }, 100);
  }

  return (
    <>
      <Button
        variant="plain"
        color="neutral"
        size="sm"
        sx={{ alignSelf: "center", px: 1.5 }}
        endDecorator={
          <span
            style={{
              display: "inline-flex",
              transition: "transform 0.3s ease",
              transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
              transformOrigin: "center",
              marginLeft: "0px",
            }}
          >
            <KeyboardArrowDown style={{ fontSize: "16px" }} />
          </span>
        }
        onClick={handleOpen}
        onMouseEnter={handleOpen}
        onMouseLeave={handleClose}
      >
        {tabName}
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
        }}
      >
        {menuBody
          ? menuBody
          : menu.map((item) => (
              <MenuItem
                component={RouterLink}
                to={item[1]}
                key={item[0]}
                onClick={() => setAnchorEl(null)}
              >
                {item[0]}
              </MenuItem>
            ))}
      </Menu>
    </>
  );
}
