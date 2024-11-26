import React, { useState } from "react";

import { Link as RouterLink } from "react-router";

import Tooltip from "@mui/joy/Tooltip";
import Link from "@mui/joy/Link";
import Button from "@mui/joy/Button";
import List from "@mui/joy/List";
import ListItem from "@mui/joy/ListItem";
import ListItemButton from "@mui/joy/ListItemButton";

export default function HoverOverMenuTab(props) {
  const menu = props.menu;
  const menuBody = props.menuBody;
  const tabName = props.children;
  const tabLink = props.tabLink;

  const [open, setOpen] = useState(false);

  return (
    <Tooltip
      placement="bottom"
      variant="outlined"
      open={open}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      leaveDelay={100}
      title={
        menuBody ? (
          menuBody
        ) : (
          <List>
            {menu.map((item) => (
              <Link
                key={item[0]}
                to={item[1]}
                underline="none"
                component={RouterLink}
                sx={{ color: "text.tertiary" }}
              >
                <ListItem sx={{ width: "100%" }}>
                  <ListItemButton onClick={() => setOpen(false)}>
                    {item[0]}
                  </ListItemButton>
                </ListItem>
              </Link>
            ))}
          </List>
        )
      }
    >
      <Link
        to={tabLink}
        component={RouterLink}
        style={{ textDecoration: "none" }}
      >
        <Button
          variant="plain"
          color="neutral"
          size="sm"
          sx={{ alignSelf: "center" }}
        >
          {tabName}
        </Button>
      </Link>
    </Tooltip>
  );
}
