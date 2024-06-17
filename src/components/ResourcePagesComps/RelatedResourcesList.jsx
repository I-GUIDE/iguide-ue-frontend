import React, { useState, useEffect } from 'react';

import Divider from '@mui/joy/Divider';
import Typography from '@mui/joy/Typography';
import Stack from '@mui/joy/Stack';
import List from '@mui/joy/List';
import ListItem from '@mui/joy/ListItem';
import ListItemButton from '@mui/joy/ListItemButton';
import { Link } from '@mui/joy';

import { extractValueFromJSON, printListWithDelimiter } from '../../helpers/helper';
import { DataRetriever } from '../../utils/DataRetrieval';

export default function RelatedResourcesList(props) {
    const title = props.title;
    const relatedResourceType = props.relatedResourceType;
    const relatedResourcesIds = props.relatedResourcesIds;

    const [relatedResources, setRelatedResources] = useState([]);
    const [isFinished, setIsFinished] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            const resources = await DataRetriever(relatedResourceType);
            setRelatedResources(resources);
            setIsFinished(true);
        };
        fetchData();
    }, []);

    return (
        <Stack spacing={2} sx={{ px: { xs: 2, md: 4 }, pt: 2, minHeight: 0 }}>
            <Typography
                id=""
                level="h5"
                fontWeight="lg"
                mb={1}
            >
                {title}
            </Typography>
            <Divider inset="none" />
            <List aria-labelledby="decorated-list-demo">
                {relatedResourcesIds.map((relatedResourcesId) => (
                    <Link
                        key={relatedResourcesId}
                        underline="none"
                        href={`/notebooks/${relatedResourcesId}`}
                        sx={{ color: 'text.tertiary' }}
                    >
                        <ListItem>
                            <ListItemButton>
                                {isFinished && extractValueFromJSON('id', relatedResourcesId, 'title', relatedResources)}
                            </ListItemButton>
                        </ListItem>
                    </Link>
                ))}
            </List>
        </Stack>
    )
}