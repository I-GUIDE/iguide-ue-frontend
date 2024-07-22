import React, { useState, useEffect } from 'react';

import AspectRatio from '@mui/joy/AspectRatio';
import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import Card from '@mui/joy/Card';
import CardContent from '@mui/joy/CardContent';
import Typography from '@mui/joy/Typography';
import Sheet from '@mui/joy/Sheet';
import Stack from '@mui/joy/Stack';
import PersonIcon from '@mui/icons-material/Person';

import UserProfileEditCard from './UserProfileEditCard';

import { addUser, checkUser, fetchUser } from '../utils/UserManager';
import '../utils/UserManager';

export default function UserCard(props) {
    const userInfo = props.userInfo;
    const numberOfContributions = props.numberOfContributions;

    const [userInfoFromLocalDB, setUserInfoFromLocalDB] = useState();
    const [localUserInfoMissing, setLocalUserInfoMissing] = useState('unknown');

    // Save the user information from CILogon to the local DB
    const saveUserToLocalDB = async () => {
        const ret_msg = await addUser(userInfo.sub, userInfo.given_name, userInfo.family_name, userInfo.email, userInfo.idp_name, "");
        console.log('saving user to the local db...', ret_msg);
    }

    // Check if the user exists on the local DB, if not, add the user
    useEffect(() => {
        const handleCheckUser = async () => {
            if (userInfo.sub) {
                const localUserExists = await checkUser(userInfo.sub);
                if (localUserExists) {
                    console.log('Found the user from our database');
                } else {
                    console.log('Couldn\'t find the user from our database...');
                    await saveUserToLocalDB();
                }
                const localUserInfo = await fetchUser(userInfo.sub);
                setUserInfoFromLocalDB(localUserInfo);

                if (localUserInfo.first_name && localUserInfo.last_name && localUserInfo.email && localUserInfo.affiliation) {
                    setLocalUserInfoMissing('good');
                } else {
                    setLocalUserInfoMissing('missing');
                }
            }
        };
        handleCheckUser();
    }, [userInfo]);

    // If the user info from the local DB is still not available, wait...
    if (!userInfoFromLocalDB) {
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
        <Box
            sx={{
                width: '100%',
                position: 'relative',
                overflow: { xs: 'auto', sm: 'initial' },
            }}
        >
            <Card
                variant="outlined"
                orientation="horizontal"
                sx={{
                    width: "100%",
                    '&:hover': { boxShadow: 'md', borderColor: 'neutral.outlinedHoverBorder' },
                }}
            >
                <AspectRatio flex ratio="1" maxHeight={182} sx={{ minWidth: 182 }}>
                    {userInfoFromLocalDB['avatar_url']
                        ?
                        <img
                            src={userInfoFromLocalDB['avatar_url']}
                            srcSet={userInfoFromLocalDB['avatar_url'] + " 2x"}
                            loading="lazy"
                            alt=""
                        />
                        :
                        <PersonIcon />
                    }
                </AspectRatio>
                <CardContent>
                    <Typography fontSize="xl" fontWeight="lg">
                        {userInfoFromLocalDB.first_name ? userInfoFromLocalDB.first_name : "Given name unknown"}&nbsp;
                        {userInfoFromLocalDB.last_name ? userInfoFromLocalDB.last_name : "Family name unknown"}
                    </Typography>
                    <Typography level="body-sm" fontWeight="lg" textColor="text.tertiary">
                        {userInfoFromLocalDB.email ? "E-mail: " + userInfoFromLocalDB.email : null}
                    </Typography>
                    <Typography level="body-sm" fontWeight="lg" textColor="text.tertiary">
                        {userInfoFromLocalDB.affiliation ? "Affiliation: " + userInfoFromLocalDB.affiliation : null}
                    </Typography>
                    <Typography level="body-sm" fontWeight="md" textColor="text.tertiary">
                        {userInfoFromLocalDB.bio ? "Bio: " + userInfoFromLocalDB.bio : null}
                    </Typography>
                    <Sheet
                        sx={{
                            bgcolor: 'background.level1',
                            borderRadius: 'sm',
                            p: 1.5,
                            my: 1.5,
                            display: 'flex',
                            gap: 2,
                            '& > div': { flex: 1 },
                        }}
                    >
                        <div>
                            <Typography level="body-xs" fontWeight="lg">
                                {numberOfContributions > 1 ? "Contributions" : "Contribution"}
                            </Typography>
                            <Typography fontWeight="lg">{numberOfContributions}</Typography>
                        </div>
                    </Sheet>
                    <Stack direction="row" spacing={2} justifyContent="flex-end">
                        <Button component="a" href="/resource_submission" variant="solid" color="primary">
                            Contribute Now!
                        </Button>
                    </Stack>
                </CardContent>
            </Card>
        </Box>
    )
}