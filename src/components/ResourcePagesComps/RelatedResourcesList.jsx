import React, { useState, useEffect } from 'react';

import Divider from '@mui/joy/Divider';
import Typography from '@mui/joy/Typography';
import Stack from '@mui/joy/Stack';
import List from '@mui/joy/List';
import Link from '@mui/joy/Link';

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

    // If DataRetriever has returned result, but the result is not an Array, don't render anything.
    if (isFinished && !Array.isArray(relatedResourcesIds) || (Array.isArray(relatedResourcesIds) && relatedResourcesIds.length == 0)) {
        return null;
    }

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
                {relatedResourcesIds?.map((relatedResourcesId) => (
                    <Link key={relatedResourcesId} href={'/notebooks/${relatedResourcesId}'} sx={{ color: 'text.tertiary' }}>
                        <Typography textColor="#0f64c8" sx={{ textDecoration: 'underline', py: 0.5 }}>
                            {isFinished && extractValueFromJSON('id', relatedResourcesId, 'title', relatedResources)}
                        </Typography>
                    </Link>
                ))}
            </List>
        </Stack>
    )
}