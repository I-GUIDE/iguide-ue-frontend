import Chip from "@mui/joy/Chip";
import Tooltip from "@mui/joy/Tooltip";

import { PERMISSION_DETAIL } from "../../configs/Permissions";

export function UserRoleChip(props) {
  const roleNumber = props.roleNumber;
  const usePublicRoleName = props.usePublicRoleName || false;
  const disabledTooltip = props.disabledTooltip || false;

  // Don't render when there is no role number passed in or the role number doesn't exist
  if (!roleNumber || !PERMISSION_DETAIL[roleNumber]) {
    return null;
  }

  const roleName = usePublicRoleName
    ? PERMISSION_DETAIL[roleNumber]["role_name_public"]
    : PERMISSION_DETAIL[roleNumber]["role_name"];
  const description = PERMISSION_DETAIL[roleNumber]["description"];

  return (
    <Tooltip title={!disabledTooltip && description} sx={{ maxWidth: "400px" }}>
      <Chip
        variant="soft"
        color={PERMISSION_DETAIL[roleNumber]["color"]}
        size="md"
      >
        {roleName}
      </Chip>
    </Tooltip>
  );
}

export function userRoleName(roleNumber, usePublicRoleName = false) {
  // Don't render when there is no role number passed in or the role number doesn't exist
  if (!roleNumber || !PERMISSION_DETAIL[roleNumber]) {
    return "Unassigned";
  }

  const roleName = usePublicRoleName
    ? PERMISSION_DETAIL[roleNumber]["role_name_public"]
    : PERMISSION_DETAIL[roleNumber]["role_name"];

  return roleName;
}
