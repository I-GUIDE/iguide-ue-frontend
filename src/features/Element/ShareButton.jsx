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

const DEEP_TEST_MODE = import.meta.env.VITE_DEEP_TEST_MODE;

export default function ShareButton(props) {
  const shareUrl = props.shareUrl;
  const shareTitle = props.shareTitle;

  if (!shareUrl) {
    return null;
  }

  DEEP_TEST_MODE && console.log("Share url", shareUrl, "title", shareTitle);

  return (
    <Box sx={{ display: "flex", alignItems: "flex-start", py: 1 }}>
      <Dropdown>
        <Tooltip title="Share this element" placement="top" arrow>
          <MenuButton
            slots={{ root: IconButton }}
            slotProps={{
              root: { variant: "outlined", color: "neutral", size: "sm" },
            }}
            aria-label="Share this element"
          >
            <ShareIcon />
          </MenuButton>
        </Tooltip>
        <Menu>
          <MenuItem>
            <Tooltip title="Email" placement="left" arrow>
              <EmailShareButton url={shareUrl} className="email-button">
                <EmailIcon size={40} round />
              </EmailShareButton>
            </Tooltip>
          </MenuItem>
          <MenuItem>
            <Tooltip title="Facebook" placement="left" arrow>
              <FacebookShareButton url={shareUrl} className="facebook-button">
                <FacebookIcon size={40} round />
              </FacebookShareButton>
            </Tooltip>
          </MenuItem>
          <MenuItem>
            <Tooltip title="LinkedIn" placement="left" arrow>
              <LinkedinShareButton url={shareUrl} className="linkedin-button">
                <LinkedinIcon size={40} round />
              </LinkedinShareButton>
            </Tooltip>
          </MenuItem>
          <MenuItem>
            <Tooltip title="X" placement="left" arrow>
              <TwitterShareButton
                url={shareUrl}
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
