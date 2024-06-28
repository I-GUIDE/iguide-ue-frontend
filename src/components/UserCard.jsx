import React from 'react';

import AspectRatio from '@mui/joy/AspectRatio';
import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import Card from '@mui/joy/Card';
import CardContent from '@mui/joy/CardContent';
import Typography from '@mui/joy/Typography';
import Sheet from '@mui/joy/Sheet';

import { useAuth } from "react-oidc-context";

export default function UserCard(props) {
    const auth = useAuth();

    if (auth.isLoading) {
        return <div>Loading...</div>;
    }

    if (auth.error) {
        return (
            <div>
                <p>An error occurred during authentication:</p>
                <pre>{auth.error.message}</pre>
            </div>
        );
    }

    if (!auth.isAuthenticated) {
        return (
            <Typography>
                Please login...
            </Typography>
        );
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
                orientation="horizontal"
                sx={{
                    width: '100%',
                    flexWrap: 'wrap',
                    [`& > *`]: {
                        '--stack-point': '500px',
                        minWidth:
                            'clamp(0px, (calc(var(--stack-point) - 2 * var(--Card-padding) - 2 * var(--variant-borderWidth, 0px)) + 1px - 100%) * 999, 100%)',
                    },
                    // make the card resizable for demo
                    overflow: 'auto',
                    resize: 'horizontal',
                }}
            >
                <AspectRatio flex ratio="1" maxHeight={182} sx={{ minWidth: 182 }}>
                    <img
                        src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=286"
                        srcSet="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=286&dpr=2 2x"
                        loading="lazy"
                        alt=""
                    />
                </AspectRatio>
                <CardContent>
                    <Typography fontSize="xl" fontWeight="lg">
                        {auth.user?.profile.name}
                    </Typography>
                    <Typography level="body-sm" fontWeight="lg" textColor="text.tertiary">
                        {auth.user?.profile.email}
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
                                Contributions
                            </Typography>
                            <Typography fontWeight="lg">10</Typography>
                        </div>
                        <div>
                            <Typography level="body-xs" fontWeight="lg">
                                Followers
                            </Typography>
                            <Typography fontWeight="lg">230k</Typography>
                        </div>
                        <div>
                            <Typography level="body-xs" fontWeight="lg">
                                Rating
                            </Typography>
                            <Typography fontWeight="lg">10.0</Typography>
                        </div>
                    </Sheet>
                    <Box sx={{ display: 'flex', gap: 1.5, '& > button': { flex: 1 } }}>
                        <Button variant="outlined" color="neutral">
                            Past Contributions
                        </Button>
                        <Button variant="solid" color="primary">
                            Contribute
                        </Button>
                    </Box>
                </CardContent>
            </Card>
        </Box>
    )
}