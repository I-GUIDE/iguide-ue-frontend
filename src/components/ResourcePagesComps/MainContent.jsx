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
        <Grid xs={12} md={8}>
          <Typography level="h1" sx={{ py: 1 }}>
            {title}
          </Typography>
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
          {authors && authors.length > 0 && (
            <Typography sx={{ py: 1 }}>
              <Typography level="title-lg">
                Author{authors.length > 1 && "s"}:{" "}
              </Typography>
              <Typography level="body-lg">
                {printListWithDelimiter(authors, ",")}
              </Typography>
            </Typography>
          )}
          <Typography sx={{ py: 1 }}>{contents}</Typography>
        </Grid>
        <Grid xs={12} md={4}>
          <AspectRatio variant="outlined" maxHeight={280} sx={{ py: 1 }}>
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
    </Stack>
  );
}
