import React, { useState, useEffect } from 'react';

import Divider from '@mui/joy/Divider';
import Typography from '@mui/joy/Typography';
import Stack from '@mui/joy/Stack';
import List from '@mui/joy/List';
import Link from '@mui/joy/Link';

import { fetchResourcesByField } from '../../utils/DataRetrieval';

export default function OerExternalLinkList(props) {
    const oerExternalLinks = props.oerExternalLinks;

    if (!Array.isArray(oerExternalLinks) || oerExternalLinks.length === 0) {
        return null;
    }

    return (
        <Stack spacing={2} sx={{ px: { xs: 2, md: 4 }, py: 3 }}>
            <Typography
                id=""
                level="h5"
                fontWeight="lg"
                mb={1}
            >
                External Links
            </Typography>
            <Divider inset="none" />
            <List aria-labelledby="decorated-list-demo">
                {oerExternalLinks?.map((oerExternalLink, idx) => (
                    <Link key={idx} href={oerExternalLink.url} sx={{ color: 'text.tertiary' }}>
                        <Typography textColor="#0f64c8" sx={{ textDecoration: 'underline', py: 0.5 }}>
                            {oerExternalLink.title}
                        </Typography>
                    </Link>
                ))}
            </List>
        </Stack>
    )
}