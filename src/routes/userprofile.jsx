import React from 'react';

import { useOutletContext } from 'react-router-dom';

import { CssVarsProvider } from '@mui/joy/styles';
import CssBaseline from '@mui/joy/CssBaseline';
import Box from '@mui/joy/Box';
import Container from '@mui/joy/Container';
import Stack from '@mui/joy/Stack';
import Grid from '@mui/joy/Grid';

import UserCard from '../components/UserCard';
import Header from '../components/Layout/Header';
import LoginCard from '../components/LoginCard';

const UserProfile = () => {
    // OutletContext retrieving the user object to display user info
    const [isAuthenticated, setIsAuthenticated, userInfo, setUserInfo] = useOutletContext();

    return (
        <CssVarsProvider disableTransitionOnChange>
            <CssBaseline />
            <Header title="User Profile" subtitle="Who are you?" />
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
                        <Stack
                            direction="row"
                            justifyContent="center"
                            alignItems="center"
                            spacing={2}
                        >
                            {isAuthenticated ? <UserCard userInfo={userInfo} /> : <LoginCard />}
                        </Stack>
                    </Grid>
                </Box>
            </Container>
        </CssVarsProvider>
    )
}

export default UserProfile;