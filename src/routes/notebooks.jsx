import React from 'react';

import Stack from '@mui/joy/Stack';
import { CssVarsProvider } from '@mui/joy/styles';
import CssBaseline from '@mui/joy/CssBaseline';
import Box from '@mui/joy/Box';

import InfoCard from '../components/InfoCard';
import Header from '../components/Layout/Header';

const Notebooks = () => {
    return (
        <CssVarsProvider disableTransitionOnChange>
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
                    <Header title='Notebooks' subtitle='Find your notebook here.' />
                    <Stack spacing={2} sx={{ px: { xs: 2, md: 4 }, pt: 2, minHeight: 0 }}>
                        <InfoCard title="Yosemite" subtitle="CA" tags={["NP", "NPS"]} contents="This is a short description..." />
                        <InfoCard title="Yosemite" subtitle="CA" tags={["NP"]} contents="This is a short description..." />
                    </Stack>
                </Stack>
            </Box>
        </CssVarsProvider>
    )
}

export default Notebooks;