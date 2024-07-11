import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { CssVarsProvider } from '@mui/joy/styles';
import CssBaseline from '@mui/joy/CssBaseline';
import Box from '@mui/joy/Box';
import Grid from '@mui/joy/Grid';
import Container from '@mui/joy/Container';

import { fetchResourcesByField } from '../../utils/DataRetrieval';
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
    const [thumbnailImage, setThumbnailImage] = useState('');
    const id = useParams().id;

    useEffect(() => {
        const fetchData = async () => {
            const thisResourceList = await fetchResourcesByField('_id', [id]);
            // Since the function returns an Array, we extract the content using idx 0
            const thisResource = thisResourceList[0];
            console.log('Element returned: ', thisResource);

            setRelatedNotebooks(thisResource['related-notebooks']);
            setRelatedPublicatons(thisResource['related-publications']);
            setRelatedOERs(thisResource['related-oers']);
            setTitle(thisResource.title);
            setAuthors(thisResource.authors);
            setAbstract(thisResource.contents);
            setTags(thisResource.tags);
            setExternalLink(thisResource['external-link']);
            setDirectDownloadLink(thisResource['direct-download-link']);
            setSize(thisResource.size);
            setThumbnailImage(thisResource['thumbnail-image']);
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
                            <MainContent title={title} authors={authors} contents={abstract} thumbnailImage={thumbnailImage} />
                        </Grid>

                        <Grid sm={12} md={6}>
                            <CapsuleList title="Tags" items={tags} />
                            <ActionList title="Data Exploration" externalLink={externalLink} externalLinkText="Access Data Source"
                                directDownloadLink={directDownloadLink} directDownloadLinkText="Download Data" size={size} />
                            <CodeSnippet directDownloadLink={directDownloadLink} />
                        </Grid>
                        <Grid sm={12} md={6}>
                            <RelatedResourcesList title="Related Notebooks" relatedResourcesIds={relatedNotebooks} relatedResourceType="notebook" />
                            <RelatedResourcesList title="Related Publications" relatedResourcesIds={relatedPublications} relatedResourceType="publication" />
                            <RelatedResourcesList title="Related Educational Resources" relatedResourcesIds={relatedOERs} relatedResourceType="oer" />
                        </Grid>

                        <Grid md={12}>
                            <GoBackButton parentPage="/datasets" parentPageName="Datasets" resourceType="dataset" />
                        </Grid>
                    </Grid>
                </Box>
            </Container>
        </CssVarsProvider>
    );
}

export default DatasetPage;