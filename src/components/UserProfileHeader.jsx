import React, { useState, useEffect, useRef } from 'react';

import Jdenticon from 'react-jdenticon';

import Stack from '@mui/joy/Stack';
import Typography from '@mui/joy/Typography';
import Container from '@mui/joy/Container';
import Grid from '@mui/joy/Grid';
import Box from '@mui/joy/Box';
import Card from '@mui/joy/Card';
import CardCover from '@mui/joy/CardCover';
import CardContent from '@mui/joy/CardContent';
import AspectRatio from '@mui/joy/AspectRatio';
import Button from '@mui/joy/Button';
import Menu from '@mui/joy/Menu';
import MenuButton from '@mui/joy/MenuButton';
import Dropdown from '@mui/joy/Dropdown';
import MenuItem from '@mui/joy/MenuItem';

import EditIcon from '@mui/icons-material/Edit';
import LibraryAddIcon from '@mui/icons-material/LibraryAdd';

export default function UserProfileHeader(props) {
    const localUserInfo = props.localUserInfo;

    // If the user info from the local DB is still not available, wait...
    if (!localUserInfo) {
        return (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', p: 0, m: 0, height: 300 }}>
                <Card component="li" sx={{ borderRadius: 0, minWidth: 300, flexGrow: 1 }}>
                    <CardCover>
                        <img
                            src="/images/green-blue.png"
                            srcSet="/images/green-blue.png 2x"
                            loading="lazy"
                            alt=""
                        />
                    </CardCover>
                    <CardContent sx={{ justifyContent: 'center', alignItems: 'center' }}>
                        <Container maxWidth="xl">
                            <Grid container sx={{ justifyContent: 'center', alignItems: 'center' }}>
                                <Stack sx={{ m: 3 }} spacing={1}>
                                    <Typography level="h3" fontWeight="lg" textColor={'#fff'}>
                                        Error fetching the user information. Please check back later.
                                    </Typography>
                                </Stack>
                            </Grid>
                        </Container>
                    </CardContent>
                </Card>
            </Box >
        )
    }

    return (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', p: 0, m: 0, minHeight: 300 }}>
            <Card component="li" sx={{ borderRadius: 0, minWidth: 300, flexGrow: 1 }}>
                <CardCover>
                    <img
                        src="/images/green-blue.png"
                        srcSet="/images/green-blue.png 2x"
                        loading="lazy"
                        alt=""
                    />
                </CardCover>
                <CardContent sx={{ justifyContent: 'center', alignItems: 'center' }}>
                    <Container maxWidth="md">
                        <Grid container sx={{ justifyContent: 'center', alignItems: 'center' }}>
                            <Grid xs={12} md={3}>
                                <Stack sx={{ m: 2, justifyContent: 'center', alignItems: 'center' }}>
                                    <AspectRatio
                                        ratio="1"
                                        variant="outlined"
                                        sx={{
                                            width: 150,
                                            bgcolor: 'background.level2',
                                            borderRadius: 'lg',
                                        }}
                                    >
                                        {localUserInfo['avatar_url']
                                            ?
                                            <img
                                                src={localUserInfo['avatar_url']}
                                                srcSet={localUserInfo['avatar_url'] + " 2x"}
                                                loading="lazy"
                                                alt="user profile photo"
                                            />
                                            :
                                            <Jdenticon size="200" value={localUserInfo.openid} />
                                        }
                                    </AspectRatio>
                                </Stack>
                            </Grid>
                            <Grid xs={12} md={9}>
                                <Stack
                                    direction="column"
                                    sx={{ m: 3 }}
                                    spacing={0.5}
                                    alignItems={{
                                        xs: "center",
                                        md: "flex-start"
                                    }}
                                >
                                    <Typography level="h1" fontWeight="lg" textColor={'#fff'}>
                                        {localUserInfo.first_name ? localUserInfo.first_name : "First name unknown"}&nbsp;
                                        {localUserInfo.last_name ? localUserInfo.last_name : "Last name unknown"}
                                    </Typography>
                                    <Typography level="body-sm" fontWeight="lg" textColor={'#fff'}>
                                        {localUserInfo.email ? "Email: " + localUserInfo.email : null}
                                    </Typography>
                                    <Typography level="body-sm" fontWeight="lg" textColor={'#fff'}>
                                        {localUserInfo.affiliation ? "Affiliation: " + localUserInfo.affiliation : null}
                                    </Typography>
                                    <Typography level="body-sm" fontWeight="md" textColor={'#fff'}>
                                        {localUserInfo.bio ? "Bio: " + localUserInfo.bio : null}
                                    </Typography>
                                    <Stack direction="row" spacing={2} justifyContent="flex-start" sx={{ py: 2 }}>
                                        <Button component="a" href="/user-profile-update" variant="solid" size="sm" color="success" endDecorator={<EditIcon />}>
                                            Edit Profile
                                        </Button>
                                        <Dropdown>
                                            <MenuButton variant="solid" size="sm" color="warning" endDecorator={<LibraryAddIcon />}>
                                                New Contribution
                                            </MenuButton>
                                            <Menu placement="bottom-end" color="primary">
                                                <MenuItem component="a" href="/contribution/dataset">
                                                    New Dataset
                                                </MenuItem>
                                                <MenuItem component="a" href="/contribution/notebook">
                                                    New Notebook
                                                </MenuItem>
                                                <MenuItem component="a" href="/contribution/publication">
                                                    New Publication
                                                </MenuItem>
                                                <MenuItem component="a" href="/contribution/oer">
                                                    New Educational Resource
                                                </MenuItem>
                                            </Menu>
                                        </Dropdown>
                                    </Stack>
                                </Stack>
                            </Grid>
                        </Grid>
                    </Container>
                </CardContent>
            </Card>
        </Box >
    );
}