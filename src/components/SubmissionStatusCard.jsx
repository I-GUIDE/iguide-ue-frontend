import React from 'react';

import Box from '@mui/joy/Box';
import Divider from '@mui/joy/Divider';
import Button from '@mui/joy/Button';
import Card from '@mui/joy/Card';
import CardContent from '@mui/joy/CardContent';
import Typography from '@mui/joy/Typography';
import Stack from '@mui/joy/Stack';

import '../utils/UserManager';

export default function SubmissionStatusCard(props) {
    const submissionStatus = props.submissionStatus;
    let submissionStatusText = '';

    // Display the submission status
    switch (submissionStatus) {
        case 'initial-succeeded':
            submissionStatusText = 'Thank you for your contribution! You are all set!';
            break;
        case 'initial-failed':
            submissionStatusText = 'Submission failed. Please try again!';
            break;
        case 'update-succeeded':
            submissionStatusText = 'Thank you for your update! You are all set!';
            break;
        case 'update-failed':
            submissionStatusText = 'Your update failed. Pleaase try again!';
            break;
        case 'unauthorized':
            submissionStatusText = 'You have to login as the contributor to update this element!';
            break;
        default:
            submissionStatusText = 'Submission status unknown...';
    }

    return (
        <Box
            sx={{
                maxWidth: 500,
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
                <CardContent sx={{ alignItems: 'center', textAlign: 'center' }}>
                    <Box sx={{ p: 2, display: 'flex', gap: 1.5, '& > button': { flex: 1 } }}>
                        <Typography level="h4">
                            {submissionStatusText}
                        </Typography>
                    </Box>
                    <Divider />
                    <Stack
                        direction="row"
                        flexWrap="wrap"
                        alignItems="center"
                        justifyContent="center"
                        spacing={2}
                        useFlexGap
                        sx={{ p: 2 }}
                    >
                        <Button component="a" href="/" variant="outlined" color="neutral">
                            Go back to homepage
                        </Button>
                        <Button component="a" href="/user-profile" variant="solid" color="primary">
                            Go to user profile
                        </Button>
                    </Stack>
                </CardContent>
            </Card>
        </Box>
    )
}