import * as React from "react";

import Typography from "@mui/joy/Typography";
import Stack from "@mui/joy/Stack";
import AspectRatio from "@mui/joy/AspectRatio";
import Grid from "@mui/joy/Grid";

import { printListWithDelimiter } from "../../helpers/helper";

export default function MainContent(props) {
  const title = props.title;
  const contributors = props.contributors;
  const authors = props.authors;
  const contents = props.contents;
  const thumbnailImage = props.thumbnailImage;
  const elementType = props.elementType;

  return (
    <Stack sx={{ px: { xs: 2, md: 4 }, py: 3 }}>
      <Grid container rowSpacing={2} columnSpacing={8} alignItems="center">
        <Grid xs={12} md={7}>
          {contributors && contributors.length > 0 && (
            <Typography sx={{ py: 1 }}>
              <Typography level="title-lg">
                Contributor{contributors.length > 1 && "s"}:{" "}
              </Typography>
              <Typography level="body-lg">
                {printListWithDelimiter(contributors, ",")}
              </Typography>
            </Typography>
          )}
          <Typography level="h1" sx={{ py: 1 }}>
            {title}
          </Typography>
          {authors && authors.length > 0 && (
            <Typography sx={{ py: 1 }}>
              <Typography level="body-lg">
                {printListWithDelimiter(authors, ",")}
              </Typography>
            </Typography>
          )}
        </Grid>
        <Grid xs={12} md={5}>
          <AspectRatio
            variant="outlined"
            sx={{ py: 1, borderRadius: "lg", height: "100%" }}
          >
            {thumbnailImage ? (
              <img src={thumbnailImage} loading="lazy" alt="thumbnail" />
            ) : (
              <img
                src={`/default-images/${elementType}.png`}
                loading="lazy"
                alt="deafult-thumbnail"
              />
            )}
          </AspectRatio>
        </Grid>
      </Grid>
      <Typography level="h4" sx={{ pt: 2 }}>
        About
      </Typography>
      <Typography sx={{ py: 2 }}>{contents}</Typography>
    </Stack>
  );
}
