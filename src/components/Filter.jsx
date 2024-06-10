import * as React from 'react';
import Stack from '@mui/joy/Stack';
import Card from '@mui/joy/Card';
import Checkbox from '@mui/joy/Checkbox';
import Typography from '@mui/joy/Typography';

export default function Filter(props) {
    // Get the list of items for the filter
    const itemList = props.filterList
    // Get the number of items
    const itemNum = itemList.length

    const [selection, setSelection] = React.useState(Array(itemNum).fill(false));

    // When the checkbox is clicked, update the selection state
    function handleCheckBoxChange(id) {
        const newSelection = selection.map((c, i) => {
            if (i === id) {
                return !c;
            } else {
                return c;
            }
        });
        setSelection(newSelection);
    }

    // Generate the current checkbox list view in React
    const checkBoxList = selection.map((c, i) => {
        return (
            <Checkbox
                key={i}
                label={itemList[i]}
                checked={c}
                onChange={() => {
                    handleCheckBoxChange(i);
                }}
            />
        );
    })

    return (
        <Stack spacing={1}>
            <Card size="lg">
                <Typography level="h2" fontSize="xl" sx={{ mb: 0.5 }}>
                    Filtered by {props.filterType}
                </Typography>
                {checkBoxList}
            </Card>
        </Stack>
    );
}