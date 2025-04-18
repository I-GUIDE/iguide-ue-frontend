import React, { lazy, Suspense } from "react";

const MarkdownPreview = lazy(() => import("@uiw/react-markdown-preview"));

import Divider from "@mui/joy/Divider";
import Typography from "@mui/joy/Typography";
import Stack from "@mui/joy/Stack";
import Box from "@mui/joy/Box";

import { generateDataAccessCode } from "../../utils/DataAccessCodeGenerator";

export default function CodeSnippet(props) {
  const directDownloadLink = props.directDownloadLink;

  // Used for generating code styles
  const accessCodeShell = `
\`\`\`shell
${generateDataAccessCode(directDownloadLink, "iguide")}
\`\`\`
`;

  const accessCodePython = `
\`\`\`python
${generateDataAccessCode(directDownloadLink, "python")}
\`\`\`
`;

  if (directDownloadLink && directDownloadLink !== "") {
    return (
      <Stack spacing={2} sx={{ px: { xs: 2, md: 4 }, py: 3 }}>
        <Box>
          <Typography
            id="download-jupyterhub"
            level="h6"
            fontWeight="lg"
            mb={1}
          >
            Direct Data Access (Python)
          </Typography>
          <Divider inset="none" />

          <div
            className="container"
            data-color-mode="light"
            style={{ fontFamily: "Arial, sans-serif" }}
          >
            <Suspense fallback={<p>Loading code block...</p>}>
              {/* April 1, 2025: <Tabs> is temporarily removed, due to download_to_notebook not available */}
              <MarkdownPreview source={accessCodePython} />
            </Suspense>
          </div>
        </Box>
      </Stack>
    );
  } else {
    return null;
  }
}
