import React from 'react';

import Stack from '@mui/joy/Stack';
import { CssVarsProvider } from '@mui/joy/styles';
import CssBaseline from '@mui/joy/CssBaseline';
import Box from '@mui/joy/Box';
import Grid from '@mui/joy/Grid';

import InfoCard from '../components/InfoCard';
import Header from '../components/Layout/Header';
import Filter from '../components/Filter';

import notebookMetadata from '../assets/metadata/notebook-metadata.json';

const unique_tag_list = []
{
    notebookMetadata.map(metadata => {
        metadata.tags.map(tag => {
            if (!unique_tag_list.includes(tag)) {
                unique_tag_list.push(tag)
            }
        })
    })
}

const unique_author_list = []
{
    notebookMetadata.map(metadata => {
        if (!unique_author_list.includes(metadata.author)) {
            unique_author_list.push(metadata.author)
        }
    })
}


const Notebooks = () => {
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
                <Grid
                    container
                    rowSpacing={2}
                    columnSpacing={{ xs: 1, sm: 2, md: 3 }}
                    sx={{
                        backgroundColor: 'background.surface',
                        px: { xs: 2, md: 4 },
                        py: 2,
                        borderBottom: '1px solid',
                        borderColor: 'divider',
                    }}
                >
                    <Grid xs={3}>
                        <Stack spacing={2} sx={{ px: { xs: 2, md: 4 }, pt: 2, minHeight: 0 }}>
                            <Filter filterList={unique_tag_list} filterType="tags" />
                            <Filter filterList={unique_author_list} filterType="authors" />
                        </Stack>
                    </Grid>
                    <Grid xs={9}>
                        <Stack spacing={2} sx={{ px: { xs: 2, md: 4 }, pt: 2, minHeight: 0 }}>
                            <Header title='Notebooks' subtitle='Find your notebook here.' />
                            {notebookMetadata.map((notebook) => (
                                <InfoCard
                                    title={notebook.title}
                                    subtitle={notebook.author}
                                    tags={notebook.tags}
                                    contents={notebook.contents} />
                            ))}
                        </Stack>
                    </Grid>
                </Grid>

                {/* Leave the code for future responsive design */}
                {/* <Stack
                    sx={{
                        backgroundColor: 'background.surface',
                        px: { xs: 2, md: 4 },
                        py: 2,
                        borderBottom: '1px solid',
                        borderColor: 'divider',
                    }}
                >
                    <Stack spacing={2} sx={{ px: { xs: 2, md: 4 }, pt: 2, minHeight: 0 }}>
                        <Header title='Notebooks' subtitle='Find your notebook here.' />
                        {notebookMetadata.map((notebook) => (
                            <InfoCard
                                title={notebook.title}
                                subtitle={notebook.author}
                                tags={notebook.tags}
                                contents={notebook.contents} />
                        ))}
                    </Stack>
                </Stack> */}

            </Box>
        </CssVarsProvider>
    )
}

export default Notebooks;