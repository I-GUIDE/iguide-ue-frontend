import * as React from 'react';

import Divider from '@mui/joy/Divider';
import Typography from '@mui/joy/Typography';
import Stack from '@mui/joy/Stack';
import Chip from '@mui/joy/Chip';
import Box from '@mui/joy/Box';

export default function CapsuleList(props) {
    const title = props.title;
    const items = props.items;

    return (
        <Stack spacing={2} sx={{ px: { xs: 2, md: 4 }, pt: 2, minHeight: 0 }}>
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
                {items.map((item) => (
                    <Chip
                        key={item}
                        variant="outlined"
                        color="primary"
                        size="sm"
                        sx={{ pointerEvents: 'none', my: 1, mx: 0.5 }}
                    >
                        {item}
                    </Chip>
                ))}
            </Box>
        </Stack>
    )
}