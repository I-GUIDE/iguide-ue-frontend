import React, { useState, useEffect } from 'react';

import Stack from '@mui/joy/Stack';
import { CssVarsProvider } from '@mui/joy/styles';
import CssBaseline from '@mui/joy/CssBaseline';
import Box from '@mui/joy/Box';
import Grid from '@mui/joy/Grid';
import Container from '@mui/joy/Container';

import InfoCard from '../InfoCard';
import Header from './Header';

import { DataRetriever } from '../../utils/DataRetrieval';

export default function ItemList(props) {
    const dataType = props.dataType;
    const title = props.title;
    const subtitle = props.subtitle;

    const [metadataList, setMetadataList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function retrieveData() {
            try {
                const data = await DataRetriever(dataType);
                setMetadataList(data);
                setLoading(false);
            } catch (error) {
                setError(error);
                setLoading(false);
            }
        }
        retrieveData();
    }, [])

    console.log(metadataList)

    if (error) {
        return <div>Error: {error.message}</div>;
    }

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
                            <Stack spacing={2} sx={{ px: { xs: 2, md: 4 }, pt: 2, minHeight: 0 }}>
                                <Header title={title} subtitle={subtitle} />
                                {metadataList.map((dataset) => (
                                    <InfoCard
                                        key={dataset.id}
                                        cardtype={dataset['resource-type'] + 's'}
                                        pageid={dataset.id}
                                        title={dataset.title}
                                        subtitle={dataset.authors}
                                        tags={dataset.tags}
                                        contents={dataset.contents}
                                        thumbnailImage={dataset['thumbnail-image']} />
                                ))}
                            </Stack>
                        </Grid>
                    </Grid>
                </Box>
            </Container>
        </CssVarsProvider>
    )
}