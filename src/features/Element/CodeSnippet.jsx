import React, { lazy, Suspense } from "react";

import Divider from "@mui/joy/Divider";
import Typography from "@mui/joy/Typography";
import Stack from "@mui/joy/Stack";
import Box from "@mui/joy/Box";
const MarkdownPreview = lazy(() => import("@uiw/react-markdown-preview"));

import Tabs from "@mui/joy/Tabs";
import TabList from "@mui/joy/TabList";
import Tab from "@mui/joy/Tab";
import TabPanel from "@mui/joy/TabPanel";

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
            Direct Data Access
          </Typography>
          <Divider inset="none" />

          <div
            className="container"
            data-color-mode="light"
            style={{ fontFamily: "Arial, sans-serif" }}
          >
            <Suspense fallback={<p>Loading code block...</p>}>
              <Tabs aria-label="Basic tabs" defaultValue={0}>
                <TabList>
                  <Tab>I-GUIDE JupyterHub</Tab>
                  <Tab>Python</Tab>
                </TabList>
                <TabPanel value={0}>
                  <MarkdownPreview source={accessCodeShell} />
                </TabPanel>
                <TabPanel value={1}>
                  <MarkdownPreview source={accessCodePython} />
                </TabPanel>
              </Tabs>
            </Suspense>
          </div>
        </Box>
      </Stack>
    );
  } else {
    return null;
  }
}
