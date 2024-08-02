import * as React from 'react';

import Typography from '@mui/joy/Typography';
import Container from '@mui/joy/Container';
import Box from '@mui/joy/Box';
import Card from '@mui/joy/Card';
import Grid from '@mui/joy/Grid';
import Stack from '@mui/joy/Stack';
import Link from '@mui/joy/Link';
import CardContent from '@mui/joy/CardContent';

import { grey } from '@mui/material/colors';
import XIcon from '@mui/icons-material/X';
import YouTubeIcon from '@mui/icons-material/YouTube';
import LinkedInIcon from '@mui/icons-material/LinkedIn';

export default function Footer() {
    return (
        <Box
            sx={{ display: 'flex', flexWrap: 'wrap', p: 0, m: 0, minHeight: 130 }}
        >
            <Card component="li" color="neutural" sx={{ borderRadius: 0, minWidth: 600, flexGrow: 1 }}>
                <CardContent sx={{ justifyContent: 'center' }}>
                    <Container maxWidth="xl">
                        <Grid container spacing={1}>
                            <Stack
                                direction="row"
                                justifyContent="center"
                                alignItems="center"
                                spacing={2}
                            >
                                <Grid xs={1}>
                                    <Box sx={{ width: 'flex' }}>
                                        <Link href={'https://www.nsf.gov/'} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                                            <Box
                                                component="img"
                                                sx={{ height: 75, mx: 2 }}
                                                alt="Logo"
                                                src="/images/nsf.png"
                                            />
                                        </Link>
                                    </Box>
                                </Grid>
                                <Grid xs={4}>
                                    <Typography level="h5" textColor="#606060" sx={{ py: 1 }}>
                                        © {new Date().getFullYear()} I-GUIDE All Rights Reserved.
                                    </Typography>
                                    <Typography level="body-xs" textColor="#606060" sx={{ py: 1 }}>
                                        Institute for Geospatial Understanding through an Integrative Discovery Environment (I-GUIDE)
                                        is supported by the National Science Foundation.
                                    </Typography>
                                </Grid>
                                <Grid xs={5}>
                                    <Typography level="body-xs" textColor="#606060" sx={{ py: 1 }}>
                                        This material is based upon work supported by the National Science Foundation under award No. 2118329. Any opinions, findings, conclusions, or recommendations expressed in this material are those of the author(s) and do not necessarily reflect the views of the National Science Foundation.
                                    </Typography>
                                </Grid>
                                <Grid xs={2}>
                                    <Stack
                                        direction="row"
                                        justifyContent="flex-start"
                                        alignItems="center"
                                        spacing={1}
                                        sx={{ display: 'flex' }}
                                    >
                                        <Box sx={{ width: 'flex', px: 0.5 }}>
                                            <Link href={'https://www.youtube.com/@nsf-iguide'} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                                                <YouTubeIcon sx={{ color: grey[700] }} />
                                            </Link>
                                        </Box>
                                        <Box sx={{ width: 'flex', px: 0.5 }}>
                                            <Link href={'https://x.com/NSFiGUIDE'} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                                                <XIcon sx={{ color: grey[700] }} />
                                            </Link>
                                        </Box>
                                        <Box sx={{ width: 'flex', px: 0.5 }}>
                                            <Link href={'https://www.linkedin.com/company/nsf-i-guide/'} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                                                <LinkedInIcon sx={{ color: grey[700] }} />
                                            </Link>
                                        </Box>
                                    </Stack>
                                </Grid>
                            </Stack>
                        </Grid>
                    </Container>
                </CardContent>
            </Card>
        </Box>
    );
}
