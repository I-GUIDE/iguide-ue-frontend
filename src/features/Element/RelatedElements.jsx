import React from "react";
import Carousel from "react-multi-carousel";

import Divider from "@mui/joy/Divider";
import Typography from "@mui/joy/Typography";
import Stack from "@mui/joy/Stack";
import Box from "@mui/joy/Box";

import SimpleInfoCard from "../../components/SimpleInfoCard";

import "react-multi-carousel/lib/styles.css";

export default function RelatedElements(props) {
  const relatedElements = props.relatedElements;

  if (
    !Array.isArray(relatedElements) ||
    (Array.isArray(relatedElements) && relatedElements.length === 0)
  ) {
    return null;
  }

  const responsive = {
    md: {
      breakpoint: { max: 5000, min: 900 },
      items: 3,
      slidesToSlide: 3,
    },
    sm: {
      breakpoint: { max: 900, min: 600 },
      items: 2,
      slidesToSlide: 2,
    },
    xs: {
      breakpoint: { max: 600, min: 0 },
      items: 1,
    },
  };

  return (
    <Stack spacing={2} sx={{ px: { xs: 2, md: 4 }, py: 3 }}>
      <Typography level="h5" fontWeight="lg" mb={1}>
        Related elements
      </Typography>
      <Divider inset="none" />
      <Carousel responsive={responsive} centerMode>
        {relatedElements?.map((relatedElement) => (
          <Box
            key={relatedElement.id}
            justifyContent="center"
            alignItems="center"
            sx={{ p: 0.5, height: "100%" }}
          >
            <SimpleInfoCard
              cardtype={relatedElement["resource-type"]}
              pageId={relatedElement.id}
              title={relatedElement.title}
              thumbnailImage={relatedElement["thumbnail-image"]}
              minHeight="100%"
              width="100%"
              showElementType
            />
          </Box>
        ))}
      </Carousel>
    </Stack>
  );
}
