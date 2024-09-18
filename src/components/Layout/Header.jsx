import * as React from "react";

import Stack from "@mui/joy/Stack";
import Typography from "@mui/joy/Typography";
import Container from "@mui/joy/Container";
import Box from "@mui/joy/Box";
import Card from "@mui/joy/Card";
import CardCover from "@mui/joy/CardCover";
import CardContent from "@mui/joy/CardContent";

import { HEADER_HEIGHT } from "../../configs/VarConfigs";
import PageNav from "../PageNav";

export default function Header(props) {
  const title = props.title ? props.title : "";
  const subtitle = props.subtitle ? props.subtitle : "";
  const icon = props.icon;
  const currentPage = props.currentPage;
  const parentPages = props.parentPages;

  return (
    <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
        height: HEADER_HEIGHT,
      }}
    >
      <Card
        variant="plain"
        component="li"
        sx={{ borderRadius: 0, minWidth: 300, flexGrow: 1, p: 1 }}
      >
        <CardCover>
          <img src="/images/header-bg.png" loading="lazy" alt="Gray scale" />
        </CardCover>
        <CardContent>
          <Container maxWidth="xl">
            <Stack spacing={2} sx={{ px: 4, py: 2 }}>
              <PageNav
                parentPages={parentPages}
                currentPage={currentPage}
                fontLevel="body-xs"
                sx={{ px: 0, pb: 4 }}
              />
              {title.length > 30 ? (
                <Typography level="h3" textColor="#000" startDecorator={icon}>
                  {title}
                </Typography>
              ) : (
                <Typography level="h2" textColor="#000" startDecorator={icon}>
                  {title}
                </Typography>
              )}
              <Typography level="body-sm" textColor="#696969">
                {subtitle}
              </Typography>
            </Stack>
          </Container>
        </CardContent>
      </Card>
    </Box>
  );
}
