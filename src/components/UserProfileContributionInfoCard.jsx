import React, { useState, useEffect } from 'react';

import { useOutletContext } from 'react-router-dom';

import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import Card from '@mui/joy/Card';
import CardContent from '@mui/joy/CardContent';
import Typography from '@mui/joy/Typography';
import Sheet from '@mui/joy/Sheet';
import Stack from '@mui/joy/Stack';

import '../utils/UserManager';

export default function UserProfileContributionInfoCard(props) {
    const numberOfContributions = props.numberOfContributions;
    const [isAuthenticated, setIsAuthenticated, userInfo, setUserInfo, localUserInfo, setLocalUserInfo] = useOutletContext();

    // If the user info from the local DB is still not available, wait...
    if (!localUserInfo) {
        return;
    }

    return (
        <Box
            sx={{
                width: '50%',
                position: 'relative',
                overflow: { xs: 'auto', sm: 'initial' },
            }}
        >
            <Card
                variant="outlined"
                orientation="horizontal"
                sx={{
                    width: "100%",
                    '&:hover': { boxShadow: 'md', borderColor: 'neutral.outlinedHoverBorder' },
                }}
            >
                <CardContent>
                    <Stack direction="column" spacing={2} alignItems="center">
                        <Typography level="h3" fontWeight="lg">
                            Would you like to make a new knowledge contribution?
                        </Typography>
                        <Button component="a" href="/resource_submission" variant="outlined" color="primary">
                            New Contribution
                        </Button>
                    </Stack>
                </CardContent>
            </Card>
        </Box>
    )
}