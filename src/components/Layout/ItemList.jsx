import React, { useState, useEffect } from 'react';

import {
    experimental_extendTheme as materialExtendTheme,
    Experimental_CssVarsProvider as MaterialCssVarsProvider,
    THEME_ID as MATERIAL_THEME_ID,
} from '@mui/material/styles';
import { CssVarsProvider as JoyCssVarsProvider } from '@mui/joy/styles';
import CssBaseline from '@mui/material/CssBaseline';
const materialTheme = materialExtendTheme();

import Stack from '@mui/joy/Stack';
import Box from '@mui/joy/Box';
import Grid from '@mui/joy/Grid';
import Container from '@mui/joy/Container';
import Typography from '@mui/joy/Typography';
import Pagination from '@mui/material/Pagination';

import InfoCard from '../InfoCard';
import Header from './Header';

import { DataRetriever, getResourceCount } from '../../utils/DataRetrieval';
import { arrayLength } from '../../helpers/helper';

export default function ItemList(props) {
    const dataType = props.dataType;
    const title = props.title;
    const subtitle = props.subtitle;

    const [metadataList, setMetadataList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [resultLength, setResultLength] = useState(null);

    const [currentPage, setCurrentPage] = useState(1);
    const [currentStartingIdx, setCurrentStartingIdx] = useState(0);
    const [numberOfPages, setNumberOfPages] = useState(0);
    const [numberOfTotalItems, setNumberOfTotalItems] = useState(0);
    const itemsPerPage = 5;

    // When users select a new page or when there is a change of total items,
    //   retrieve the data
    useEffect(() => {
        async function retrieveData(startingIdx) {
            try {
                const resourceCount = await getResourceCount(dataType);
                const data = await DataRetriever(dataType, '_id', 'desc', startingIdx, itemsPerPage);

                setNumberOfTotalItems(resourceCount);
                setNumberOfPages(Math.ceil(numberOfTotalItems / itemsPerPage));
                setMetadataList(data);
                setLoading(false);
                setResultLength(arrayLength(data));
            } catch (error) {
                setError(error);
                setLoading(false);
            }
        }
        retrieveData(currentStartingIdx);
    }, [currentStartingIdx, numberOfTotalItems, dataType])

    const handlePageClick = (event, value) => {
        const newStartingIdx = (value - 1) * itemsPerPage;
        console.log(`User requested page number ${value}, which is offset ${newStartingIdx}`);
        setCurrentStartingIdx(newStartingIdx);
        setCurrentPage(value);
    };

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    return (
        <MaterialCssVarsProvider theme={{ [MATERIAL_THEME_ID]: materialTheme }}>
            <JoyCssVarsProvider>
                <CssBaseline enableColorScheme />
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
                            justifyContent="center"
                            alignItems="center"
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
                                <Typography>
                                    Showing {currentStartingIdx + 1}-{currentStartingIdx + resultLength} of {numberOfTotalItems}
                                </Typography>
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
                            <Stack
                                direction="row"
                                justifyContent="center"
                                alignItems="center"
                                spacing={2}
                                sx={{ px: { xs: 2, md: 4 }, pt: 2, minHeight: 0 }}
                            >
                                <Pagination count={numberOfPages} color="primary" page={currentPage} onChange={handlePageClick} />
                            </Stack>
                        </Grid>
                    </Box>
                </Container>
            </JoyCssVarsProvider>
        </MaterialCssVarsProvider>
    );
}