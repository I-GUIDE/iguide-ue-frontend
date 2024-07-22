import React from 'react';

import Box from '@mui/joy/Box';
import Divider from '@mui/joy/Divider';
import Button from '@mui/joy/Button';
import Card from '@mui/joy/Card';
import CardContent from '@mui/joy/CardContent';
import Typography from '@mui/joy/Typography';
import '../utils/UserManager';

export default function UserProfileEditStatusCard(props) {
    const userProfileSubmissionStatus = props.userProfileSubmissionStatus;
    let submissionStatusText = '';

    // Display the submission status
    switch (userProfileSubmissionStatus) {
        case 'update-succeeded':
            submissionStatusText = 'Thank you for updating your profile! You are all set!';
            break;
        case 'update-failed':
            submissionStatusText = 'Your profile update failed... Please try again later!';
            break;
        default:
            submissionStatusText = 'Profile update status unknown...';
    }

    return (
        <Box
            sx={{
                width: 500,
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
                    <Box sx={{ py: 2, display: 'flex', gap: 1.5, '& > button': { flex: 1 } }}>
                        <Typography fontSize="xl" fontWeight="lg">
                            {submissionStatusText}
                        </Typography>
                    </Box>
                    <Divider />
                    <Box sx={{ py: 2, display: 'flex', gap: 1.5, '& > button': { flex: 1 } }}>
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