import React from "react";

import Tooltip from "@mui/joy/Tooltip";
import Box from "@mui/joy/Box";
import IconButton from "@mui/joy/IconButton";
import Menu from "@mui/joy/Menu";
import MenuItem from "@mui/joy/MenuItem";
import MenuButton from "@mui/joy/MenuButton";
import Dropdown from "@mui/joy/Dropdown";

import ShareIcon from "@mui/icons-material/Share";

import {
  EmailShareButton,
  EmailIcon,
  FacebookShareButton,
  FacebookIcon,
  LinkedinShareButton,
  LinkedinIcon,
  TwitterShareButton,
  XIcon,
} from "react-share";

const TEST_MODE = import.meta.env.VITE_TEST_MODE;
const REACT_FRONTEND_URL = import.meta.env.VITE_REACT_FRONTEND_URL;
const WEBSITE_TITLE = import.meta.env.VITE_WEBSITE_TITLE;

export default function ShareButton(props) {
  const elementType = props.elementType;
  const elementId = props.elementId;
  const elementTitle = props.elementTitle;

  if (!elementType && !elementId) {
    return null;
  }

  const elementUrl = `${REACT_FRONTEND_URL}/${elementType}s/${elementId}`;
  const shareTitle = `${WEBSITE_TITLE}: ${elementTitle}`;
  TEST_MODE && console.log("Share url", elementUrl, "title", shareTitle);

  return (
    <Box sx={{ display: "flex", alignItems: "flex-start", py: 1 }}>
      <Dropdown>
        <Tooltip title="Share this element" placement="top" arrow>
          <MenuButton
            slots={{ root: IconButton }}
            slotProps={{
              root: { variant: "outlined", color: "neutral", size: "sm" },
            }}
          >
            <ShareIcon />
          </MenuButton>
        </Tooltip>
        <Menu>
          <MenuItem>
            <Tooltip title="Email" placement="left" arrow>
              <EmailShareButton url={elementUrl} className="email-button">
                <EmailIcon size={40} round />
              </EmailShareButton>
            </Tooltip>
          </MenuItem>
          <MenuItem>
            <Tooltip title="Facebook" placement="left" arrow>
              <FacebookShareButton url={elementUrl} className="facebook-button">
                <FacebookIcon size={40} round />
              </FacebookShareButton>
            </Tooltip>
          </MenuItem>
          <MenuItem>
            <Tooltip title="LinkedIn" placement="left" arrow>
              <LinkedinShareButton url={elementUrl} className="linkedin-button">
                <LinkedinIcon size={40} round />
              </LinkedinShareButton>
            </Tooltip>
          </MenuItem>
          <MenuItem>
            <Tooltip title="X" placement="left" arrow>
              <TwitterShareButton
                url={elementUrl}
                title={shareTitle}
                className="x-button"
              >
                <XIcon size={40} round />
              </TwitterShareButton>
            </Tooltip>
          </MenuItem>
        </Menu>
      </Dropdown>
    </Box>
  );
}
