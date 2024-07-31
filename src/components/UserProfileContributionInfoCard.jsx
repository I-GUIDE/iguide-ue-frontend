import React, { useState, useEffect } from 'react';

import { useOutletContext } from 'react-router-dom';

import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import Card from '@mui/joy/Card';
import CardContent from '@mui/joy/CardContent';
import Typography from '@mui/joy/Typography';
import Sheet from '@mui/joy/Sheet';
import Stack from '@mui/joy/Stack';

import { RESOURCE_TYPE_COLORS } from '../configs/ResourceTypes';

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
                width: '60%',
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
                    <Stack direction="column" spacing={3} alignItems="center">
                        <Typography level="h3" fontWeight="lg">
                            Would you like to make a new knowledge contribution?
                        </Typography>
                        <Stack direction="row" spacing={2} alignItems="center">
                            <Button component="a" href="/contribution/dataset" variant="outlined" color={RESOURCE_TYPE_COLORS["dataset"]}>
                                New Dataset
                            </Button>
                            <Button component="a" href="/contribution/notebook" variant="outlined" color={RESOURCE_TYPE_COLORS["notebook"]}>
                                New Notebook
                            </Button>
                            <Button component="a" href="/contribution/publication" variant="outlined" color={RESOURCE_TYPE_COLORS["publication"]}>
                                New Publication
                            </Button>
                            <Button component="a" href="/contribution/oer" variant="outlined" color={RESOURCE_TYPE_COLORS["oer"]}>
                                New Educational Resource
                            </Button>
                        </Stack>
                    </Stack>
                </CardContent>
            </Card>
        </Box>
    )
}