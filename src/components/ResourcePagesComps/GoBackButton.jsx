import * as React from "react";

import Link from "@mui/joy/Link";
import Stack from "@mui/joy/Stack";
import Button from "@mui/joy/Button";
import Box from "@mui/joy/Box";
import Divider from "@mui/joy/Divider";

export default function GoBackButton(props) {
  const parentPage = props.parentPage;
  const parentPageName = props.parentPageName;

  return (
    <Stack spacing={2} sx={{ px: { xs: 2, md: 4 }, py: 3 }}>
      <Divider inset="none" />
      <Box
        direction="row"
        justifyContent="flex-start"
        alignItems="flex-end"
        spacing={1}
      >
        <Button size="sm" color="primary">
          <Link underline="none" href={parentPage} sx={{ color: "inherit" }}>
            Go Back to All {parentPageName}
          </Link>
        </Button>
      </Box>
    </Stack>
  );
}
