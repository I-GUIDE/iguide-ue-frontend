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
import Button from '@mui/joy/Button';
import Box from '@mui/joy/Box';
import Grid from '@mui/joy/Grid';
import Container from '@mui/joy/Container';
import Stack from '@mui/joy/Stack';
import Card from '@mui/joy/Card';
import CardCover from '@mui/joy/CardCover';
import CardContent from '@mui/joy/CardContent';
import SearchIcon from '@mui/icons-material/Search';
import Typography from '@mui/joy/Typography';
import Select from '@mui/joy/Select';
import Option from '@mui/joy/Option';
import Chip from '@mui/joy/Chip';

import FeaturedCard from '../components/FeaturedCard';
import { featuredResourcesRetriever } from '../utils/DataRetrieval';
import { RESOURCE_TYPE_COLORS } from '../configs/ResourceTypes';

function Home() {
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
    const [error, setError] = useState(null);

    // When the state of hasSearched changed, check if hasSearched is false. If
    //   it is false, retrieve the featured resources.
    useEffect(() => {
        async function retrieveFeaturedResources() {
            try {
                const data = await featuredResourcesRetriever();
                setFeaturedResources(data);
            } catch (error) {
                setError(error);
            }
        }
        retrieveFeaturedResources();
    }, [])

    // Function that handles submit events. This function will update the search
    //   term and set hasSearched to true.
    const handleSubmit = async (event) => {
        // Use preventDefault here to prevent the submit event from happening
        //   because we need to set some states below.
        event.preventDefault();
        setSearchParams({ keyword: searchTerm, type: searchCategory });
        navigate(`/search-results?keyword=${encodeURIComponent(searchTerm)}&type=${searchCategory}`);
    };

    // // When there is an update on searchTerm (new search) or current starting
    // //   index (when users click another page), retrieve the search results
    // //   based on the current starting index.
    // useEffect(() => {
    //     async function retrieveSearchData(startingIdx) {
    //         try {
    //             const returnResults = await DataSearcher(searchTerm, searchCategory, 'prioritize_title_author', 'desc', startingIdx, itemsPerPage);
    //             const resourceCount = await getResourceCount(searchCategory, searchTerm);

    //             setNumberOfTotalItems(resourceCount);
    //             setNumberOfPages(Math.ceil(resourceCount / itemsPerPage));
    //             setSearchResults(returnResults);
    //             setSearchResultLength(arrayLength(returnResults));
    //         } catch (error) {
    //             setError(error);
    //         }
    //     }
    //     if (searchTerm && searchTerm !== '') {
    //         retrieveSearchData(currentStartingIdx);
    //     }
    // }, [currentStartingIdx, searchTerm, searchCategory])

    // When user select a different category in the search bar
    const handleSelectChange = (event, value) => {
        setSearchCategory(value);
    }

    return (
        <MaterialCssVarsProvider theme={{ [MATERIAL_THEME_ID]: materialTheme }}>
            <JoyCssVarsProvider>
                <CssBaseline enableColorScheme />
                <Box
                    sx={{ display: 'flex', flexWrap: 'wrap', p: 0, m: 0, height: 170 }}
                >
                    <Card component="li" sx={{ borderRadius: 0, minWidth: 300, flexGrow: 1 }}>
                        <CardCover>
                            <img
                                src="/images/yellow-blue.png"
                                srcSet="/images/yellow-blue.png 2x"
                                loading="lazy"
                                alt=""
                            />
                        </CardCover>
                        <CardContent sx={{ justifyContent: 'center', alignItems: 'center' }}>
                            <Container maxWidth="md">
                                <Typography
                                    level="h1"
                                    textColor={'#fff'}
                                    sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', pb: 2 }}
                                    endDecorator={
                                        <Chip component="span" size="sm">
                                            BETA
                                        </Chip>
                                    }
                                >
                                    I-GUIDE Platform
                                </Typography>
                                <form onSubmit={handleSubmit} id="demo">
                                    <Input
                                        key="search"
                                        variant="plain"
                                        color={RESOURCE_TYPE_COLORS[searchCategory]}
                                        sx={{ '--Input-decoratorChildHeight': '45px' }}
                                        placeholder="Search..."
                                        type="text"
                                        required
                                        value={searchTerm}
                                        onChange={(event) => {
                                            setData({ content: event.target.value, status: 'initial' })
                                            setSearchTerm(event.target.value)
                                        }}
                                        error={data.status === 'failure'}
                                        startDecorator={
                                            <Select
                                                defaultValue="any"
                                                value={searchCategory}
                                                variant="plain"
                                                color={RESOURCE_TYPE_COLORS[searchCategory]}
                                                onChange={handleSelectChange}
                                            >
                                                <Option value="any">All Elements</Option>
                                                <Option value="dataset">Dataset</Option>
                                                <Option value="notebook">Notebook</Option>
                                                <Option value="publication">Publication</Option>
                                                <Option value="oer">Educational Resource</Option>
                                            </Select>
                                        }
                                        endDecorator={
                                            <Button
                                                variant="plain"
                                                color={RESOURCE_TYPE_COLORS[searchCategory]}
                                                loading={data.status === 'loading'}
                                                type="submit"
                                                sx={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}
                                            >
                                                <SearchIcon />
                                            </Button>
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
                            </Container>
                        </CardContent>
                    </Card>
                </Box>
                <Container maxWidth="xl">
                    <Box
                        component="main"
                        sx={{
                            minHeight: 'calc(100vh - 395px)', // 450px is the combined height of the NavBar, search bar, and footer
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
                                borderBottom: '1px solid',
                                borderColor: 'divider',
                            }}
                        >
                            <Typography
                                level="h3"
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
                                            thumbnailImage={dataset['thumbnail-image']}
                                        />
                                    </Grid>
                                ))}
                            </Grid>
                        </Grid>
                    </Box>
                </Container>
            </JoyCssVarsProvider>
        </MaterialCssVarsProvider>
    )
}

export default Home;