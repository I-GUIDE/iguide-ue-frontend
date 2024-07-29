import * as React from 'react';

import AspectRatio from '@mui/joy/AspectRatio';
import Link from '@mui/joy/Link';
import Card from '@mui/joy/Card';
import CardContent from '@mui/joy/CardContent';
import CardOverflow from '@mui/joy/CardOverflow';
import Chip from '@mui/joy/Chip';
import Box from '@mui/joy/Box';
import Typography from '@mui/joy/Typography';

import { printListWithDelimiter } from '../helpers/helper';
import { RESOURCE_TYPE_COLORS, RESOURCE_TYPE_NAMES } from '../configs/ResourceTypes';

export default function InfoCard(props) {
    const thumbnailImage = props.thumbnailImage;
    const title = props.title;
    const authors = props.authors;
    const cardType = props.cardtype;
    const pageid = props.pageid;
    const tags = props.tags;
    const contents = props.contents;

    const categoryColor = RESOURCE_TYPE_COLORS[cardType];
    const categoryName = RESOURCE_TYPE_NAMES[cardType];

    return (
        <Card
            variant="outlined"
            orientation="horizontal"
            sx={{
                width: "100%",
                height: 220,
                '&:hover': { boxShadow: 'md', borderColor: 'neutral.outlinedHoverBorder' },
            }}
        >
            {/* Only display the thumbnail when the width is wider than 900px */}
            <AspectRatio ratio="1" sx={{ width: 190, display: { xs: 'none', sm: 'none', md: 'flex' } }}>
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
                    }}
                >
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
                    }}
                >
                    Author{authors.length > 1 && 's'}:&nbsp;
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
                    {tags?.map((tag) => {
                        // Make sure that the tag only renders when it has content
                        if (tag && tag !== '') {
                            return (
                                <Chip
                                    key={tag}
                                    variant="outlined"
                                    color="primary"
                                    size="sm"
                                    sx={{ pointerEvents: 'none', my: 1, mx: 0.5 }}
                                >
                                    {tag}
                                </Chip>
                            )
                        }
                    })}
                </Box>
            </CardContent>
            <CardOverflow
                variant="soft"
                color={categoryColor}
                sx={{
                    px: 0.2,
                    writingMode: 'vertical-rl',
                    justifyContent: 'center',
                    fontSize: 'xs',
                    fontWeight: 'xl',
                    letterSpacing: '1px',
                    textTransform: 'uppercase',
                    borderLeft: '1px solid',
                    borderColor: 'divider',
                }}
            >
                {categoryName}
            </CardOverflow>
        </Card>
    );
}