import React from 'react';

import { useOutletContext, useParams } from 'react-router-dom';

import { CssVarsProvider } from '@mui/joy/styles';
import CssBaseline from '@mui/joy/CssBaseline';
import Box from '@mui/joy/Box';
import Container from '@mui/joy/Container';
import Grid from '@mui/joy/Grid';

import Header from '../components/Layout/Header';
import LoginCard from '../components/LoginCard';
import SubmissionCard from '../components/SubmissionCard';

import { DEFAULT_BODY_HEIGHT } from '../configs/ResourceTypes';

export default function ResourceSubmission() {
    const [isAuthenticated, setIsAuthenticated, userInfo, setUserInfo] = useOutletContext();

    const elementType = useParams().elementType;

    // If the user is not authenticated/logged in, they will be redirected to the login page
    if (!isAuthenticated) {
        return (
            <CssVarsProvider disableTransitionOnChange>
                <CssBaseline />
                <Header title="Knowledge Contribution" subtitle="Thanks for your contributions!" />
                <Container maxWidth="xl">
                    <Box
                        component="main"
                        sx={{
                            minHeight: DEFAULT_BODY_HEIGHT,
                            display: 'grid',
                            gridTemplateColumns: { xs: 'auto', md: '100%' },
                            gridTemplateRows: 'auto 1fr auto',
                        }}
                    >
                        <Grid
                            container
                            display="flex"
                            justifyContent="center"
                            alignItems="center"
                            direction="column"
                            sx={{
                                minHeight: DEFAULT_BODY_HEIGHT,
                                backgroundColor: 'inherit',
                                px: { xs: 2, md: 4 },
                                pt: 4,
                                pb: 8,
                            }}
                        >
                            <LoginCard />
                        </Grid>
                    </Box>
                </Container>
            </CssVarsProvider>
        );
    }

    return (
        <CssVarsProvider disableTransitionOnChange>
            <CssBaseline />
            <Header title="Contribute a Knowledge Element" subtitle="Thanks for your contributions!" />
            <Container maxWidth="xl">
                <Box
                    component="main"
                    sx={{
                        minHeight: DEFAULT_BODY_HEIGHT,
                        display: 'grid',
                        gridTemplateColumns: { xs: 'auto', md: '100%' },
                        gridTemplateRows: 'auto 1fr auto',
                    }}
                >
                    <Grid
                        container
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                        direction="column"
                        sx={{
                            minHeight: DEFAULT_BODY_HEIGHT,
                            backgroundColor: 'inherit',
                            px: { xs: 2, md: 4 },
                            pt: 4,
                            pb: 8,
                        }}
                    >
                        <SubmissionCard submissionType="initial" elementType={elementType} />
                    </Grid>
                </Box>
            </Container>
        </CssVarsProvider>
    );
}