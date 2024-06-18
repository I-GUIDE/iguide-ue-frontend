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
            <Grid
                container
                rowSpacing={2}
                columnSpacing={8}
                alignItems="center"
            >
                <Grid xs={12} md={8}>
                    <Typography level="h1" sx={{ py: 1 }}>{title}</Typography>
                    <Typography level="h4" sx={{ py: 1 }}>
                        Contributed by {printListWithDelimiter(authors, ',')}
                    </Typography>
                    <Typography sx={{ py: 1 }}>
                        {contents}
                    </Typography>
                </Grid>
                <Grid xs={12} md={4}>
                    <AspectRatio variant="outlined" maxHeight={280} sx={{ py: 1 }}>
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