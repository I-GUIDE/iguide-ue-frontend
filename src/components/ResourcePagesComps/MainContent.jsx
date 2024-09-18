import * as React from "react";

import Typography from "@mui/joy/Typography";
import Stack from "@mui/joy/Stack";
import AspectRatio from "@mui/joy/AspectRatio";
import Grid from "@mui/joy/Grid";
import Link from "@mui/joy/Link";
import Card from "@mui/joy/Card";
import CardCover from "@mui/joy/CardCover";
import CardContent from "@mui/joy/CardContent";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";

import { printListWithDelimiter } from "../../helpers/helper";
import UserAvatar from "../UserAvatar";

export default function MainContent(props) {
  const title = props.title;
  const contributor = props.contributor ? props.contributor : {};
  const authors = props.authors;
  const doi = props.doi;
  const contentsTitle = props.contentsTitle ? props.contentsTitle : "About";
  const contents = props.contents;
  const thumbnailImage = props.thumbnailImage;
  const elementType = props.elementType;

  const contributorAvatar = contributor["avatar-url"];
  const contributorName = contributor.name;
  const contributorUserId = contributor.id;
  const encodedUserId = encodeURIComponent(contributor.id);

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
          {contributorName && (
            <Link
              href={"/contributor/" + encodedUserId}
              style={{ textDecoration: "none" }}
            >
              <Card
                variant="plain"
                orientation="horizontal"
                sx={{
                  maxHeight: "150px",
                  bgcolor: "#fff",
                  p: 0,
                  "&:hover": {
                    borderColor:
                      "theme.vars.palette.primary.outlinedHoverBorder",
                    transform: "translateY(-2px)",
                  },
                }}
              >
                <CardContent>
                  <Stack
                    direction="row"
                    alignItems="center"
                    spacing={2}
                    sx={{ pb: 2 }}
                  >
                    <UserAvatar
                      link={contributorAvatar}
                      userId={contributorUserId}
                    />
                    <Stack direction="column">
                      <Typography level="title-lg">
                        {contributorName}
                      </Typography>
                      <Typography level="body-sm">Contributor</Typography>
                    </Stack>
                  </Stack>
                </CardContent>
              </Card>
            </Link>
          )}
          <Typography level="h2" sx={{ py: 1 }}>
            {title}
          </Typography>
          {authors && authors.length > 0 && (
            <Typography level="body-lg" sx={{ py: 1 }}>
              {printListWithDelimiter(authors, ",")}
            </Typography>
          )}
          {doi && (
            <Link
              href={doi}
              target="_blank"
              rel="noopener noreferrer"
              underline="always"
            >
              <Typography
                level="body-sm"
                startDecorator={<OpenInNewIcon />}
                sx={{ py: 1 }}
              >
                {doi}
              </Typography>
            </Link>
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
        {contentsTitle}
      </Typography>
      <Typography sx={{ py: 2 }}>{contents}</Typography>
    </Stack>
  );
}
