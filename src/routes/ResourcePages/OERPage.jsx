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
import GoBackButton from '../../components/ResourcePagesComps/GoBackButton';
import Header from '../../components/Layout/Header';

function OERPage() {
    const [title, setTitle] = useState('');
    const [authors, setAuthors] = useState([]);
    const [abstract, setAbstract] = useState('');
    const [tags, setTags] = useState([]);
    const [relatedDatasets, setRelatedDatasets] = useState([]);
    const [relatedPublications, setRelatedPublicatons] = useState([]);
    const [relatedNotebooks, setRelatedNotebooks] = useState([]);
    const id = useParams().id;

    useEffect(() => {
        const fetchData = async () => {
            const OERs = await DataRetriever('oer');

            for (const obj of OERs) {
                if (obj.id === id) {
                    setRelatedDatasets(obj['related-datasets']);
                    setRelatedPublicatons(obj['related-pubulications']);
                    setRelatedNotebooks(obj['related-notebooks']);
                    setTitle(obj.title);
                    setAuthors(obj.authors);
                    setAbstract(obj.contents);
                    setTags(obj.tags);
                    break;
                }
            }
        };
        fetchData();
    }, [id]);

    return (
        <CssVarsProvider disableTransitionOnChange>
            <CssBaseline />
            <Header title="Educational Resources" subtitle="Individual Educational Resource" />
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
                            <MainContent title={title} authors={authors} contents={abstract} />
                        </Grid>

                        <Grid sm={12} md={6}>
                            <CapsuleList title="Tags" items={tags} />
                        </Grid>
                        <Grid sm={12} md={6}>
                            <RelatedResourcesList title="Related datasets" relatedResourcesIds={relatedDatasets} relatedResourceType="dataset" />
                            <RelatedResourcesList title="Related publications" relatedResourcesIds={relatedPublications} relatedResourceType="publication" />
                            <RelatedResourcesList title="Related notebooks" relatedResourcesIds={relatedNotebooks} relatedResourceType="notebook" />
                        </Grid>

                        <Grid md={12}>
                            <GoBackButton parentPage="/oers" />
                        </Grid>
                    </Grid>
                </Box>
            </Container>
        </CssVarsProvider>
    );
}

export default OERPage;