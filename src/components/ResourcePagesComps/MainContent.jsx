import * as React from 'react';

import Typography from '@mui/joy/Typography';
import Stack from '@mui/joy/Stack';

import { printListWithDelimiter } from '../../helpers/helper';

export default function MainContent(props) {
    const title = props.title;
    const authors = props.authors;
    const contents = props.contents;

    return (
        <Stack spacing={2} sx={{ px: { xs: 2, md: 4 }, pt: 2, minHeight: 0 }}>
            <Typography level="h1">{title}</Typography>
            <Typography level="h3" fontSize="xl" sx={{ mb: 0.5 }}>
                Created by {printListWithDelimiter(authors, ',')}
            </Typography>
            <Typography>
                {contents}
            </Typography>
        </Stack>
    )
}