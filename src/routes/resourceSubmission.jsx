import React from 'react';

import { useOutletContext } from 'react-router-dom';

import { CssVarsProvider } from '@mui/joy/styles';
import CssBaseline from '@mui/joy/CssBaseline';
import Box from '@mui/joy/Box';
import Container from '@mui/joy/Container';
import Grid from '@mui/joy/Grid';

import Header from '../components/Layout/Header';
import LoginCard from '../components/LoginCard';

import SubmissionCard from '../components/SubmissionCard';

const ResourceSubmission = () => {
    const [isAuthenticated, setIsAuthenticated, userInfo, setUserInfo] = useOutletContext();

    // If the user is not authenticated/logged in, they will be redirected to the login page
    if (!isAuthenticated) {
        return (
            <CssVarsProvider disableTransitionOnChange>
                <CssBaseline />
                <Header title="Contribute a Knowledge Element" subtitle="Thanks for your contributions!" />
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
                            display="flex"
                            justifyContent="center"
                            alignItems="center"
                            direction="column"
                            sx={{
                                minHeight: 'calc(100vh - 420px)',
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
        )
    }

    return (
        <CssVarsProvider disableTransitionOnChange>
            <CssBaseline />
            <Header title="Contribute a Knowledge Element" subtitle="Thanks for your contributions!" />
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
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                        direction="column"
                        sx={{
                            minHeight: 'calc(100vh - 420px)',
                            backgroundColor: 'inherit',
                            px: { xs: 2, md: 4 },
                            pt: 4,
                            pb: 8,
                        }}
                    >
                        <SubmissionCard submissionType="initial" />
                    </Grid>
                </Box>
            </Container>
        </CssVarsProvider>
    )
}



export default ResourceSubmission;