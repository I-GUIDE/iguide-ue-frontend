import { React, useState, useEffect } from "react";
import {
    experimental_extendTheme as materialExtendTheme,
    Experimental_CssVarsProvider as MaterialCssVarsProvider,
    THEME_ID as MATERIAL_THEME_ID,
} from '@mui/material/styles';
import { CssVarsProvider as JoyCssVarsProvider } from '@mui/joy/styles';
import CssBaseline from '@mui/material/CssBaseline';
const materialTheme = materialExtendTheme();

import { useOutletContext } from "react-router-dom";

import Box from "@mui/joy/Box";
import Container from "@mui/joy/Container";
import Stack from "@mui/joy/Stack";
import Grid from "@mui/joy/Grid";
import Typography from "@mui/joy/Typography";
import Pagination from '@mui/material/Pagination';

import UserCard from "../components/UserCard";
import Header from "../components/Layout/Header";
import LoginCard from "../components/LoginCard";
import InfoCard from "../components/InfoCard";

import { fetchResourceCountByField, fetchResourcesByContributor } from "../utils/DataRetrieval";
import { arrayLength } from "../helpers/helper";

const UserProfile = () => {
    // OutletContext retrieving the user object to display user info
    const [isAuthenticated, setIsAuthenticated, userInfo, setUserInfo] = useOutletContext();

    if (!isAuthenticated) {
        return (
            <JoyCssVarsProvider disableTransitionOnChange>
                <CssBaseline />
                <Header title="Please login to continue" subtitle="" />
                <Container maxWidth="xl">
                    <Box
                        component="main"
                        sx={{
                            minHeight: "calc(100vh - 420px)", // 55px is the height of the NavBar
                            display: "grid",
                            gridTemplateColumns: { xs: "auto", md: "100%" },
                            gridTemplateRows: "auto 1fr auto",
                        }}
                    >
                        <Grid
                            container
                            display="flex"
                            justifyContent="center"
                            alignItems="center"
                            direction="column"
                            sx={{
                                minHeight: "calc(100vh - 420px)",
                                backgroundColor: "inherit",
                                px: { xs: 2, md: 4 },
                                pt: 4,
                                pb: 8,
                            }}
                        >
                            <Stack
                                direction="row"
                                justifyContent="center"
                                alignItems="center"
                                spacing={2}
                            >
                                <LoginCard />
                            </Stack>
                        </Grid>
                    </Box>
                </Container>
            </JoyCssVarsProvider>
        );
    }

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
            if (userInfo.sub) {
                const data = await fetchResourcesByContributor(
                    userInfo.sub,
                    '_score',
                    "desc",
                    startingIdx,
                    itemsPerPage
                );
                const resourceCount = await fetchResourceCountByField('metadata.created_by', [userInfo.sub]);

                setNumberOfTotalItems(resourceCount);
                setNumberOfPages(Math.ceil(numberOfTotalItems / itemsPerPage));
                setMetadataList(data);
                setLoading(false);
                setResultLength(arrayLength(data));
            }
        }
        retrieveData(currentStartingIdx);
    }, [currentStartingIdx, numberOfTotalItems, userInfo.sub]);

    const handlePageClick = (event, value) => {
        const newStartingIdx = (value - 1) * itemsPerPage;
        console.log(
            `User requested page number ${value}, which is offset ${newStartingIdx}`
        );
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
                {userInfo && (
                    <Header
                        title={"Hello " + userInfo.given_name}
                        subtitle="Welcome to your user profile"
                    />
                )}
                <Container maxWidth="xl">
                    {/* <Box
                        component="main"
                        sx={{
                            minHeight: "calc(100vh - 420px)", // 55px is the height of the NavBar
                            display: "grid",
                            gridTemplateColumns: { xs: "auto", md: "100%" },
                            gridTemplateRows: "auto 1fr auto",
                        }}
                    > */}
                    <Grid
                        container
                        display="flex"
                        justifyContent="flex-start"
                        alignItems="center"
                        direction="column"
                        sx={{
                            minHeight: "calc(100vh - 425px)",
                            backgroundColor: "inherit",
                            px: { xs: 2, md: 4 },
                            pt: 4,
                            pb: 8,
                        }}
                    >
                        <Stack
                            direction="column"
                            justifyContent="center"
                            alignItems="flex-start"
                            spacing={2}
                            width="100%"
                        >
                            <UserCard userInfo={userInfo} numberOfContributions={numberOfTotalItems} />
                            {numberOfTotalItems > 0 && <>
                                <Stack spacing={2} sx={{ px: { xs: 2, md: 4, width: '100%' }, pt: 2, minHeight: 0 }}>
                                    <Typography level="h3">Your contributions</Typography>
                                    <Typography>
                                        Showing {currentStartingIdx + 1}-
                                        {currentStartingIdx + resultLength} of {numberOfTotalItems}
                                    </Typography>
                                    {metadataList?.map((dataset) => (
                                        <InfoCard
                                            key={dataset._id}
                                            cardtype={dataset["resource-type"] + "s"}
                                            pageid={dataset._id}
                                            title={dataset.title}
                                            authors={dataset.authors}
                                            tags={dataset.tags}
                                            contents={dataset.contents}
                                            thumbnailImage={dataset["thumbnail-image"]}
                                        />
                                    ))}
                                </Stack>
                                <Stack
                                    direction="row"
                                    justifyContent="center"
                                    alignItems="center"
                                    spacing={2}
                                    sx={{ px: { xs: 2, md: 4, width: '100%' }, pt: 2, minHeight: 0 }}
                                >
                                    <Pagination
                                        count={numberOfPages}
                                        color="primary"
                                        page={currentPage}
                                        onChange={handlePageClick}
                                    />
                                </Stack>
                            </>}
                        </Stack>
                    </Grid>
                    {/* </Box> */}
                </Container>
            </JoyCssVarsProvider>
        </MaterialCssVarsProvider>
    );
};

export default UserProfile;
