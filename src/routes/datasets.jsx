import React from 'react';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';

const Datasets = () => {
    return (
        <Container maxWidth="xl">
            <Typography
                variant="h6"
                sx={{
                    mr: 2,
                    display: { xs: 'none', md: 'flex' },
                    letterSpacing: '.2rem',
                    color: 'inherit',
                    textDecoration: 'none',
                }}
            >
                There will be a list of datasets
            </Typography>
        </Container>
    )
}

export default Datasets;