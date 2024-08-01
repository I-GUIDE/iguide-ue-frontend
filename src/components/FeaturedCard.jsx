import * as React from 'react';

import AspectRatio from '@mui/joy/AspectRatio';
import Link from '@mui/joy/Link';
import Card from '@mui/joy/Card';
import CardContent from '@mui/joy/CardContent';
import CardOverflow from '@mui/joy/CardOverflow';
import Typography from '@mui/joy/Typography';
import Stack from '@mui/joy/Stack';

import { RESOURCE_TYPE_COLORS, RESOURCE_TYPE_NAMES } from '../configs/ResourceTypes';

export default function FeaturedCard(props) {
    const thumbnailImage = props.thumbnailImage;
    const title = props.title;
    const contents = props.contents;
    const cardType = props.cardtype;
    const pageid = props.pageid;

    const categoryColor = RESOURCE_TYPE_COLORS[cardType];
    const categoryName = RESOURCE_TYPE_NAMES[cardType];

    return (
        <Card
            variant="outlined"
            sx={{
                width: 300,
                minHeight: 210,
                '&:hover': {
                    borderColor: 'theme.vars.palette.primary.outlinedHoverBorder',
                    transform: 'translateY(-2px)',
                }
            }}
        >
            <CardOverflow>
                <AspectRatio ratio="2">
                    <img
                        src={thumbnailImage}
                        loading="lazy"
                        alt="thumbnail"
                    />
                </AspectRatio>
            </CardOverflow>
            <CardContent>
                <Link
                    overlay
                    underline="none"
                    href={"/" + cardType + "/" + pageid}
                    sx={{ color: 'text.tertiary' }}
                >
                    <Stack>
                        <Typography
                            level="title-sm"
                            textColor='#000'
                            sx={{
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                display: '-webkit-box',
                                WebkitLineClamp: '2',
                                WebkitBoxOrient: 'vertical',
                            }}
                        >
                            {title}
                        </Typography>
                    </Stack>
                </Link>
            </CardContent>
            <CardOverflow
                variant="soft"
                color={categoryColor}
                sx={{
                    px: 2,
                    py: 1,
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