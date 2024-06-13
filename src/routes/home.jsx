import React, { useState } from 'react';
import { StyledEngineProvider } from '@mui/material/styles';

import { CssVarsProvider } from '@mui/joy/styles';
import CssBaseline from '@mui/joy/CssBaseline';

import FormControl from '@mui/joy/FormControl';
import FormHelperText from '@mui/joy/FormHelperText';
import Input from '@mui/joy/Input';
import Button from '@mui/joy/Button';
import Box from '@mui/joy/Box';
import Grid from '@mui/joy/Grid';
import Container from '@mui/joy/Container';

const Home = () => {
    // define search data
    const [data, setData] = useState({
        content: '',
        status: 'initial',
    });

    // Function that handles searching keyword, return the results
    async function search(keyword) {
        console.log("keyword", keyword)
        const response = await fetch('http://149.165.169.173:5000/search', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ keyword }),
        });

        if (!response.ok) {
            console.error('Error with search request:', response.statusText);
            return;
        }

        const results = await response.json();
        console.log('Search results:', results);

        const resultsDiv = document.getElementById('results');
        resultsDiv.innerHTML = '';

        if (!Array.isArray(results)) {
            console.error('Results is not an array:', results);
            resultsDiv.innerHTML = '<p>Error retrieving results</p>';
            return;
        }

        if (results.length === 0) {
            resultsDiv.innerHTML = '<p>No results found</p>';
        } else {
            results.forEach(result => {
                const resultDiv = document.createElement('div');
                resultDiv.className = 'result';
                resultDiv.innerHTML = `
              <h2>${result.title}</h2>
              <p>${result.contents}</p>
              <p><strong>Tags:</strong> ${result.tags.join(', ')}</p>
            `;
                resultsDiv.appendChild(resultDiv);
            });
        }
    }

    // Function that handles submit event... need more implementation
    const handleSubmit = (event) => {
        event.preventDefault();
        setData((current) => ({ ...current, status: 'loading' }));
        search(data['content'])
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
            <Container maxWidth="xl">
                <Box
                    component="main"
                    sx={{
                        height: 'calc(100vh - 55px)', // 55px is the height of the NavBar
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
                            py: 2,
                            borderBottom: '1px solid',
                            borderColor: 'divider',
                        }}
                    >
                        <Grid xs={12}>
                            <form onSubmit={handleSubmit} id="demo">
                                <FormControl>
                                    <Input
                                        sx={{ '--Input-decoratorChildHeight': '45px' }}
                                        placeholder="Search here"
                                        type="text"
                                        required
                                        value={data.content}
                                        onChange={(event) =>
                                            setData({ content: event.target.value, status: 'initial' })
                                        }
                                        error={data.status === 'failure'}
                                        endDecorator={
                                            <Button
                                                variant="solid"
                                                color="primary"
                                                loading={data.status === 'loading'}
                                                type="submit"
                                                sx={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}
                                            >
                                                Search
                                            </Button>
                                        }
                                    />
                                    {data.status === 'failure' && (
                                        <FormHelperText
                                            sx={(theme) => ({ color: theme.vars.palette.danger[400] })}
                                        >
                                            Oops! something went wrong, please try again later.
                                        </FormHelperText>
                                    )}

                                    {data.status === 'sent' && (
                                        <FormHelperText
                                            sx={(theme) => ({ color: theme.vars.palette.primary[400] })}
                                        >
                                            You are all set!
                                        </FormHelperText>
                                    )}
                                </FormControl>
                            </form>

                            <div id="results"></div>
                        </Grid>
                    </Grid>
                </Box>
            </Container>
        </CssVarsProvider>
    )
}

export default Home;