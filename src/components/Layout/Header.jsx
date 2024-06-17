import * as React from 'react';
import Stack from '@mui/joy/Stack';
import Typography from '@mui/joy/Typography';
import { Container } from '@mui/joy';

import Box from '@mui/joy/Box';
import Card from '@mui/joy/Card';
import CardCover from '@mui/joy/CardCover';
import CardContent from '@mui/joy/CardContent';

export default function Header(props) {
    return (
        <Box
            sx={{ display: 'flex', flexWrap: 'wrap', p: 0, m: 0, height: 150 }}
        >
            <Card component="li" sx={{ borderRadius: 0, minWidth: 300, flexGrow: 1 }}>
                <CardCover>
                    <img
                        src="/images/green-blue.png"
                        srcSet="/images/green-blue.png 2x"
                        loading="lazy"
                        alt=""
                    />
                </CardCover>
                <CardContent>
                    <Container maxWidth="xl">
                        <Stack sx={{ m: 3 }}>
                            <Stack direction="row" justifyContent="space-between" sx={{ width: '100%' }}>
                                <Typography level="h2" textColor="#fff">
                                    {props.title}
                                </Typography>
                            </Stack>
                            <Typography level="body-md" textColor="#fff">
                                {props.subtitle}
                            </Typography>
                        </Stack>
                    </Container>
                </CardContent>
            </Card>
        </Box>
    );
}
