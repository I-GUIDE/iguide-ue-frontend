import React from 'react';

import AspectRatio from '@mui/joy/AspectRatio';
import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import Card from '@mui/joy/Card';
import CardContent from '@mui/joy/CardContent';
import Typography from '@mui/joy/Typography';
import Sheet from '@mui/joy/Sheet';
import Stack from '@mui/joy/Stack';
import PersonIcon from '@mui/icons-material/Person';

import { addUser, checkUser } from '../utils/UserManager';
import '../utils/UserManager';

export default function UserCard(props) {
    const userInfo = props.userInfo;
    const numberOfContributions = props.numberOfContributions;

    // Save the user information from CILogon to the local DB
    const saveUserToLocalDB = () => {
        const ret_msg = addUser(userInfo.sub, userInfo.given_name, userInfo.family_name, userInfo.email, userInfo.idp_name, "");
        console.log('saving user to the local db...', ret_msg);
    }

    // Check if the user exists on the local DB, if not, add the user
    React.useEffect(() => {
        const handleCheckUser = async () => {
            if (userInfo.sub) {
                const userExists = await checkUser(userInfo.sub);
                if (userExists) {
                    console.log('Found the user from our database');
                } else {
                    console.log('Couldn\'t find the user from our database...');
                    saveUserToLocalDB();
                }
            }
        };
        handleCheckUser();
    }, [userInfo]);

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
                    {/* <img
                        src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=286"
                        srcSet="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=286&dpr=2 2x"
                        loading="lazy"
                        alt=""
                    /> */}
                    <PersonIcon />
                </AspectRatio>
                <CardContent>
                    <Typography fontSize="xl" fontWeight="lg">
                        {userInfo.given_name ? userInfo.given_name : "Given name unknown"}&nbsp;
                        {userInfo.family_name ? userInfo.family_name : "Family name unknown"}
                    </Typography>
                    <Typography level="body-sm" fontWeight="lg" textColor="text.tertiary">
                        {userInfo.email ? userInfo.email : null}
                    </Typography>
                    <Typography level="body-sm" fontWeight="lg" textColor="text.tertiary">
                        {userInfo.idp_name ? userInfo.idp_name : "Independent User"}
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