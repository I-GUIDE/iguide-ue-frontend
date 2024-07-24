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

import '../utils/UserManager';

export default function UserCard(props) {
    const localUserInfo = props.localUserInfo;
    const numberOfContributions = props.numberOfContributions;

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
                    {localUserInfo['avatar_url']
                        ?
                        <img
                            src={localUserInfo['avatar_url']}
                            srcSet={localUserInfo['avatar_url'] + " 2x"}
                            loading="lazy"
                            alt=""
                        />
                        :
                        <PersonIcon />
                    }
                </AspectRatio>
                <CardContent>
                    <Typography fontSize="xl" fontWeight="lg">
                        {/* When preferred first name is available, display the preferred one */}
                        {localUserInfo.preferred_first_name ? localUserInfo.preferred_first_name : (localUserInfo.first_name ? localUserInfo.first_name : "First name unknown")}&nbsp;
                        {localUserInfo.last_name ? localUserInfo.last_name : "Last name unknown"}
                    </Typography>
                    <Typography level="body-sm" fontWeight="lg" textColor="text.tertiary">
                        {localUserInfo.email ? "Email: " + localUserInfo.email : null}
                    </Typography>
                    <Typography level="body-sm" fontWeight="lg" textColor="text.tertiary">
                        {localUserInfo.affiliation ? "Affiliation: " + localUserInfo.affiliation : null}
                    </Typography>
                    <Typography level="body-sm" fontWeight="md" textColor="text.tertiary">
                        {localUserInfo.bio ? "Bio: " + localUserInfo.bio : null}
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