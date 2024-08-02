import React, { useState, useEffect } from 'react';

import { useOutletContext } from 'react-router-dom';

import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import Card from '@mui/joy/Card';
import CardContent from '@mui/joy/CardContent';
import Typography from '@mui/joy/Typography';
import Sheet from '@mui/joy/Sheet';
import Stack from '@mui/joy/Stack';
import Grid from '@mui/joy/Grid';

import { RESOURCE_TYPE_COLORS } from '../configs/ResourceTypes';

import '../utils/UserManager';

export default function UserProfileContributionInfoCard(props) {
    const [isAuthenticated, setIsAuthenticated, userInfo, setUserInfo, localUserInfo, setLocalUserInfo] = useOutletContext();

    // If the user info from the local DB is still not available, wait...
    if (!localUserInfo) {
        return;
    }

    return (
        <Box
            sx={{
                maxWidth: 1000,
                width: '50%',
                position: 'relative',
                overflow: 'auto',
                display: 'flex'
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
                    <Grid
                        container
                        spacing={2}
                    >
                        <Grid
                            xs={12}
                            justifyContent="center"
                            alignItems="center"
                            display="flex"
                        >
                            <Typography level="title-lg">
                                Would you like to make a new knowledge contribution?
                            </Typography>
                        </Grid>
                        <Grid
                            xs={12}
                            md={6}
                            justifyContent="center"
                            alignItems="center"
                            display="flex"
                        >
                            <Button component="a" href="/contribution/dataset" variant="outlined" color={RESOURCE_TYPE_COLORS["dataset"]}>
                                New Dataset
                            </Button>
                        </Grid>
                        <Grid
                            xs={12}
                            md={6}
                            justifyContent="center"
                            alignItems="center"
                            display="flex"
                        >
                            <Button component="a" href="/contribution/notebook" variant="outlined" color={RESOURCE_TYPE_COLORS["notebook"]}>
                                New Notebook
                            </Button>
                        </Grid>
                        <Grid
                            xs={12}
                            md={6}
                            justifyContent="center"
                            alignItems="center"
                            display="flex"
                        >
                            <Button component="a" href="/contribution/publication" variant="outlined" color={RESOURCE_TYPE_COLORS["publication"]}>
                                New Publication
                            </Button>
                        </Grid>
                        <Grid
                            xs={12}
                            md={6}
                            justifyContent="center"
                            alignItems="center"
                            display="flex"
                        >
                            <Button component="a" href="/contribution/oer" variant="outlined" color={RESOURCE_TYPE_COLORS["oer"]}>
                                New Educational Resource
                            </Button>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
        </Box>
    )
}