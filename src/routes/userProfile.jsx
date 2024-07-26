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
import IconButton from '@mui/joy/IconButton';
import DialogTitle from '@mui/joy/DialogTitle';
import DialogContent from '@mui/joy/DialogContent';
import DialogActions from '@mui/joy/DialogActions';
import Modal from '@mui/joy/Modal';
import ModalDialog from '@mui/joy/ModalDialog';
import DeleteForever from '@mui/icons-material/DeleteForever';
import EditIcon from '@mui/icons-material/Edit';
import WarningRoundedIcon from '@mui/icons-material/WarningRounded';
import Divider from '@mui/joy/Divider';
import Button from '@mui/joy/Button';
import Link from '@mui/joy/Link';

import UserCard from "../components/UserCard";
import Header from "../components/Layout/Header";
import LoginCard from "../components/LoginCard";
import InfoCard from "../components/InfoCard";

import { fetchResourceCountByField, fetchResourcesByContributor } from "../utils/DataRetrieval";
import { elementCounter, elementRetriever } from "../utils/DataRetrieval";
import { arrayLength } from "../helpers/helper";

const USER_BACKEND_URL = import.meta.env.VITE_DATABASE_BACKEND_URL;

const UserProfile = () => {
    // OutletContext retrieving the user object to display user info
    const [isAuthenticated, setIsAuthenticated, userInfo, setUserInfo, localUserInfo, setLocalUserInfo] = useOutletContext();

    if (!isAuthenticated) {
        return (
            <JoyCssVarsProvider disableTransitionOnChange>
                <CssBaseline />
                <Header title="Please login to continue" subtitle="" />
                <Container maxWidth="xl">
                    <Box
                        component="main"
                        sx={{
                            minHeight: "calc(100vh - 375px)", // 55px is the height of the NavBar
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
                                minHeight: "calc(100vh - 375px)",
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

    const [deleteMetadataTitle, setDeleteMetadataTitle] = useState(undefined);
    const [deleteMetadataId, setDeleteMetadataId] = useState(undefined);

    let displayedFirstName = '';
    if (localUserInfo && localUserInfo.preferred_first_name) {
        displayedFirstName = localUserInfo.preferred_first_name;
    } else {
        displayedFirstName = userInfo.given_name;
    }

    const itemsPerPage = 10;

    // When users select a new page or when there is a change of total items,
    //   retrieve the data
    useEffect(() => {
        async function retrieveData(startingIdx) {
            if (userInfo.sub) {
                const data = await elementRetriever('metadata.created_by', [userInfo.sub], null, '_score', 'desc', startingIdx, itemsPerPage);
                const resourceCount = await elementCounter('metadata.created_by', [userInfo.sub], null);

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

    async function handleElementDelete(elementId) {
        console.log('Deleting...', elementId)
        try {
            const response = await fetch(`${USER_BACKEND_URL}/api/resources/${elementId}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Error deleting resource');
            }

            setDeleteMetadataId(undefined);
            setDeleteMetadataTitle(undefined);

            const result = await response.json();
            // When the deletion was successful, rerender the list
            if (result && result.message === 'Resource deleted successfully') {
                setNumberOfTotalItems(numberOfTotalItems - 1);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error deleting resource');
        }
    }

    return (
        <MaterialCssVarsProvider theme={{ [MATERIAL_THEME_ID]: materialTheme }}>
            <JoyCssVarsProvider>
                <CssBaseline enableColorScheme />
                {userInfo && (
                    <Header
                        title={"Hello " + displayedFirstName}
                        subtitle="Welcome to your user profile"
                    />
                )}
                <Container maxWidth="xl">
                    <Box
                        component="main"
                        sx={{
                            minHeight: "calc(100vh - 375px)", // 55px is the height of the NavBar
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
                                minHeight: "calc(100vh - 375px)",
                                backgroundColor: "inherit",
                                px: { xs: 2, md: 4 },
                                pt: 4,
                                pb: 8,
                            }}
                        >
                            <UserCard localUserInfo={localUserInfo} numberOfContributions={numberOfTotalItems} />
                            <Stack
                                direction="column"
                                justifyContent="center"
                                alignItems="flex-start"
                                spacing={2}
                                width="100%"
                            >
                                {numberOfTotalItems > 0 && <>
                                    <Stack spacing={2} sx={{ px: { xs: 2, md: 4, width: '100%' }, pt: 2, minHeight: 0 }}>
                                        <Typography level="h3">Your contributions</Typography>
                                        <Typography>
                                            Showing {currentStartingIdx + 1}-
                                            {currentStartingIdx + resultLength} of {numberOfTotalItems}
                                        </Typography>
                                        {metadataList?.map((metadata, idx) => (
                                            <Grid container spacing={2} columns={16} sx={{ flexGrow: 1 }}>
                                                <Grid xs={15}>
                                                    <InfoCard
                                                        key={metadata._id}
                                                        cardtype={metadata["resource-type"] + "s"}
                                                        pageid={metadata._id}
                                                        title={metadata.title}
                                                        authors={metadata.authors}
                                                        tags={metadata.tags}
                                                        contents={metadata.contents}
                                                        thumbnailImage={metadata["thumbnail-image"]}
                                                    />
                                                </Grid>
                                                <Grid xs={1}>
                                                    <IconButton
                                                        color="danger"
                                                        size="lg"
                                                        onClick={() => {
                                                            setDeleteMetadataTitle(metadata.title);
                                                            setDeleteMetadataId(metadata._id);
                                                            console.log('Attempting to delete:', metadata.title, metadata._id);
                                                        }}
                                                    >
                                                        <DeleteForever />
                                                    </IconButton>
                                                    <Link href={"/resource_update/" + metadata._id} style={{ textDecoration: 'none' }}>
                                                        <IconButton
                                                            color="primary"
                                                            size="lg"
                                                        >
                                                            <EditIcon />
                                                        </IconButton>
                                                    </Link>
                                                </Grid>
                                            </Grid>
                                        ))}
                                        <Modal
                                            open={!!deleteMetadataTitle && !!deleteMetadataId}
                                            onClose={() => {
                                                setDeleteMetadataId(undefined);
                                                setDeleteMetadataTitle(undefined);
                                            }}
                                        >
                                            <ModalDialog variant="outlined" role="alertdialog">
                                                <DialogTitle>
                                                    <WarningRoundedIcon />
                                                    Confirmation
                                                </DialogTitle>
                                                <Divider />
                                                <DialogContent>
                                                    Are you sure you want to delete "{deleteMetadataTitle}"? This deletion is permanent!
                                                </DialogContent>
                                                <DialogActions>
                                                    <Button variant="solid" color="danger" onClick={() => handleElementDelete(deleteMetadataId)}>
                                                        Delete
                                                    </Button>
                                                    <Button
                                                        variant="plain"
                                                        color="neutral"
                                                        onClick={() => {
                                                            setDeleteMetadataId(undefined);
                                                            setDeleteMetadataTitle(undefined);
                                                        }}
                                                    >
                                                        Cancel
                                                    </Button>
                                                </DialogActions>
                                            </ModalDialog>
                                        </Modal>
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
                    </Box>
                </Container>
            </JoyCssVarsProvider>
        </MaterialCssVarsProvider>
    );
};

export default UserProfile;
