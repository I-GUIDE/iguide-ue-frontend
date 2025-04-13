import * as React from "react";

import Chip from "@mui/joy/Chip";
import Tooltip from "@mui/joy/Tooltip";

import { PERMISSION_DETAIL } from "../../configs/Permissions";

export default function UserRoleChip(props) {
  const roleNumber = props.roleNumber;

  // Don't render when there is no role number passed in or the role number doesn't exist
  if (!roleNumber || !PERMISSION_DETAIL[roleNumber]) {
    return;
  }

  const roleName = PERMISSION_DETAIL[roleNumber]["role_name"];
  const description = PERMISSION_DETAIL[roleNumber]["description"];

  return (
    <Tooltip title={description} sx={{ maxWidth: "400px" }}>
      <Chip variant="soft" color="primary" size="md">
        {roleName}
      </Chip>
    </Tooltip>
  );
}
