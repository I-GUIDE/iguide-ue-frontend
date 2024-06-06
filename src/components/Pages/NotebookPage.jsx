import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

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
import Notebooks from '../../assets/metadata/notebook-metadata.json';
import { extractValueFromJSON } from '../../helpers/helper';
import './NotebookIFrame.css';

function NotebookPage() {
    const [title, setTitle] = useState("")
    const [author, setAuthor] = useState("")
    const [abstract, setAbstract] = useState("")
    const [tags, setTags] = useState([])
    const [relatedDatasets, setRelatedDatasets] = useState([]);
    const [htmlNotebook, setHtmlNotebook] = useState("")
    const id = useParams().id;

    // Generate individual notebook page
    useEffect(() => {
        for (var i = 0; i < Notebooks.length; i++) {
            var obj = Notebooks[i];
            if (obj.id == id) {
                setRelatedDatasets(obj['related-datasets']);
                setTitle(obj.title);
                setAuthor(obj.author);
                setAbstract(obj.contents);
                setTags(obj.tags);
                setHtmlNotebook(obj['html-notebook'])
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
                        <Grid xs={4}>
                            <Stack spacing={2} sx={{ px: { xs: 2, md: 4 }, pt: 2, minHeight: 0 }}>
                                <Typography level="h1">{title}</Typography>
                                <Typography level="h3" fontSize="xl" sx={{ mb: 0.5 }}>
                                    Created by {author}
                                </Typography>
                                <Typography>
                                    {abstract}
                                </Typography>
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
                                <Typography
                                    id="notebook-ds"
                                    level="h5"
                                    fontWeight="lg"
                                    mb={1}
                                >
                                    Related datasets:
                                </Typography>
                                <List aria-labelledby="decorated-list-demo">
                                    {relatedDatasets.map((dataset) => (
                                        <Link
                                            underline="none"
                                            href={"/datasets/" + dataset}
                                            sx={{ color: 'text.tertiary' }}
                                        >
                                            <ListItem>
                                                <ListItemButton>
                                                    {extractValueFromJSON('id', dataset, 'title', Datasets)}
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
                        <Grid xs={8}>
                            <div className="standards-page">
                                <iframe class="responsive-iframe" src={htmlNotebook}></iframe>
                            </div>
                        </Grid>
                    </Grid>
                </Box>
            </Container>
        </CssVarsProvider>
    )
}

export default NotebookPage;