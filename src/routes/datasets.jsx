import React from 'react';

import Stack from '@mui/joy/Stack';
import { CssVarsProvider } from '@mui/joy/styles';
import CssBaseline from '@mui/joy/CssBaseline';
import Box from '@mui/joy/Box';

import InfoCard from '../components/InfoCard';
import Header from '../components/Layout/Header';

import datasetMetadata from '../assets/metadata/dataset-metadata.json';

const Datasets = () => {
    return (
        <CssVarsProvider disableTransitionOnChange>
            <CssBaseline />
            <Box
                component="main"
                sx={{
                    height: 'calc(100vh - 55px)', // 55px is the height of the NavBar
                    display: 'grid',
                    gridTemplateColumns: { xs: 'auto', md: '100%' },
                    gridTemplateRows: 'auto 1fr auto',
                }}
            >
                <Stack
                    sx={{
                        backgroundColor: 'background.surface',
                        px: { xs: 2, md: 4 },
                        py: 2,
                        borderBottom: '1px solid',
                        borderColor: 'divider',
                    }}
                >
                    <Stack spacing={2} sx={{ px: { xs: 2, md: 4 }, pt: 2, minHeight: 0 }}>
                    <Header title='Datasets' subtitle='Find your datasets here.' />
                        {datasetMetadata.map((dataset) => (
                            <InfoCard
                                title={dataset.title}
                                subtitle={dataset.author}
                                tags={dataset.tags}
                                contents={dataset.contents} />
                        ))}
                    </Stack>
                </Stack>
            </Box>
        </CssVarsProvider>
    )
}

export default Datasets;