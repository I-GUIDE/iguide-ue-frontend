import * as React from 'react';
import Stack from '@mui/joy/Stack';
import Typography from '@mui/joy/Typography';

export default function Header(props) {
    return (
        <Stack sx={{ mb: 2 }}>
            <Stack direction="row" justifyContent="space-between" sx={{ width: '100%' }}>
                <Typography level="h2">{props.title}</Typography>
            </Stack>
            <Typography level="body-md" color="neutral">
                {props.subtitle}
            </Typography>
        </Stack>
    );
}
