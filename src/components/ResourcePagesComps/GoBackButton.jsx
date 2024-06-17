import * as React from 'react';

import Link from '@mui/joy/Link';
import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';

export default function GoBackButton(props) {
    const parentPage = props.parentPage;

    return (
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <Button size="sm">
                <Link
                    underline="none"
                    href={parentPage}
                    sx={{ color: 'inherit' }}
                >
                    Go Back
                </Link>
            </Button>
        </Box>
    )
}