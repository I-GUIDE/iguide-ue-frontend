import React from "react";
import Carousel from "react-multi-carousel";

import Divider from "@mui/joy/Divider";
import Typography from "@mui/joy/Typography";
import Stack from "@mui/joy/Stack";
import Box from "@mui/joy/Box";

import SimpleInfoCard from "../SimpleInfoCard";

import "react-multi-carousel/lib/styles.css";

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

  const responsive = {
    desktop: {
      breakpoint: { max: 5000, min: 1200 },
      items: 3,
    },
    desktopNarrow: {
      breakpoint: { max: 1200, min: 900 },
      items: 2,
    },
    tablet: {
      breakpoint: { max: 900, min: 650 },
      items: 3,
    },
    mobile: {
      breakpoint: { max: 650, min: 400 },
      items: 2,
    },
    mobileSmall: {
      breakpoint: { max: 400, min: 0 },
      items: 1,
    },
  };

  return (
    <Stack spacing={2} sx={{ px: { xs: 2, md: 4 }, py: 3 }}>
      <Typography level="h5" fontWeight="lg" mb={1}>
        {title}
      </Typography>
      <Divider inset="none" />
      <Carousel responsive={responsive}>
        {relatedElements?.map((relatedElement) => (
          <Box
            key={relatedElement.id}
            sx={{ p: 0.5 }}
            justifyContent="center"
            alignItems="center"
          >
            <SimpleInfoCard
              cardtype={relatedElement["resource-type"] + "s"}
              pageId={relatedElement.id}
              title={relatedElement.title}
              thumbnailImage={relatedElement["thumbnail-image"]}
              minHeight="100%"
              width="100%"
            />
          </Box>
        ))}
      </Carousel>
    </Stack>
  );
}
