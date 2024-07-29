import * as React from 'react';

import Divider from '@mui/joy/Divider';
import Typography from '@mui/joy/Typography';
import Stack from '@mui/joy/Stack';
import Box from '@mui/joy/Box';
import Link from '@mui/joy/Link';

export default function CapsuleList(props) {
    const title = props.title;
    const items = props.items;

    // If items object doesn't exist, or it only has one empty item, return null
    if (!items || (items.length == 1 && items[0] == '')) {
        return null;
    }

    return (
        <Stack spacing={2} sx={{ px: { xs: 2, md: 4 }, py: 3 }}>
            <Typography
                id="notebook-tags"
                level="h5"
                fontWeight="lg"
                mb={1}
            >
                {title}
            </Typography>
            <Divider inset="none" />
            <Box
                direction="row"
                justifyContent="flex-start"
                alignItems="flex-end"
                spacing={1}
            >
                {items?.map((item) => {
                    // Make sure that the item only renders when it has content
                    if (item && item !== '') {
                        return (
                            <Link
                                variant="outlined"
                                key={item}
                                href={'/tag/' + item}
                                fontSize="md"
                                underline="none"
                                sx={{ '--Link-gap': '0.5rem', my: 1, mx: 0.5, borderRadius: 'lg' }}
                            >
                                {item}
                            </Link>
                        )
                    }
                })}
            </Box>
        </Stack>
    )
}