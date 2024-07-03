import React from 'react';

import Box from '@mui/joy/Box';
import Divider from '@mui/joy/Divider';
import Button from '@mui/joy/Button';
import Card from '@mui/joy/Card';
import CardContent from '@mui/joy/CardContent';
import Typography from '@mui/joy/Typography';
import '../utils/UserManager';

export default function SubmissionStatusCard(props) {
    const submissionStatus = props.submissionStatus;

    return (
        <Box
            sx={{
                width: '100%',
                position: 'relative',
                overflow: { xs: 'auto', sm: 'initial' },
            }}
        >
            <Card
                variant="outlined"
                orientation="horizontal"
                sx={{
                    width: "100%",
                    '&:hover': { boxShadow: 'md', borderColor: 'neutral.outlinedHoverBorder' },
                }}
            >
                <CardContent>
                    <Typography fontSize="xl" fontWeight="lg">
                        {submissionStatus === 'success' ? "Thank you for your contribution!" : "Submission failed..." }
                    </Typography>
                    <Divider inset="none" />
                    <Box sx={{ display: 'flex', gap: 1.5, '& > button': { flex: 1 } }}>
                        <Button component="a" href="/" variant="outlined" color="neutral">
                            Go back to homepage
                        </Button>
                        <Button component="a" href="/user_profile" variant="solid" color="primary">
                            Go to user profile
                        </Button>
                    </Box>
                </CardContent>
            </Card>
        </Box>
    )
}