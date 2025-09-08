import { useEffect } from "react";
import { useLocation } from "react-router";

import Tooltip from "@mui/joy/Tooltip";
import Box from "@mui/material/Box";
import PropTypes from "prop-types";
import useScrollTrigger from "@mui/material/useScrollTrigger";
import Fab from "@mui/material/Fab";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import Fade from "@mui/material/Fade";

export function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    document.documentElement.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant",
    });
  }, [pathname]);

  return null;
}

export function ClickToTop() {
  function ScrollTop(props) {
    const { children, window } = props;
    // Note that you normally won't need to set the window ref as useScrollTrigger
    // will default to window.
    // This is only being set here because the demo is in an iframe.
    const trigger = useScrollTrigger({
      target: window ? window() : undefined,
      disableHysteresis: true,
      threshold: 100,
    });

    function handleClick(event) {
      const anchor = (event.target.ownerDocument || document).querySelector(
        "#back-to-top-anchor"
      );

      if (anchor) {
        anchor.scrollIntoView({
          block: "center",
          behavior: "smooth",
        });
      }
    }

    return (
      <Fade in={trigger}>
        <Box
          onClick={handleClick}
          role="presentation"
          sx={{
            position: "fixed",
            bottom: 170,
            right: 20,
            zIndex: (theme) => theme.zIndex.tooltip + 1000,
          }}
        >
          {children}
        </Box>
      </Fade>
    );
  }

  ScrollTop.propTypes = {
    children: PropTypes.element.isRequired,
    /**
     * Injected by the documentation to work in an iframe.
     * You won't need it on your project.
     */
    window: PropTypes.func,
  };

  return (
    <ScrollTop>
      <Fab
        sx={{ display: { xs: "none", md: "flex" } }}
        size="small"
        color="neutral"
        aria-label="scroll back to top"
      >
        <Tooltip title="Back to top" placement="top-start">
          <KeyboardArrowUpIcon />
        </Tooltip>
      </Fab>
    </ScrollTop>
  );
}
