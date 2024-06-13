import React from 'react';

import Stack from '@mui/joy/Stack';
import { CssVarsProvider } from '@mui/joy/styles';
import CssBaseline from '@mui/joy/CssBaseline';
import Box from '@mui/joy/Box';
import Grid from '@mui/joy/Grid';
import Container from '@mui/joy/Container';

import InfoCard from '../components/InfoCard';
import Header from '../components/Layout/Header';

import { DataRetriever } from '../utils/DataRetriever';

const datasetMetadata = await DataRetriever('dataset');

const unique_tag_list = []
{
    datasetMetadata.map(metadata => {
        metadata.tags.map(tag => {
            if (!unique_tag_list.includes(tag)) {
                unique_tag_list.push(tag)
            }
        })
    })
}

const unique_author_list = []
{
    datasetMetadata.map(metadata => {
        metadata.authors.map(author => {
            if (!unique_author_list.includes(author)) {
                unique_author_list.push(author)
            }
        })
    })
}

const Datasets = () => {
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
                                <Header title='Datasets' subtitle='Find your dataset here.' />
                                {datasetMetadata.map((dataset) => (
                                    <InfoCard
                                        key={dataset.id}
                                        cardtype={dataset['resource-type']+'s'}
                                        pageid={dataset.id}
                                        title={dataset.title}
                                        subtitle={dataset.authors}
                                        tags={dataset.tags}
                                        contents={dataset.contents}
                                        thumbnailImage={dataset['thumbnail-image']} />
                                ))}
                            </Stack>
                        </Grid>
                    </Grid>
                </Box>
            </Container>
        </CssVarsProvider>
    )
}

export default Datasets;
