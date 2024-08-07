import React, { useState, useEffect } from 'react';

import {
    experimental_extendTheme as materialExtendTheme,
    Experimental_CssVarsProvider as MaterialCssVarsProvider,
    THEME_ID as MATERIAL_THEME_ID,
} from '@mui/material/styles';
import { CssVarsProvider as JoyCssVarsProvider } from '@mui/joy/styles';
import CssBaseline from '@mui/material/CssBaseline';
const materialTheme = materialExtendTheme();

import Box from '@mui/joy/Box';
import Grid from '@mui/joy/Grid';
import Container from '@mui/joy/Container';
import Card from '@mui/joy/Card';
import CardCover from '@mui/joy/CardCover';
import CardContent from '@mui/joy/CardContent';
import Typography from '@mui/joy/Typography';
import Chip from '@mui/joy/Chip';

import FeaturedCard from '../components/FeaturedCard';
import SearchBar from '../components/SearchBar';
import { featuredResourcesRetriever } from '../utils/DataRetrieval';
import { HOME_BODY_HEIGHT } from '../configs/ResourceTypes';

export default function Home() {
    const [featuredResources, setFeaturedResources] = useState([]);
    const [hasFeaturedResources, setHasFeaturedResources] = useState(false);

    const [error, setError] = useState(null);

    // When the state of hasSearched changed, check if hasSearched is false. If
    //   it is false, retrieve the featured resources.
    useEffect(() => {
        async function retrieveFeaturedResources() {
            try {
                const data = await featuredResourcesRetriever();
                setFeaturedResources(data);
                if (data.length > 0) {
                    setHasFeaturedResources(true);
                } else {
                    setHasFeaturedResources(false);
                }
            } catch (error) {
                setError(error);
                setHasFeaturedResources(false);
            }
        }
        retrieveFeaturedResources();
    }, [])

    return (
        <MaterialCssVarsProvider theme={{ [MATERIAL_THEME_ID]: materialTheme }}>
            <JoyCssVarsProvider>
                <CssBaseline enableColorScheme />
                <Box
                    component="main"
                    sx={{
                        minHeight: HOME_BODY_HEIGHT,
                        display: 'grid',
                        gridTemplateColumns: { xs: 'auto', md: '100%' },
                        gridTemplateRows: 'auto 1fr auto',
                    }}
                >
                    <Card component="li" sx={{ borderRadius: 0, minWidth: 300, flexGrow: 1 }}>
                        <CardCover sx={{ minHeight: HOME_BODY_HEIGHT }}>
                            <img
                                src="/images/earth-and-space.png"
                                loading="lazy"
                                alt="Earth with lights and dark space"
                            />
                        </CardCover>
                        <CardContent
                            sx={{
                                justifyContent: 'center',
                                alignItems: 'center',
                                minHeight: HOME_BODY_HEIGHT
                            }}
                        >
                            <Container maxWidth="lg">
                                <Container
                                    alignItems="center"
                                    justifyContent="center"
                                    maxWidth="md"
                                >
                                    <Box
                                        component="main"
                                        sx={{
                                            height: '25%',
                                            display: 'grid',
                                            gridTemplateColumns: { xs: 'auto', md: '100%' },
                                            gridTemplateRows: 'auto 1fr auto',
                                        }}
                                    >
                                        <Typography
                                            level="h1"
                                            textColor={'#fff'}
                                            sx={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-start', pt: 4, pb: 0.5 }}
                                            endDecorator={
                                                <Chip component="span" size="sm">
                                                    BETA
                                                </Chip>
                                            }
                                            justifyContent="center"
                                        >
                                            I-GUIDE Platform
                                        </Typography>
                                        <Typography
                                            level="title-md"
                                            textColor={'#FCF5E5'}
                                            sx={{ display: 'flex', flexDirection: 'row', pt: 0.5, pb: 4 }}
                                            justifyContent="center"
                                        >
                                            Harnessing the Geospatial Data Revolution to Empower Convergence Science
                                        </Typography>
                                        <SearchBar />
                                    </Box>
                                </Container>

                                {hasFeaturedResources &&
                                    <Box
                                        component="main"
                                        sx={{
                                            height: '75%',
                                            display: 'grid',
                                            gridTemplateColumns: { xs: 'auto', md: '100%' },
                                            gridTemplateRows: 'auto 1fr auto',
                                        }}
                                    >
                                        <Grid
                                            container
                                            justifyContent="center"
                                            sx={{
                                                backgroundColor: 'inherit',
                                                px: 1,
                                                py: 4,
                                            }}
                                        >
                                            <Typography
                                                level="h3"
                                                textColor={'#fff'}
                                                sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', p: 2 }}
                                            >
                                                Highlights
                                            </Typography>
                                            <Grid
                                                container
                                                direction="row"
                                                xs={12}
                                            >
                                                {featuredResources?.map((dataset) => (
                                                    <Grid
                                                        container
                                                        key={dataset._id}
                                                        xs={12}
                                                        sm={6}
                                                        md={3}
                                                        direction="row"
                                                        justifyContent="center"
                                                        alignItems="flex-start"
                                                        sx={{ p: 4 }}
                                                    >
                                                        <FeaturedCard
                                                            key={dataset._id}
                                                            cardtype={dataset['resource-type'] + 's'}
                                                            pageid={dataset._id}
                                                            title={dataset.title}
                                                            authors={dataset.authors}
                                                            contents={dataset.contents}
                                                            thumbnailImage={dataset['thumbnail-image']}
                                                        />
                                                    </Grid>
                                                ))}
                                            </Grid>
                                        </Grid>
                                    </Box>
                                }
                            </Container>
                        </CardContent>
                    </Card>
                </Box>
            </JoyCssVarsProvider>
        </MaterialCssVarsProvider>
    )
}