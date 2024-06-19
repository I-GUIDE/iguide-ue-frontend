import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

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
import ActionList from '../../components/ResourcePagesComps/ActionsList';
import Header from '../../components/Layout/Header';

function PublicationPage() {
    const [title, setTitle] = useState('');
    const [authors, setAuthors] = useState([]);
    const [abstract, setAbstract] = useState('');
    const [tags, setTags] = useState([]);
    const [relatedDatasets, setRelatedDatasets] = useState([]);
    const [relatedOERs, setRelatedOERs] = useState([]);
    const [relatedNotebooks, setRelatedNotebooks] = useState([]);
    const [externalLink, setExternalLink] = useState('');
    const [directDownloadLink, setDirectDownloadLink] = useState('');
    const [size, setSize] = useState('');
    const [thumbnailImage, setThumbnailImage] = useState('');
    const id = useParams().id;

    useEffect(() => {
        const fetchData = async () => {
            const Publications = await DataRetriever('publication');

            for (const obj of Publications) {
                if (obj.id === id) {
                    setRelatedDatasets(obj['related-datasets']);
                    setRelatedOERs(obj['related-oers']);
                    setRelatedNotebooks(obj['related-notebooks']);
                    setTitle(obj.title);
                    setAuthors(obj.authors);
                    setAbstract(obj.contents);
                    setTags(obj.tags);
                    setExternalLink(obj['external-link']);
                    setDirectDownloadLink(obj['direct-download-link']);
                    setSize(obj.size);
                    setThumbnailImage(obj['thumbnail-image']);
                    break;
                }
            }
        };
        fetchData();
    }, [id]);

    return (
        <CssVarsProvider disableTransitionOnChange>
            <CssBaseline />
            <Header title="Publications" subtitle="Individual Publication" />
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
                            <MainContent title={title} authors={authors} contents={abstract} thumbnailImage={thumbnailImage} />
                        </Grid>

                        <Grid sm={12} md={6}>
                            <CapsuleList title="Tags" items={tags} />
                            <ActionList title="Publication Exploration" externalLink={externalLink} externalLinkText="Access Publication"
                                directDownloadLink={directDownloadLink} directDownloadLinkText="Download Paper" size={size} />
                        </Grid>
                        <Grid sm={12} md={6}>
                            <RelatedResourcesList title="Related Datasets" relatedResourcesIds={relatedDatasets} relatedResourceType="dataset" />
                            <RelatedResourcesList title="Related Educational Resources" relatedResourcesIds={relatedOERs} relatedResourceType="oer" />
                            <RelatedResourcesList title="Related Notebooks" relatedResourcesIds={relatedNotebooks} relatedResourceType="notebook" />
                        </Grid>

                        <Grid md={12}>
                            <GoBackButton parentPage="/publications" parentPageName='Publications' />
                        </Grid>
                    </Grid>
                </Box>
            </Container>
        </CssVarsProvider>
    );
}

export default PublicationPage;