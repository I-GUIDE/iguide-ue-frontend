import * as React from 'react';

import Stack from '@mui/joy/Stack';
import Divider from '@mui/joy/Divider';
import Typography from '@mui/joy/Typography';
import Link from '@mui/joy/Link';
import Button from '@mui/joy/Button';
import Box from '@mui/joy/Box';

import ExitToAppIcon from '@mui/icons-material/ExitToApp';

const iFrameStyle = {
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    width: '100%',
    height: '1000px'
};

// Providing repo url and the notebook filename, return the location of the rendered notebook
function get_notebook_html(repo_url, notebook_filename) {
    const match = repo_url.match(
        /^https?:\/\/(www\.)?github.com\/(?<owner>[\w.-]+)\/(?<name>[\w.-]+)/
    );
    let ret = "https://nbviewer.cgwebhost.cigi.illinois.edu/github/" + match.groups.owner + "/" + match.groups.name + "/blob/main/" + notebook_filename;
    return ret;
}

function get_openwith_url(repo_url, notebook_filename) {
    const repo_name = repo_url.split('/').pop();
    let ret = "https://jupyter.iguide.illinois.edu/hub/user-redirect/git-pull/?repo=" + repo_url + "&urlpath=/lab/tree/" + repo_name + "/" + notebook_filename;
    return ret;
}

export default function NotebookViewer(props) {
    const repoUrl = props.repoUrl;
    const notebookFile = props.notebookFile;

    let notebookUrl = '';
    let iGuidePlatformUrl = '';

    // Render the notebook only when the HTML notebook is unavailable
    if (repoUrl != '') {
        notebookUrl = get_notebook_html(repoUrl, notebookFile);
        iGuidePlatformUrl = get_openwith_url(repoUrl, notebookFile);
    }

    return (
        <Stack spacing={2} sx={{ px: { xs: 2, md: 4 }, pt: 2, minHeight: 0 }}>
            <Typography
                id="notebook-tags"
                level="h5"
                fontWeight="lg"
                mb={1}
            >
                Notebook Viewer
            </Typography>
            <Divider inset="none" />
            <Box
                direction="row"
                justifyContent="flex-start"
                alignItems="flex-end"
                spacing={1}
            >
                <Button color="success" size="sm" sx={{ my: 1, mx: 0.5 }}>
                    <Link
                        underline="none"
                        href={iGuidePlatformUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        sx={{ color: 'inherit' }}
                    >
                        Access Notebook on I-GUIDE Platform&nbsp;<ExitToAppIcon />
                    </Link>
                </Button>&nbsp;(Login Required)
            </Box>
            <Stack spacing={2} sx={{ px: { xs: 2, md: 4 }, pt: 2, minHeight: 0 }}>
                <div className="standards-page">
                    <iframe style={iFrameStyle} src={notebookUrl}></iframe>
                </div>
            </Stack>
        </Stack>
    )
}