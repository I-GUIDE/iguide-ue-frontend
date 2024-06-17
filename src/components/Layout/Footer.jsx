import * as React from 'react';

import Typography from '@mui/joy/Typography';
import Container from '@mui/joy/Container';
import Box from '@mui/joy/Box';
import Card from '@mui/joy/Card';
import Grid from '@mui/joy/Grid';
import CardCover from '@mui/joy/CardCover';
import CardContent from '@mui/joy/CardContent';

export default function Footer(props) {
    return (
        <Box
            sx={{ display: 'flex', flexWrap: 'wrap', p: 0, m: 0 }}
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
                <CardContent>
                    <Container maxWidth="xl">
                        <Grid container spacing={1} sx={{ flexGrow: 1 }}>
                            <Grid xs={4} md={2}>
                                <Box sx={{ width: 'flex' }}>
                                    <Box
                                        component="img"
                                        sx={{ height: 70, mx: 2 }}
                                        alt="Logo"
                                        src="/images/nsf.png"
                                    />
                                </Box>
                            </Grid>
                            <Grid xs={8} md={5}>
                                <Typography level="h3" textColor="#fff" sx={{ py: 1 }}>
                                    I-GUIDE All right reserved
                                </Typography>
                                <Typography level="body-xs" textColor="#fff" sx={{ py: 1 }}>
                                    Institute for Geospatial Understanding through an Integrative Discovery Environment (I-GUIDE) is supported by the National Science Foundation
                                </Typography>
                            </Grid>
                            <Grid xs={12} md={5}>
                                <Typography level="body-xs" textColor="#fff" sx={{ py: 1 }}>
                                    This material is based upon work supported by the National Science Foundation under award No. 2118329. Any opinions, findings, conclusions, or recommendations expressed in this material are those of the author(s) and do not necessarily reflect the views of the National Science Foundation.
                                </Typography>
                            </Grid>
                        </Grid>
                    </Container>
                </CardContent>
            </Card>
        </Box>
    );
}
