import * as React from "react";

import { useOutletContext } from "react-router-dom";

import Link from "@mui/joy/Link";
import Stack from "@mui/joy/Stack";
import Button from "@mui/joy/Button";

export default function ContributorOps(props) {
  const elementId = props.elementId;
  const contributorId = props.contributorId;

  // OutletContext retrieving the user object to display user info
  const [
    isAuthenticated,
    setIsAuthenticated,
    userInfo,
    setUserInfo,
    localUserInfo,
    setLocalUserInfo,
  ] = useOutletContext();

  if (!isAuthenticated) {
    return null;
  }

  if (!localUserInfo || localUserInfo.openid !== contributorId) {
    return null;
  }

  return (
    <Stack direction="row" spacing={2} sx={{ px: { xs: 2, md: 4 }, py: 1 }}>
      <Button size="sm" variant="outlined" color="primary">
        <Link
          underline="none"
          href={"/element-update/" + elementId}
          sx={{ color: "inherit" }}
        >
          Edit
        </Link>
      </Button>
    </Stack>
  );
}
