import React, { useState, useEffect } from 'react';

import Stack from '@mui/joy/Stack';
import { CssVarsProvider } from '@mui/joy/styles';
import CssBaseline from '@mui/joy/CssBaseline';
import Box from '@mui/joy/Box';
import Grid from '@mui/joy/Grid';
import Container from '@mui/joy/Container';
import Typography from '@mui/joy/Typography';

import InfoCard from '../InfoCard';
import Header from './Header';

import { DataRetriever } from '../../utils/DataRetrieval';
import { arrayLength } from '../../helpers/helper';

export default function ItemList(props) {
    const dataType = props.dataType;
    const title = props.title;
    const subtitle = props.subtitle;

    const [metadataList, setMetadataList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [resultLength, setResultLength] = useState(null);

    useEffect(() => {
        async function retrieveData() {
            try {
                const data = await DataRetriever(dataType);
                setMetadataList(data);
                setLoading(false);
                setResultLength(arrayLength(data));
            } catch (error) {
                setError(error);
                setLoading(false);
            }
        }
        retrieveData();
    }, [])

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    return (
        <CssVarsProvider disableTransitionOnChange>
            <CssBaseline />
            <Header title={title} subtitle={subtitle} />
            <Container maxWidth="xl">
                <Box
                    component="main"
                    sx={{
                        minHeight: 'calc(100vh - 420px)', // 420px is the height of the NavBar, header, and footer
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
                    >
                        <Stack spacing={2} sx={{ px: { xs: 2, md: 4 }, pt: 2, minHeight: 0 }}>
                            {
                                resultLength > 1
                                    ? <Typography>
                                        Showing {resultLength} results
                                    </Typography>
                                    : <Typography>
                                        Showing {resultLength} result
                                    </Typography>
                            }
                            {metadataList?.map((dataset) => (
                                <InfoCard
                                    key={dataset.id}
                                    cardtype={dataset['resource-type'] + 's'}
                                    pageid={dataset.id}
                                    title={dataset.title}
                                    authors={dataset.authors}
                                    tags={dataset.tags}
                                    contents={dataset.contents}
                                    thumbnailImage={dataset['thumbnail-image']} />
                            ))}
                        </Stack>
                    </Grid>
                </Box>
            </Container>
        </CssVarsProvider>
    )
}