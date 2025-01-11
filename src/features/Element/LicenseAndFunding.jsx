import React, { useState } from "react";

import Typography from "@mui/joy/Typography";
import Stack from "@mui/joy/Stack";
import Link from "@mui/joy/Link";

const TEST_MODE = import.meta.env.VITE_TEST_MODE;

export default function LicenseAndFunding(props) {
  const licenseStatement = props.licenseStatement;
  const licenseUrl = props.licenseUrl;
  const fundingAgency = props.fundingAgency;

  return (
    <Stack spacing={2} sx={{ px: { xs: 2, md: 4 }, py: 3 }}>
      {licenseStatement && (
        <Typography level="body-sm">
          {licenseStatement}
          {licenseUrl && (
            <Typography>
              {" "}
              View license{" "}
              <Link href={licenseUrl} target="_blank" rel="noopener noreferrer">
                here
              </Link>
              .
            </Typography>
          )}
        </Typography>
      )}
      {fundingAgency && (
        <Typography level="body-sm">
          This project is funded by {fundingAgency}.
        </Typography>
      )}
    </Stack>
  );
}
