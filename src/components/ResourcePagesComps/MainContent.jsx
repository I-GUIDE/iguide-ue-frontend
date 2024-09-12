import * as React from "react";

import Typography from "@mui/joy/Typography";
import Stack from "@mui/joy/Stack";
import AspectRatio from "@mui/joy/AspectRatio";
import Grid from "@mui/joy/Grid";

import { printListWithDelimiter } from "../../helpers/helper";
import UserAvatar from "../UserAvatar";

export default function MainContent(props) {
  const title = props.title;
  const contributor = props.contributor ? props.contributor : {};
  const authors = props.authors;
  const contents = props.contents;
  const thumbnailImage = props.thumbnailImage;
  const elementType = props.elementType;

  const contributorAvatar = contributor["avatar-url"];
  const contributorName = contributor.name;
  const contributorUserId = contributor.id;

  return (
    <Stack sx={{ px: { xs: 2, md: 4 }, py: 3 }}>
      <Grid
        container
        rowSpacing={2}
        columnSpacing={8}
        alignItems="flex-start"
        sx={{ py: 2 }}
      >
        <Grid xs={12} md={8}>
          <Stack direction="row" alignItems="center" spacing={2} sx={{ pb: 2 }}>
            <UserAvatar link={contributorAvatar} userId={contributorUserId} />
            <Stack direction="column">
              <Typography level="title-lg">{contributorName}</Typography>
              <Typography level="body-sm">Contributor</Typography>
            </Stack>
          </Stack>
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
        <Grid xs={12} md={4}>
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
