import React, { useState, useEffect } from "react";

import Divider from "@mui/joy/Divider";
import Typography from "@mui/joy/Typography";
import Stack from "@mui/joy/Stack";
import List from "@mui/joy/List";
import Link from "@mui/joy/Link";

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
      <List aria-labelledby="decorated-list-demo">
        {relatedResources?.map((relatedResource) => (
          <Link
            key={relatedResource._id}
            href={
              "/" +
              relatedResource["resource-type"] +
              "s/" +
              relatedResource._id
            }
            sx={{ color: "text.tertiary" }}
          >
            <Typography
              textColor="#0f64c8"
              sx={{ textDecoration: "underline", py: 0.5 }}
            >
              {isFinished && relatedResource.title}
            </Typography>
          </Link>
        ))}
      </List>
    </Stack>
  );
}
