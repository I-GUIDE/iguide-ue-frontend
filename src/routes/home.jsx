import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from "react-router-dom";

import {
    experimental_extendTheme as materialExtendTheme,
    Experimental_CssVarsProvider as MaterialCssVarsProvider,
    THEME_ID as MATERIAL_THEME_ID,
} from '@mui/material/styles';
import { CssVarsProvider as JoyCssVarsProvider } from '@mui/joy/styles';
import CssBaseline from '@mui/material/CssBaseline';
const materialTheme = materialExtendTheme();

import FormControl from '@mui/joy/FormControl';
import FormHelperText from '@mui/joy/FormHelperText';
import Input from '@mui/joy/Input';
import IconButton from '@mui/joy/IconButton';
import Box from '@mui/joy/Box';
import Grid from '@mui/joy/Grid';
import Container from '@mui/joy/Container';
import Card from '@mui/joy/Card';
import CardCover from '@mui/joy/CardCover';
import CardContent from '@mui/joy/CardContent';
import SearchIcon from '@mui/icons-material/Search';
import Typography from '@mui/joy/Typography';
import Chip from '@mui/joy/Chip';

import FeaturedCard from '../components/FeaturedCard';
import { featuredResourcesRetriever } from '../utils/DataRetrieval';
import { HOME_BODY_HEIGHT } from '../configs/ResourceTypes';

export default function Home() {
    // define search data
    const [data, setData] = useState({
        content: '',
        status: 'initial',
    });

    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();

    // the term that will be immediately passed to the database for search
    const [searchTerm, setSearchTerm] = useState('');
    // the search will only return results from given category if it's not 'any'
    const [searchCategory, setSearchCategory] = useState('any');

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

    // Function that handles submit events. This function will update the search
    //   term and set hasSearched to true.
    async function handleSubmit(event) {
        // Use preventDefault here to prevent the submit event from happening
        //   because we need to set some states below.
        event.preventDefault();
        setSearchParams({ keyword: searchTerm, type: searchCategory });
        navigate(`/search-results?keyword=${encodeURIComponent(searchTerm)}&type=${searchCategory}`);
    }

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
                                    alignContent="center"
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
                                            sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 5 }}
                                            endDecorator={
                                                <Chip component="span" size="sm">
                                                    BETA
                                                </Chip>
                                            }
                                        >
                                            I-GUIDE Platform
                                        </Typography>
                                        <form onSubmit={handleSubmit} id="iguide-search-form">
                                            <Input
                                                key="iguide-search-homepage"
                                                required
                                                variant="plain"
                                                sx={{ '--Input-decoratorChildHeight': '50px' }}
                                                placeholder="Search..."
                                                type="text"
                                                value={searchTerm}
                                                onChange={(event) => {
                                                    setData({ content: event.target.value, status: 'initial' })
                                                    setSearchTerm(event.target.value)
                                                }}
                                                error={data.status === 'failure'}
                                                endDecorator={
                                                    <IconButton
                                                        size='lg'
                                                        variant="plain"
                                                        loading={data.status === 'loading'}
                                                        type="submit"
                                                        sx={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}
                                                    >
                                                        <SearchIcon />
                                                    </IconButton>
                                                }
                                            />
                                            <FormControl>
                                                {data.status === 'failure' && (
                                                    <FormHelperText
                                                        sx={(theme) => ({ color: theme.vars.palette.danger[400] })}
                                                    >
                                                        Oops! Something went wrong, please try again later.
                                                    </FormHelperText>
                                                )}
                                            </FormControl>
                                        </form>
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