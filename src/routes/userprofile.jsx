import React from 'react';

import { CssVarsProvider } from '@mui/joy/styles';
import CssBaseline from '@mui/joy/CssBaseline';
import AspectRatio from '@mui/joy/AspectRatio';
import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import Card from '@mui/joy/Card';
import CardContent from '@mui/joy/CardContent';
import Typography from '@mui/joy/Typography';
import Sheet from '@mui/joy/Sheet';
import Container from '@mui/joy/Container';

import UserCard from '../components/UserCard';
import Header from '../components/Layout/Header';

const UserProfile = () => {
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
                    <UserCard />
                </Box>
            </Container>
        </CssVarsProvider>
    )
}

export default UserProfile;