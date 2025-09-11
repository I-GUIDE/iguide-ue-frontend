import { useOutletContext } from "react-router";

import Stack from "@mui/joy/Stack";
import Tooltip from "@mui/joy/Tooltip";
import IconButton from "@mui/joy/IconButton";
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
    <Stack direction="row" spacing={1} sx={{ py: 1 }}>
      <Button
        size="sm"
        variant="soft"
        color="warning"
        component="a"
        href={updateFormUri}
      >
        Request DOI
      </Button>
      <Tooltip title="Edit this element" placement="top" arrow>
        <IconButton
          size="sm"
          variant="soft"
          color="primary"
          component="a"
          href={updateFormUri}
          aria-label="Edit this element"
        >
          <EditIcon />
        </IconButton>
      </Tooltip>
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
