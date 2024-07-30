import React, { useState, useEffect } from 'react';

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

import PersonIcon from '@mui/icons-material/Person';
import EditIcon from '@mui/icons-material/Edit';
import LibraryAddIcon from '@mui/icons-material/LibraryAdd';

export default function UserProfileHeader(props) {
    const localUserInfo = props.localUserInfo;

    const [localUserInfoMissing, setLocalUserInfoMissing] = useState('unknown');

    // Check if the user exists on the local DB, if not, add the user
    useEffect(() => {
        const checkLocalUserInfo = async () => {
            if (localUserInfo.first_name && localUserInfo.last_name && localUserInfo.email && localUserInfo.affiliation) {
                setLocalUserInfoMissing('good');
            } else {
                setLocalUserInfoMissing('missing');
            }
        };
        if (localUserInfo) {
            checkLocalUserInfo();
        }
    }, [localUserInfo]);

    // If the user info from the local DB is still not available, wait...
    if (!localUserInfo) {
        return;
    }

    // If local user information is missing, ask them to fill out the info
    if (localUserInfoMissing === 'unknwon') {
        return;
    } else if (localUserInfoMissing === 'missing') {
        return (
            <UserProfileEditCard userProfileEditType="mandatory" />
        )
    }

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
                            <Grid xs={3}>
                                <Stack sx={{ m: 3, justifyContent: 'center', alignItems: 'center' }}>
                                    <AspectRatio
                                        ratio="3/4"
                                        variant="outlined"
                                        sx={{
                                            width: 150,
                                            bgcolor: 'background.level2',
                                            borderRadius: 'md',
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
                                            <PersonIcon />
                                        }
                                    </AspectRatio>
                                </Stack>
                            </Grid>
                            <Grid xs={9}>
                                <Stack sx={{ m: 3 }} spacing={1}>
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
                                        <Button component="a" href="/user_profile_update" variant="solid" size="sm" color="success" endDecorator={<EditIcon />}>
                                            Edit Profile
                                        </Button>
                                        <Button component="a" href="/resource_submission" variant="solid" size="sm" color="warning" endDecorator={<LibraryAddIcon />}>
                                            New Contribution
                                        </Button>
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