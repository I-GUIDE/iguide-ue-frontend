import * as React from 'react';

import AspectRatio from '@mui/joy/AspectRatio';
import Link from '@mui/joy/Link';
import Card from '@mui/joy/Card';
import CardContent from '@mui/joy/CardContent';
import CardOverflow from '@mui/joy/CardOverflow';
import Typography from '@mui/joy/Typography';

import IconButton from '@mui/joy/IconButton';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';

import { printListWithDelimiter } from '../helpers/helper';

export default function FeaturedCard(props) {
    const thumbnailImage = props.thumbnailImage;
    const title = props.title;
    const authors = props.authors;
    const cardType = props.cardtype;
    const pageid = props.pageid;

    var categoryColor = '';
    var categoryName = '';
    switch (cardType) {
        case 'datasets':
            categoryName = 'dataset';
            categoryColor = 'primary';
            break;
        case 'notebooks':
            categoryName = 'notebook';
            categoryColor = 'success';
            break;
        case 'publications':
            categoryName = 'publication';
            categoryColor = 'warning';
            break;
        case 'oers':
            categoryName = 'Educational Resource';
            categoryColor = 'danger';
            break;
        default:
            console.log("error");
    }

    return (
        <Card variant="outlined" sx={{ width: 320, minHeight: 350 }}>
            <CardOverflow>
                <AspectRatio ratio="2">
                    <img
                        src={thumbnailImage}
                        loading="lazy"
                        alt="thumbnail"
                    />
                </AspectRatio>
                <IconButton
                    aria-label="Like minimal photography"
                    size="md"
                    variant="solid"
                    color={categoryColor}
                    sx={{
                        position: 'absolute',
                        zIndex: 2,
                        borderRadius: '50%',
                        right: '1rem',
                        bottom: 0,
                        transform: 'translateY(50%)',
                    }}
                >
                    <AutoAwesomeIcon />
                </IconButton>
            </CardOverflow>
            <CardContent>
                <Typography level="title-md">{title}</Typography>
                <Typography level="body-sm">
                    <Link
                        overlay
                        underline="none"
                        href={"/" + cardType + "/" + pageid}
                        sx={{ color: 'text.tertiary' }}
                    >
                        {printListWithDelimiter(authors, ',')}
                    </Link>
                </Typography>
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