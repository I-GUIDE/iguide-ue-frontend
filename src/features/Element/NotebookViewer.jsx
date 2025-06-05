import { useOutletContext } from "react-router";

import Stack from "@mui/joy/Stack";
import Divider from "@mui/joy/Divider";
import Typography from "@mui/joy/Typography";
import Link from "@mui/joy/Link";
import Button from "@mui/joy/Button";
import Box from "@mui/joy/Box";

import ExitToAppIcon from "@mui/icons-material/ExitToApp";

import { PERMISSIONS } from "../../configs/Permissions";

const JUPYTERHUB_URL = import.meta.env.VITE_JUPYTERHUB_URL;

const iFrameStyle = {
  top: 0,
  left: 0,
  bottom: 0,
  right: 0,
  width: "100%",
  height: "1000px",
};

// Providing repo url and the notebook filename, return the location of the rendered notebook
function getNotebookViewerUrl(repo_url, notebook_filename) {
  const match = repo_url.match(
    /^https?:\/\/(www\.)?github.com\/(?<owner>[\w.-]+)\/(?<name>[\w.-]+)/
  );
  if (!match) {
    return "NO_MATCH";
  }
  const ret =
    "https://nbviewer.cgwebhost.cigi.illinois.edu/github/" +
    match.groups.owner +
    "/" +
    match.groups.name +
    "/blob/main/" +
    notebook_filename;
  return ret;
}

function getOpenWithUrl(repo_url, notebook_filename) {
  const repo_name = repo_url.split("/").pop();
  const ret =
    JUPYTERHUB_URL +
    "/hub/user-redirect/git-pull/?repo=" +
    repo_url +
    "&urlpath=/lab/tree/" +
    repo_name +
    "/" +
    notebook_filename;
  return ret;
}

// Handle when the notebook cannot be displayed via nbconvert
function NotebookUnavailable(props) {
  const notebookLink = props.notebookLink;

  if (!notebookLink) {
    return (
      <Stack spacing={2} sx={{ px: { xs: 2, md: 4 }, py: 3 }}>
        <Typography id="notebook-tags" level="h5" fontWeight="lg" mb={1}>
          Notebook Viewer
        </Typography>
        <Typography id="notebook-tags" level="body-md" mb={1}>
          Note: The contributor did not provide a notebook link or the link
          provided is not a Jupyter Notebook.
        </Typography>
      </Stack>
    );
  }

  return (
    <Stack spacing={2} sx={{ px: { xs: 2, md: 4 }, py: 3 }}>
      <Typography id="notebook-tags" level="h5" fontWeight="lg" mb={1}>
        Notebook Viewer
      </Typography>
      <Typography id="notebook-tags" level="body-md" mb={1}>
        We are having issues displaying this notebook. The notebook link
        provided is{" "}
        <Link href={notebookLink} target="_blank" rel="noopener noreferrer">
          {notebookLink}
        </Link>
        .
      </Typography>
    </Stack>
  );
}

export default function NotebookViewer(props) {
  const repoUrl = props.repoUrl;
  const notebookFile = props.notebookFile;
  const htmlNotebook = props.htmlNotebook;

  const { isAuthenticated, localUserInfo } = useOutletContext();
  const canAccessJupyterHub =
    localUserInfo?.role <= PERMISSIONS["access_jupyterhub"];

  if (!htmlNotebook && !notebookFile) {
    return <NotebookUnavailable />;
  }

  // If notebook filename is not ipynb or html, do not render
  if (
    !notebookFile ||
    (!notebookFile.endsWith("ipynb") && !notebookFile.endsWith("html"))
  ) {
    return <NotebookUnavailable />;
  }

  let isUsingNbconvert = false;

  let notebookUrl = "";
  let iGuidePlatformUrl = "";

  // Render the notebook only when the HTML notebook is unavailable
  if (htmlNotebook && htmlNotebook !== "") {
    notebookUrl = htmlNotebook;
    isUsingNbconvert = true;
  } else if (repoUrl && repoUrl !== "") {
    notebookUrl = getNotebookViewerUrl(repoUrl, notebookFile);
    if (notebookUrl === "NO_MATCH") {
      return (
        <NotebookUnavailable
          notebookLink={repoUrl + "/blob/main/" + notebookFile}
        />
      );
    }
  } else {
    return <NotebookUnavailable />;
  }

  // Don't render if the notebook doesn't exist...
  if (!notebookUrl || notebookUrl === "") {
    return <NotebookUnavailable />;
  }
  iGuidePlatformUrl = getOpenWithUrl(repoUrl, notebookFile);

  return (
    <Stack spacing={2} sx={{ px: { xs: 2, md: 4 }, py: 3 }}>
      <Typography id="notebook-tags" level="h5" fontWeight="lg" mb={1}>
        Notebook Viewer
      </Typography>
      <Divider inset="none" />
      <Box
        direction="row"
        justifyContent="flex-start"
        alignItems="flex-end"
        spacing={1}
      >
        {/* Disable the button if users aren't logged in or don't have the permission */}
        {isAuthenticated && canAccessJupyterHub ? (
          <Button color="success" size="sm" sx={{ my: 1 }}>
            <Link
              underline="none"
              href={iGuidePlatformUrl}
              target="_blank"
              rel="noopener noreferrer"
              sx={{ color: "inherit" }}
            >
              Run This Notebook&nbsp;
              <ExitToAppIcon />
            </Link>
          </Button>
        ) : (
          <Box sx={{ my: 1 }}>
            <Button color="success" size="sm" disabled>
              Run This Notebook&nbsp;
              <ExitToAppIcon />
            </Button>
            <Typography level="body-xs" color="warning">
              To run this notebook on I-GUIDE JupyterHub, please log in using
              your institute email.
            </Typography>
          </Box>
        )}
        {isUsingNbconvert && (
          <Typography color="neutral" level="body-sm" variant="plain">
            Disclaimer: This read-only notebook below was automatically
            generated by{" "}
            <Link
              href="https://nbconvert.readthedocs.io/en/latest/"
              target="_blank"
              rel="noopener noreferrer"
            >
              nbconvert
            </Link>
            . Some images or links might be missing or broken.
          </Typography>
        )}
      </Box>

      <div className="standards-page">
        <iframe style={iFrameStyle} src={notebookUrl}></iframe>
      </div>
    </Stack>
  );
}
