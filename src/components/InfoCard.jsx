import * as React from 'react';

import AspectRatio from '@mui/joy/AspectRatio';
import Link from '@mui/joy/Link';
import Card from '@mui/joy/Card';
import CardContent from '@mui/joy/CardContent';
import Chip from '@mui/joy/Chip';
import Box from '@mui/joy/Box';
import Typography from '@mui/joy/Typography';

export default function InfoCard(props) {
    return (
        <Card
            variant="outlined"
            orientation="horizontal"
            sx={{
                width: "100%",
                '&:hover': { boxShadow: 'md', borderColor: 'neutral.outlinedHoverBorder' },
            }}
        >
            <AspectRatio ratio="1" sx={{ width: "10%" }}>
                <img
                    src="https://images.unsplash.com/photo-1507833423370-a126b89d394b?auto=format&fit=crop&w=90"
                    srcSet="https://images.unsplash.com/photo-1507833423370-a126b89d394b?auto=format&fit=crop&w=90&dpr=2 2x"
                    loading="lazy"
                    alt=""
                />
            </AspectRatio>
            <CardContent>
                <Typography level="title-lg" id="card-description">
                    {props.title}
                </Typography>
                <Typography level="body-sm" aria-describedby="card-description" mb={1}>
                    <Link
                        overlay
                        underline="none"
                        href="#interactive-card"
                        sx={{ color: 'text.tertiary' }}
                    >
                        {props.subtitle}
                    </Link>
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                    {props.tags.map((tag) => (
                        <Chip
                            key={tag}
                            variant="outlined"
                            color="primary"
                            size="sm"
                            sx={{ pointerEvents: 'none' }}
                        >
                            {tag}
                        </Chip>
                    ))}
                </Box>
                <Typography>
                    {props.contents}
                </Typography>
            </CardContent>
        </Card>
    );
}