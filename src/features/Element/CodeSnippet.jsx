import { Suspense } from "react";

import { lazyWithRetryAndReload } from "../../helpers/lazyWithRetryAndReload";
const MarkdownPreview = lazyWithRetryAndReload(() =>
  import("@uiw/react-markdown-preview")
);

import Typography from "@mui/joy/Typography";
import Stack from "@mui/joy/Stack";
import Box from "@mui/joy/Box";

import { generateDataAccessCode } from "../../utils/DataAccessCodeGenerator";

export default function CodeSnippet(props) {
  const directDownloadLink = props.directDownloadLink;

  const dataAccessSnippet = generateDataAccessCode(
    directDownloadLink,
    "python"
  );
  // If data access snippet returns invalid, do not render this component
  if (dataAccessSnippet === "Invalid Input") {
    return;
  }

  const accessCodePython = `
\`\`\`python
${dataAccessSnippet}
\`\`\`
`;

  if (directDownloadLink && directDownloadLink !== "") {
    return (
      <Stack spacing={2} sx={{ py: 3 }}>
        <Box>
          <Typography
            id="download-jupyterhub"
            level="h6"
            fontWeight="lg"
            mb={1}
          >
            Direct Data Access (Python)
          </Typography>

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
