import * as React from 'react';
import Stack from '@mui/joy/Stack';
import Card from '@mui/joy/Card';
import Checkbox from '@mui/joy/Checkbox';
import Typography from '@mui/joy/Typography';

export default function Filter(props) {
    return (
        <Stack spacing={1}>
            <Card size="lg">
                <Typography level="h2" fontSize="xl" sx={{ mb: 0.5 }}>
                    Filtered by {props.filterType}
                </Typography>
                {props.filterList.map(item => (
                    <Checkbox label={item} />
                ))}
            </Card>
        </Stack>
    );
}