import * as React from "react";

import { useOutletContext } from "react-router";

import Stack from "@mui/joy/Stack";
import Tooltip from "@mui/joy/Tooltip";
import Link from "@mui/joy/Link";
import Button from "@mui/joy/Button";
import EditIcon from "@mui/icons-material/Edit";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";

import { PERMISSIONS } from "../../configs/Permissions";
import ElementDeleteButton from "../../components/ElementDeleteButton";

export default function ContributorOps(props) {
  const elementId = props.elementId;
  const contributorId = props.contributorId;
  const title = props.title;
  const afterDeleteRedirection = props.afterDeleteRedirection
    ? props.afterDeleteRedirection
    : "/";
  const isPrivateElement = props.isPrivateElement;

  const updateFormUri = `/element-update/${elementId}${
    isPrivateElement ? "?private-mode=true" : ""
  }`;

  // OutletContext retrieving the user object to display user info
  const { isAuthenticated, localUserInfo } = useOutletContext();

  if (!localUserInfo || !isAuthenticated) {
    return null;
  }

  // Check if the current user is admin, if yes, allow edit
  const canEditAllElements = localUserInfo.role <= PERMISSIONS["edit_all"];
  const isContributor = localUserInfo.id === contributorId;
  if (!isContributor && !canEditAllElements) {
    return null;
  }

  return (
    <Stack direction="row" spacing={1} sx={{ px: { xs: 2, md: 4 }, py: 1 }}>
      <Button size="sm" variant="soft" color="primary">
        <Link
          aria-label="Edit this element"
          underline="none"
          component="a"
          href={updateFormUri}
          sx={{ color: "inherit" }}
        >
          <Tooltip title="Edit this element" placement="top" arrow>
            <EditIcon />
          </Tooltip>
        </Link>
      </Button>
      <ElementDeleteButton
        color="danger"
        variant="soft"
        size="sm"
        title={title}
        tooltipTitle="Delete this element"
        elementId={elementId}
        contributorId={contributorId}
        afterDeleteRedirection={afterDeleteRedirection}
      >
        <DeleteForeverIcon />
      </ElementDeleteButton>
    </Stack>
  );
}
