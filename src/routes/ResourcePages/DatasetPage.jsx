import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import Stack from '@mui/joy/Stack';
import { CssVarsProvider } from '@mui/joy/styles';
import CssBaseline from '@mui/joy/CssBaseline';
import Box from '@mui/joy/Box';
import Grid from '@mui/joy/Grid';
import Container from '@mui/joy/Container';

import { DataRetriever } from '../../utils/DataRetrieval';
import MainContent from '../../components/ResourcePagesComps/MainContent';
import CapsuleList from '../../components/ResourcePagesComps/CapsuleList';
import RelatedResourcesList from '../../components/ResourcePagesComps/RelatedResourcesList';
import CodeSnippet from '../../components/ResourcePagesComps/CodeSnippet';
import ActionList from '../../components/ResourcePagesComps/ActionsList';
import GoBackButton from '../../components/ResourcePagesComps/GoBackButton';
import Header from '../../components/Layout/Header';

function DatasetPage() {
    const [title, setTitle] = useState('');
    const [authors, setAuthors] = useState([]);
    const [abstract, setAbstract] = useState('');
    const [tags, setTags] = useState([]);
    const [relatedNotebooks, setRelatedNotebooks] = useState([]);
    const [relatedPublications, setRelatedPublicatons] = useState([]);
    const [relatedOERs, setRelatedOERs] = useState([]);
    const [externalLink, setExternalLink] = useState('');
    const [directDownloadLink, setDirectDownloadLink] = useState('');
    const [size, setSize] = useState('');
    const id = useParams().id;

    useEffect(() => {
        const fetchData = async () => {
            const Datasets = await DataRetriever('dataset');

            for (const obj of Datasets) {
                if (obj.id === id) {
                    setRelatedNotebooks(obj['related-notebooks']);
                    setRelatedPublicatons(obj['related-pubulications']);
                    setRelatedOERs(obj['related-oers']);
                    setTitle(obj.title);
                    setAuthors(obj.authors);
                    setAbstract(obj.contents);
                    setTags(obj.tags);
                    setExternalLink(obj['external-link']);
                    setDirectDownloadLink(obj['direct-download-link']);
                    setSize(obj.size);
                    break;
                }
            }
        };
        fetchData();
    }, [id]);

    return (
        <CssVarsProvider disableTransitionOnChange>
            <CssBaseline />
            <Header title="Dataset" subtitle="Individual Dataset" />
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

                        <Grid sm={12} md={6}>
                            <Stack spacing={2} sx={{ px: { xs: 2, md: 4 }, pt: 2, minHeight: 0 }}>
                                <CapsuleList title="Tags" items={tags} />
                                <CodeSnippet directDownloadLink={directDownloadLink} />
                                <ActionList externalLink={externalLink} directDownloadLink={directDownloadLink} size={size} />
                            </Stack>
                        </Grid>
                        <Grid sm={12} md={6}>
                            <Stack spacing={2} sx={{ px: { xs: 2, md: 4 }, pt: 2, minHeight: 0 }}>
                                <RelatedResourcesList title="Related notebooks" relatedResourcesIds={relatedNotebooks} relatedResourceType="notebook" />
                                <RelatedResourcesList title="Related publications" relatedResourcesIds={relatedPublications} relatedResourceType="publication" />
                                <RelatedResourcesList title="Related educational resources" relatedResourcesIds={relatedOERs} relatedResourceType="oer" />
                            </Stack>
                        </Grid>

                        <Grid md={12}>
                            <Stack spacing={2} sx={{ px: { xs: 2, md: 4 }, pt: 2, minHeight: 0 }}>
                                <GoBackButton parentPage="/datasets" />
                            </Stack>
                        </Grid>
                    </Grid>
                </Box>
            </Container>
        </CssVarsProvider>
    );
}

export default DatasetPage;

