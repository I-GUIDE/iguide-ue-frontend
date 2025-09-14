import { useState, useEffect } from "react";

import Typography from "@mui/joy/Typography";
import Stack from "@mui/joy/Stack";
import Grid from "@mui/material/Grid2";
import Button from "@mui/joy/Button";
import { useTheme } from "@mui/joy";

import useMediaQuery from "@mui/material/useMediaQuery";

import SimpleInfoCard from "../../components/SimpleInfoCard";

export default function RelatedElements(props) {
  const relatedElements = props.relatedElements;

  const theme = useTheme();
  const isSm = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const isMd = useMediaQuery(theme.breakpoints.between("md", "lg"));
  const isLgUp = useMediaQuery(theme.breakpoints.up("lg"));
  const [needToExpand, setNeedToExpand] = useState();
  const [expanded, setExpanded] = useState(false);

  let numberOfElementsVisibleWithoutExpansion;
  if (isSm) {
    numberOfElementsVisibleWithoutExpansion = 4;
  } else if (isMd) {
    numberOfElementsVisibleWithoutExpansion = 6;
  } else if (isLgUp) {
    numberOfElementsVisibleWithoutExpansion = 8;
  } else {
    numberOfElementsVisibleWithoutExpansion = 2;
  }

  // Decide if there is a need to provide expansion...
  useEffect(() => {
    if (!relatedElements) {
      setNeedToExpand(false);
    } else if (
      relatedElements.length <= numberOfElementsVisibleWithoutExpansion
    ) {
      setNeedToExpand(false);
    } else {
      setNeedToExpand(true);
    }
  }, [relatedElements, numberOfElementsVisibleWithoutExpansion]);

  if (
    !Array.isArray(relatedElements) ||
    (Array.isArray(relatedElements) && relatedElements.length === 0)
  ) {
    return null;
  }

  // Visible elements contains all elements when it doesn't need to expand or expanded or empty
  const visibleElements =
    expanded || !relatedElements || !needToExpand
      ? relatedElements
      : relatedElements.slice(0, numberOfElementsVisibleWithoutExpansion);

  return (
    <Stack spacing={2} sx={{ py: 3 }}>
      <Typography level="h5" fontWeight="lg" mb={1}>
        Related elements
      </Typography>
      {visibleElements && visibleElements.length > 0 && (
        <>
          <Grid
            container
            spacing={2}
            columns={12}
            sx={{
              flexGrow: 1,
              width: "100%",
              height: !expanded && needToExpand && 300,
              maskImage:
                !expanded &&
                needToExpand &&
                "linear-gradient(to bottom, black, 80%, transparent)",
              // Bottom fade out for Webkit browsers (Safari)
              WebkitMaskImage:
                !expanded &&
                needToExpand &&
                "linear-gradient(to bottom, black, 80%, transparent)",
            }}
          >
            {visibleElements?.map((element) => (
              <Grid key={element.id} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                <SimpleInfoCard
                  cardtype={element["resource-type"] + "s"}
                  pageId={element.id}
                  title={element.title}
                  thumbnailImage={element["thumbnail-image"]}
                  minHeight="100%"
                  width="100%"
                  showElementType
                />
              </Grid>
            ))}
          </Grid>
          {needToExpand &&
            (!expanded ? (
              <Button
                variant="plain"
                sx={{ my: 1 }}
                onClick={() => setExpanded(true)}
              >
                Show all related elements
              </Button>
            ) : (
              <Button
                variant="plain"
                sx={{ my: 2 }}
                onClick={() => setExpanded(false)}
              >
                Show less
              </Button>
            ))}
        </>
      )}
    </Stack>
  );
}
