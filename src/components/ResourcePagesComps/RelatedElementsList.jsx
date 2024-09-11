import React from "react";

import Divider from "@mui/joy/Divider";
import Typography from "@mui/joy/Typography";
import Stack from "@mui/joy/Stack";
import Box from "@mui/joy/Box";
import Grid from "@mui/joy/Grid";

import SimpleInfoCard from "../SimpleInfoCard";

export default function RelatedElementsList(props) {
  const title = props.title;
  const relatedElements = props.relatedElements;

  // If DataRetriever has returned result, but the result is not an Array, don't render anything.
  if (
    !Array.isArray(relatedElements) ||
    (Array.isArray(relatedElements) && relatedElements.length == 0)
  ) {
    return null;
  }

  return (
    <Stack spacing={2} sx={{ px: { xs: 2, md: 4 }, py: 3 }}>
      <Typography level="h5" fontWeight="lg" mb={1}>
        {title}
      </Typography>
      <Divider inset="none" />
      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={2}>
          {relatedElements?.map((relatedElement) => (
            <Grid
              key={relatedElement.id}
              xs={12}
              sm={6}
              display="flex"
              justifyContent="center"
              alignItems="center"
              minHeight={180}
              sx={{ p: 3 }}
            >
              <SimpleInfoCard
                key={relatedElement.id}
                cardtype={relatedElement["resource-type"] + "s"}
                pageId={relatedElement.id}
                title={relatedElement.title}
                thumbnailImage={relatedElement["thumbnail-image"]}
                minHeight="100%"
                width="100%"
              />
            </Grid>
          ))}
        </Grid>
      </Box>
    </Stack>
  );
}
