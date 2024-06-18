import * as React from 'react';

import Typography from '@mui/joy/Typography';
import Container from '@mui/joy/Container';
import Box from '@mui/joy/Box';
import Card from '@mui/joy/Card';
import Grid from '@mui/joy/Grid';
import Stack from '@mui/joy/Stack';
import Link from '@mui/joy/Link';
import CardCover from '@mui/joy/CardCover';
import CardContent from '@mui/joy/CardContent';

import { blue } from '@mui/material/colors';
import XIcon from '@mui/icons-material/X';
import YouTubeIcon from '@mui/icons-material/YouTube';
import LinkedInIcon from '@mui/icons-material/LinkedIn';

export default function Footer() {
    return (
        <Box
            sx={{ display: 'flex', flexWrap: 'wrap', p: 0, m: 0, minHeight: 200 }}
        >
            <Card component="li" sx={{ borderRadius: 0, minWidth: 300, flexGrow: 1 }}>
                <CardCover>
                    <img
                        src="/images/green-blue.png"
                        srcSet="/images/green-blue.png 2x"
                        loading="lazy"
                        alt=""
                    />
                </CardCover>
                <CardContent sx={{ justifyContent: 'center' }}>
                    <Container maxWidth="lg">
                        <Grid container spacing={1}>
                            <Stack
                                direction="row"
                                justifyContent="center"
                                alignItems="center"
                                spacing={2}
                            >
                                <Grid xs={2}>
                                    <Box sx={{ width: 'flex' }}>
                                        <Box
                                            component="img"
                                            sx={{ height: 50, mx: 2 }}
                                            alt="Logo"
                                            src="/images/nsf.png"
                                        />
                                    </Box>
                                </Grid>
                                <Grid xs={8}>
                                    <Typography level="h5" textColor="#fff" sx={{ py: 1 }}>
                                        © {new Date().getFullYear()} I-GUIDE All Rights Reserved.
                                    </Typography>
                                    <Typography level="body-xs" textColor="#fff" sx={{ py: 1 }}>
                                        Institute for Geospatial Understanding through an Integrative Discovery Environment (I-GUIDE)
                                        is supported by the National Science Foundation.
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
                                            <Link href={'https://www.youtube.com/@nsf-iguide'} target="_blank" style={{ textDecoration: 'none' }}>
                                                <YouTubeIcon sx={{ color: blue[50] }} />
                                            </Link>
                                        </Box>
                                        <Box sx={{ width: 'flex', px: 0.5 }}>
                                            <Link href={'https://x.com/NSFiGUIDE'} target="_blank" style={{ textDecoration: 'none' }}>
                                                <XIcon sx={{ color: blue[50] }} />
                                            </Link>
                                        </Box>
                                        <Box sx={{ width: 'flex', px: 0.5 }}>
                                            <Link href={'https://www.linkedin.com/company/nsf-i-guide/'} target="_blank" style={{ textDecoration: 'none' }}>
                                                <LinkedInIcon sx={{ color: blue[50] }} />
                                            </Link>
                                        </Box>
                                    </Stack>
                                </Grid>
                            </Stack>
                            <Stack
                                direction="row"
                                justifyContent="center"
                                alignItems="center"
                                spacing={2}
                            >
                                <Grid xs={12} md={9}>
                                    <Typography level="body-xs" textColor="#fff" sx={{ py: 1 }}>
                                        This material is based upon work supported by the National Science Foundation under award No. 2118329. Any opinions, findings, conclusions, or recommendations expressed in this material are those of the author(s) and do not necessarily reflect the views of the National Science Foundation.
                                    </Typography>
                                </Grid>
                            </Stack>
                        </Grid>
                    </Container>
                </CardContent>
            </Card>
        </Box>
    );
}
