import * as React from 'react';

import Typography from '@mui/joy/Typography';
import Stack from '@mui/joy/Stack';
import AspectRatio from '@mui/joy/AspectRatio';
import Grid from '@mui/joy/Grid';

import { printListWithDelimiter } from '../../helpers/helper';

export default function MainContent(props) {
    const title = props.title;
    const authors = props.authors;
    const contents = props.contents;
    const thumbnailImage = props.thumbnailImage;

    return (
        <Stack spacing={2} sx={{ px: { xs: 2, md: 4 }, pt: 2, minHeight: 0 }}>
            <Typography level="h1">{title}</Typography>
            <Typography level="h3" fontSize="xl" sx={{ mb: 0.5 }}>
                Contributed by {printListWithDelimiter(authors, ',')}
            </Typography>
            <Grid
                container
                rowSpacing={2}
                sx={{
                    backgroundColor: 'inherit',
                }}
            >
                <Grid xs={12} md={8}>
                    <Typography>
                        {contents}
                    </Typography>
                </Grid>
                <Grid xs={12} md={4}>
                    <AspectRatio variant="outlined" maxHeight={280} sx={{ px: 2 }}>
                        <img
                            src={thumbnailImage}
                            loading="lazy"
                            alt="thumbnail"
                        />
                    </AspectRatio>
                </Grid>
            </Grid>
        </Stack>
    )
}