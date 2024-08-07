import React, { useState, useEffect } from "react";

import Divider from "@mui/joy/Divider";
import Typography from "@mui/joy/Typography";
import Stack from "@mui/joy/Stack";
import Box from "@mui/joy/Box";
import Grid from "@mui/joy/Grid";

import SimpleInfoCard from "../SimpleInfoCard";

import { fetchResourcesByField } from "../../utils/DataRetrieval";

export default function RelatedResourcesList(props) {
  const title = props.title;
  const relatedResourceType = props.relatedResourceType;
  const relatedResourcesIds = props.relatedResourcesIds;

  const [relatedResources, setRelatedResources] = useState([]);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (relatedResourcesIds) {
        if (relatedResourcesIds.length !== 0) {
          const resources = await fetchResourcesByField(
            "_id",
            relatedResourcesIds
          );
          setRelatedResources(resources);
        }
        setIsFinished(true);
      }
    };
    fetchData();
  }, [relatedResourcesIds]);

  // If DataRetriever has returned result, but the result is not an Array, don't render anything.
  if (
    (isFinished && !Array.isArray(relatedResourcesIds)) ||
    (Array.isArray(relatedResourcesIds) && relatedResourcesIds.length == 0)
  ) {
    return null;
  }

  return (
    <Stack spacing={2} sx={{ px: { xs: 2, md: 4 }, py: 3 }}>
      <Typography id="" level="h5" fontWeight="lg" mb={1}>
        {title}
      </Typography>
      <Divider inset="none" />
      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={2}>
          {relatedResources?.map((relatedResource) => (
            <Grid
              key={relatedResource._id}
              xs={6}
              display="flex"
              justifyContent="center"
              alignItems="center"
              minHeight={180}
            >
              <SimpleInfoCard
                key={relatedResource._id}
                cardtype={relatedResource["resource-type"] + "s"}
                pageId={relatedResource._id}
                title={relatedResource.title}
                thumbnailImage={relatedResource["thumbnail-image"]}
                minHeight={"100%"}
              />
            </Grid>
          ))}
        </Grid>
      </Box>
    </Stack>
  );
}
