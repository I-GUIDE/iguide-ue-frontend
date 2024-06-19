import React, { useState, useEffect } from 'react';

import { CssVarsProvider } from '@mui/joy/styles';
import CssBaseline from '@mui/joy/CssBaseline';

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

import InfoCard from '../components/InfoCard';
import FeaturedCard from '../components/FeaturedCard';
import { DataSearcher, featuredResourcesRetriever } from '../utils/DataRetrieval';
import { arrayLength } from '../helpers/helper';

const Home = () => {
    // define search data
    const [data, setData] = useState({
        content: '',
        status: 'initial',
    });

    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [hasSearched, setHasSearched] = useState(false);
    const [searchResultLength, setSearchResultLength] = useState(null);

    const [featuredResources, setFeaturedResources] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function retrieveFeaturedData() {
            try {
                const data = await featuredResourcesRetriever();
                setFeaturedResources(data);
            } catch (error) {
                setError(error);
            }
        }
        retrieveFeaturedData();
    }, [])

    // Function that handles submit event... need more implementation
    const handleSubmit = async (event) => {
        event.preventDefault();
        setData((current) => ({ ...current, status: 'loading' }));
        setSearchTerm(data['content']);
        const returnResults = await DataSearcher(data['content']);
        setSearchResults(returnResults);
        setHasSearched(true);
        setSearchResultLength(arrayLength(returnResults));

        try {
            // Replace timeout with real backend operation
            setTimeout(() => {
                setData({ content: '', status: 'sent' });
            }, 100);
        } catch (error) {
            setData((current) => ({ ...current, status: 'failure' }));
        }
    };

    return (
        <CssVarsProvider disableTransitionOnChange>
            <CssBaseline />
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
                            >
                                I-GUIDE Platform
                            </Typography>
                            <form onSubmit={handleSubmit} id="demo">
                                <FormControl>
                                    <Input
                                        sx={{ '--Input-decoratorChildHeight': '45px' }}
                                        placeholder="Search..."
                                        type="text"
                                        required
                                        value={data.content}
                                        onChange={(event) =>
                                            setData({ content: event.target.value, status: 'initial' })
                                        }
                                        error={data.status === 'failure'}
                                        endDecorator={
                                            <Button
                                                variant="plain"
                                                loading={data.status === 'loading'}
                                                type="submit"
                                                sx={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}
                                            >
                                                <SearchIcon />
                                            </Button>
                                        }
                                    />
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
            {!hasSearched
                // By default, users should see the featured resources
                ? <Container maxWidth="xl">
                    <Box
                        component="main"
                        sx={{
                            minHeight: 'calc(100vh - 440px)', // 440px is the combined height of the NavBar, search bar, and footer
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
                                        key={dataset.id}
                                        xs={12}
                                        sm={6}
                                        md={3}
                                        direction="row"
                                        justifyContent="center"
                                        alignItems="flex-start"
                                        sx={{ p: 4 }}
                                    >
                                        <FeaturedCard
                                            key={dataset.id}
                                            cardtype={dataset['resource-type'] + 's'}
                                            pageid={dataset.id}
                                            title={dataset.title}
                                            authors={dataset.authors}
                                            thumbnailImage={dataset['thumbnail-image']} />
                                    </Grid>
                                ))}
                            </Grid>
                        </Grid>
                    </Box>
                </Container>
                // When there is a search action, shows the returned results
                : <Container maxWidth="xl">
                    <Box
                        component="main"
                        sx={{
                            minHeight: 'calc(100vh - 440px)', // 440px is the height of the NavBar, search bar, and footer
                            display: 'grid',
                            gridTemplateColumns: { xs: 'auto', md: '100%' },
                            gridTemplateRows: 'auto 1fr auto',
                        }}
                    >
                        <Grid
                            container
                            rowSpacing={2}
                            columnSpacing={{ xs: 1, sm: 2, md: 3 }}
                            sx={{
                                backgroundColor: 'inherit',
                                px: { xs: 2, md: 4 },
                                pt: 4,
                                pb: 8,
                                borderBottom: '1px solid',
                                borderColor: 'divider',
                            }}
                        > <Grid xs={12}>
                                <Stack spacing={2} sx={{ px: { xs: 2, md: 4 }, pt: 2, minHeight: 0 }}>
                                    {/* Search result summary and "clear search button" */}
                                    <Stack
                                        direction="row"
                                        justifyContent="space-between"
                                        alignItems="center"
                                        spacing={2}
                                    >
                                        {
                                            searchResultLength > 1
                                                ? <Typography>
                                                    Searched "{searchTerm}", returned {searchResultLength} results
                                                </Typography>
                                                : <Typography>
                                                    Searched "{searchTerm}", returned {searchResultLength} result
                                                </Typography>
                                        }
                                        <Box
                                            direction="row"
                                            justifyContent="flex-start"
                                            alignItems="flex-end"
                                            spacing={1}
                                        >
                                            {
                                                searchResultLength > 0
                                                    ? <Button key="clear-search" size="sm" variant='outlined' onClick={() => setHasSearched(false)}>
                                                        Clear Search
                                                    </Button>
                                                    : <Button key="clear-search" size="sm" variant='outlined' onClick={() => setHasSearched(false)}>
                                                        Try Again
                                                    </Button>
                                            }
                                        </Box>
                                    </Stack>

                                    {/* Search result list */}
                                    {searchResults?.map((result) => (
                                        <InfoCard
                                            key={result.id}
                                            cardtype={result['resource-type'] + 's'}
                                            pageid={result.id}
                                            title={result.title}
                                            authors={result.authors}
                                            tags={result.tags}
                                            contents={result.contents}
                                            thumbnailImage={result['thumbnail-image']} />
                                    ))}
                                </Stack>
                            </Grid>
                        </Grid>
                    </Box>
                </Container>
            }
        </CssVarsProvider>
    )
}

export default Home;