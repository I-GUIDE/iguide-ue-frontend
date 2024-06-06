import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { CopyBlock, dracula } from "react-code-blocks";

import { Link } from '@mui/joy';
import Stack from '@mui/joy/Stack';
import { CssVarsProvider } from '@mui/joy/styles';
import CssBaseline from '@mui/joy/CssBaseline';
import Box from '@mui/joy/Box';
import Grid from '@mui/joy/Grid';
import Typography from '@mui/joy/Typography';
import List from '@mui/joy/List';
import ListItem from '@mui/joy/ListItem';
import ListItemButton from '@mui/joy/ListItemButton';
import Chip from '@mui/joy/Chip';
import Button from '@mui/joy/Button';
import Container from '@mui/joy/Container';

import Datasets from '../../assets/metadata/dataset-metadata.json';
import './NotebookIFrame.css';

function DatasetPage() {
    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState('');
    const [abstract, setAbstract] = useState('');
    const [tags, setTags] = useState([]);
    const [relatedNotebooks, setRelatedNotebooks] = useState([]);
    const [externalLink, setExternalLink] = useState('');
    const [directDownloadLink, setDirectDownloadLink] = useState('');
    const [size, setSize] = useState('');
    const id = useParams().id;
    const [downloadInstruction, setDownloadInstruction] = useState('');

    // Set the params needed to generate individual notebook page
    useEffect(() => {
        for (var i = 0; i < Datasets.length; i++) {
            var obj = Datasets[i];
            if (obj.id == id) {
                setRelatedNotebooks(obj['related-notebooks']);
                setTitle(obj.title);
                setAuthor(obj.author);
                setAbstract(obj.contents);
                setTags(obj.tags);
                setExternalLink(obj['external-link']);
                setDirectDownloadLink(obj['direct-download-link']);
                setSize(obj.size);
                setDownloadInstruction('! wget ' + directDownloadLink);
            }
        }
    });

    return (
        <CssVarsProvider disableTransitionOnChange>
            <CssBaseline />
            <Container maxWidth="xl">
                <Box
                    component="main"
                    sx={{
                        height: 'calc(100vh - 55px)', // 55px is the height of the NavBar
                        display: 'grid',
                        gridTemplateColumns: { xs: 'auto', md: '100%' },
                        gridTemplateRows: 'auto 1fr auto',
                    }}
                >
                    <Grid
                        container
                        rowSpacing={2}
                        columnSpacing={{ xs: 1, sm: 2, md: 3 }}
                        sx={{
                            backgroundColor: 'inherit',
                            px: { xs: 2, md: 4 },
                            py: 2,
                            borderBottom: '1px solid',
                            borderColor: 'divider',
                        }}
                    >
                        <Grid xs={12}>
                            <Stack spacing={2} sx={{ px: { xs: 2, md: 4 }, pt: 2, minHeight: 0 }}>
                                <Typography level="h1">{title}</Typography>
                                <Typography level="h3" fontSize="xl" sx={{ mb: 0.5 }}>
                                    Created by {author}
                                </Typography>
                                <Typography>
                                    {abstract}
                                </Typography>
                                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                                    <Typography
                                        id="notebook-tags"
                                        level="h5"
                                        fontWeight="lg"
                                        mb={1}
                                    >
                                        Tags:
                                    </Typography>
                                    {tags.map((tag) => (
                                        <Chip
                                            key={tag}
                                            variant="outlined"
                                            color="primary"
                                            size="sm"
                                            sx={{ pointerEvents: 'none' }}
                                        >
                                            {tag}
                                        </Chip>
                                    ))}
                                </Box>
                                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                                    <Button size="sm">
                                        <Link
                                            underline="none"
                                            href={externalLink}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            sx={{ color: 'inherit' }}
                                        >
                                            Access Data Details
                                        </Link>
                                    </Button>
                                </Box>
                                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                                    <Button size="sm">
                                        <Link
                                            underline="none"
                                            href={directDownloadLink}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            sx={{ color: 'inherit' }}
                                        >
                                            Download Data ({size})
                                        </Link>
                                    </Button>
                                </Box>
                                <Box>
                                    <Typography
                                        id="download-jupyterhub"
                                        level="h6"
                                        fontWeight="lg"
                                        mb={1}
                                    >
                                        To download the data on I-GUIDE Platform JupyterHub:
                                    </Typography>
                                    <CopyBlock
                                        language={'shell'}
                                        text={downloadInstruction}
                                        showLineNumbers={false}
                                        theme={dracula}
                                        wrapLines={true}
                                        codeBlock
                                    />
                                </Box>
                                <Typography
                                    id="notebook-ds"
                                    level="h5"
                                    fontWeight="lg"
                                    mb={1}
                                >
                                    Related notebooks:
                                </Typography>
                                <List aria-labelledby="decorated-list-demo">
                                    {relatedNotebooks.map((notebook) => (
                                        <Link
                                            underline="none"
                                            href={"/notebooks/" + notebook}
                                            sx={{ color: 'text.tertiary' }}
                                        >
                                            <ListItem>
                                                <ListItemButton>
                                                    {notebook}
                                                </ListItemButton>
                                            </ListItem>
                                        </Link>
                                    ))}
                                </List>
                                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                                    <Button size="sm">
                                        <Link
                                            underline="none"
                                            href="/notebooks"
                                            sx={{ color: 'inherit' }}
                                        >
                                            Go Back
                                        </Link>
                                    </Button>
                                </Box>
                            </Stack>
                        </Grid>
                    </Grid>
                </Box>
            </Container>
        </CssVarsProvider>
    )
}

export default DatasetPage;