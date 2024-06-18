import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import Stack from '@mui/joy/Stack';
import { CssVarsProvider } from '@mui/joy/styles';
import CssBaseline from '@mui/joy/CssBaseline';
import Box from '@mui/joy/Box';
import Grid from '@mui/joy/Grid';
import Container from '@mui/joy/Container';

import { DataRetriever } from '../../utils/DataRetrieval';
import './NotebookIFrame.css';
import MainContent from '../../components/ResourcePagesComps/MainContent';
import CapsuleList from '../../components/ResourcePagesComps/CapsuleList';
import RelatedResourcesList from '../../components/ResourcePagesComps/RelatedResourcesList';
import GoBackButton from '../../components/ResourcePagesComps/GoBackButton';
import Header from '../../components/Layout/Header';
import './NotebookIFrame.css';

function NotebookPage() {
    const [title, setTitle] = useState('');
    const [authors, setAuthors] = useState([]);
    const [abstract, setAbstract] = useState('');
    const [tags, setTags] = useState([]);
    const [relatedDatasets, setRelatedDatasets] = useState([]);
    const [relatedPublications, setRelatedPublicatons] = useState([]);
    const [relatedOERs, setRelatedOERs] = useState([]);
    const [htmlNotebook, setHtmlNotebook] = useState("")
    const id = useParams().id;

    useEffect(() => {
        const fetchData = async () => {
            const Notebooks = await DataRetriever('notebook');

            for (const obj of Notebooks) {
                if (obj.id === id) {
                    setRelatedDatasets(obj['related-datasets']);
                    setRelatedPublicatons(obj['related-pubulications']);
                    setRelatedOERs(obj['related-oers']);
                    setTitle(obj.title);
                    setAuthors(obj.authors);
                    setAbstract(obj.contents);
                    setTags(obj.tags);
                    setHtmlNotebook(obj['html-notebook'])
                    break;
                }
            }
        };
        fetchData();
    }, [id]);

    return (
        <CssVarsProvider disableTransitionOnChange>
            <CssBaseline />
            <Header title="Notebooks" subtitle="Individual Notebook" />
            <Container maxWidth="xl">
                <Box
                    component="main"
                    sx={{
                        minHeight: 'calc(100vh - 420px)', // 55px is the height of the NavBar
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
                        <Grid md={12}>
                            <Stack spacing={2} sx={{ px: { xs: 2, md: 4 }, pt: 2, minHeight: 0 }}>
                                <MainContent title={title} authors={authors} contents={abstract} />
                            </Stack>
                        </Grid>

                        <Grid sm={12} md={4}>
                            <Stack spacing={2} sx={{ px: { xs: 2, md: 4 }, pt: 2, minHeight: 0 }}>
                                <CapsuleList title="Tags" items={tags} />
                                <RelatedResourcesList title="Related datasets" relatedResourcesIds={relatedDatasets} relatedResourceType="dataset" />
                                <RelatedResourcesList title="Related publications" relatedResourcesIds={relatedPublications} relatedResourceType="publication" />
                                <RelatedResourcesList title="Related educational resources" relatedResourcesIds={relatedOERs} relatedResourceType="oer" />
                            </Stack>
                        </Grid>
                        <Grid sm={12} md={8}>
                            <Stack spacing={2} sx={{ px: { xs: 2, md: 4 }, pt: 2, minHeight: 0 }}>
                                <div className="standards-page">
                                    <iframe className="responsive-iframe" src={htmlNotebook}></iframe>
                                </div>
                            </Stack>
                        </Grid>

                        <Grid md={12}>
                            <Stack spacing={2} sx={{ px: { xs: 2, md: 4 }, pt: 2, minHeight: 0 }}>
                                <GoBackButton parentPage="/notebooks" />
                            </Stack>
                        </Grid>
                    </Grid>
                </Box>
            </Container>
        </CssVarsProvider>
    );
}

export default NotebookPage;