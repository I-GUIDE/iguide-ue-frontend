import * as React from 'react';

import AspectRatio from '@mui/joy/AspectRatio';
import Link from '@mui/joy/Link';
import Card from '@mui/joy/Card';
import CardContent from '@mui/joy/CardContent';
import Chip from '@mui/joy/Chip';
import Box from '@mui/joy/Box';
import Typography from '@mui/joy/Typography';

import { printListWithDelimiter } from '../helpers/helper';

export default function InfoCard(props) {
    const thumbnailImage = props.thumbnailImage;
    const title = props.title;
    const authors = props.authors;
    const cardType = props.cardtype;
    const pageid = props.pageid;
    const tags = props.tags;
    const contents = props.contents;

    return (
        <Card
            variant="outlined"
            orientation="horizontal"
            sx={{
                width: "100%",
                height: 280,
                '&:hover': { boxShadow: 'md', borderColor: 'neutral.outlinedHoverBorder' },
            }}
        >
            {/* Only display the thumbnail when the width is wider than 900px */}
            <AspectRatio ratio="1" sx={{ width: 240, display: { xs: 'none', sm: 'none', md: 'flex' } }}>
                <img
                    src={thumbnailImage}
                    loading="lazy"
                    alt="thumbnail"
                />
            </AspectRatio>

            <CardContent>
                <Typography
                    level="title-lg"
                    id="card-description"
                    sx={{
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        display: "-webkit-box",
                        WebkitLineClamp: "1",
                        WebkitBoxOrient: "vertical",
                        m: 0.5
                    }}>
                    {title}
                </Typography>
                <Typography
                    level="title-md"
                    aria-describedby="card-description"
                    sx={{
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        display: "-webkit-box",
                        WebkitLineClamp: "1",
                        WebkitBoxOrient: "vertical",
                        m: 0.5
                    }}>
                    {authors.length == 1 ? 'Author:' : 'Authors:'}&nbsp;
                    <Link
                        overlay
                        underline="none"
                        href={"/" + cardType + "/" + pageid}
                        sx={{ color: 'text.tertiary' }}
                    >
                        {printListWithDelimiter(authors, ',')}
                    </Link>
                </Typography>
                <Typography
                    level="body-sm"
                    sx={{
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        display: "-webkit-box",
                        WebkitLineClamp: "2",
                        WebkitBoxOrient: "vertical",
                        m: 0.5
                    }}
                >
                    {contents}
                </Typography>
                <Box
                    direction="row"
                    justifyContent="flex-start"
                    alignItems="flex-end"
                    spacing={1}
                >
                    {tags.map((tag) => (
                        <Chip
                            key={tag}
                            variant="outlined"
                            color="primary"
                            size="sm"
                            sx={{ pointerEvents: 'none', my: 1, mx: 0.5 }}
                        >
                            {tag}
                        </Chip>
                    ))}
                </Box>
            </CardContent>
        </Card>
    );
}