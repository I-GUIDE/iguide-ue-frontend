import React from 'react';

import { useOutletContext } from 'react-router-dom';

import { CssVarsProvider } from '@mui/joy/styles';
import CssBaseline from '@mui/joy/CssBaseline';
import Box from '@mui/joy/Box';
import Container from '@mui/joy/Container';

import UserCard from '../components/UserCard';
import Header from '../components/Layout/Header';

const UserProfile = () => {
    // OutletContext retrieving the user object to display user info
    const [user, setUser] = useOutletContext();

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
                    <UserCard user={user}/>
                </Box>
            </Container>
        </CssVarsProvider>
    )
}

export default UserProfile;