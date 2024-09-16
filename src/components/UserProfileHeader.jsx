import React, { useState, useEffect, useRef } from "react";

import Stack from "@mui/joy/Stack";
import Typography from "@mui/joy/Typography";
import Container from "@mui/joy/Container";
import Grid from "@mui/joy/Grid";
import Box from "@mui/joy/Box";
import Card from "@mui/joy/Card";
import CardCover from "@mui/joy/CardCover";
import CardContent from "@mui/joy/CardContent";
import Button from "@mui/joy/Button";
import Menu from "@mui/joy/Menu";
import MenuButton from "@mui/joy/MenuButton";
import Dropdown from "@mui/joy/Dropdown";
import MenuItem from "@mui/joy/MenuItem";

import EditIcon from "@mui/icons-material/Edit";
import LibraryAddIcon from "@mui/icons-material/LibraryAdd";

import UserAvatar from "./UserAvatar";
import { USER_PROFILE_HEADER_HEIGHT } from "../configs/VarConfigs";

export default function UserProfileHeader(props) {
  const userInfo = props.userInfo;
  const allowProfileOps = props.allowProfileOps;
  const contributionCount = props.contributionCount
    ? props.contributionCount
    : 0;

  // If the user info from the local DB is still not available, wait...
  if (!userInfo) {
    return (
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          p: 0,
          m: 0,
          height: USER_PROFILE_HEADER_HEIGHT,
        }}
      >
        <Card
          component="li"
          sx={{ borderRadius: 0, minWidth: 300, flexGrow: 1 }}
        >
          <CardCover>
            <img
              src="/images/green-blue.png"
              srcSet="/images/green-blue.png 2x"
              loading="lazy"
              alt=""
            />
          </CardCover>
          <CardContent sx={{ justifyContent: "center", alignItems: "center" }}>
            <Container maxWidth="xl">
              <Grid
                container
                sx={{ justifyContent: "center", alignItems: "center" }}
              >
                <Stack sx={{ m: 3 }} spacing={1}>
                  <Typography level="h3" fontWeight="lg" textColor={"#fff"}>
                    Error fetching the user information. Please check back
                    later.
                  </Typography>
                </Stack>
              </Grid>
            </Container>
          </CardContent>
        </Card>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
        p: 0,
        m: 0,
        minHeight: USER_PROFILE_HEADER_HEIGHT,
      }}
    >
      <Card component="li" sx={{ borderRadius: 0, minWidth: 300, flexGrow: 1 }}>
        <CardCover>
          <img
            src="/images/network-bg.png"
            loading="lazy"
            alt="Network with nodes and connections"
          />
        </CardCover>
        <CardContent sx={{ justifyContent: "center", alignItems: "center" }}>
          <Container maxWidth="xl">
            <Grid
              container
              sx={{ justifyContent: "center", alignItems: "center" }}
            >
              <Grid xs={12} md={3}>
                <Stack
                  sx={{ m: 2, justifyContent: "center", alignItems: "center" }}
                >
                  <UserAvatar
                    link={userInfo["avatar_url"]}
                    userId={userInfo.openid}
                    size={150}
                  />
                </Stack>
              </Grid>
              <Grid xs={12} md={6}>
                <Stack
                  direction="column"
                  sx={{ m: 3 }}
                  spacing={0.5}
                  alignItems={{
                    xs: "center",
                    md: "flex-start",
                  }}
                >
                  <Typography level="h1" fontWeight="lg" textColor={"#000"}>
                    {userInfo.first_name
                      ? userInfo.first_name
                      : "First name unknown"}
                    &nbsp;
                    {userInfo.last_name
                      ? userInfo.last_name
                      : "Last name unknown"}
                  </Typography>
                  <Typography
                    level="body-sm"
                    fontWeight="lg"
                    textColor={"#000"}
                  >
                    {userInfo.email ? "Email: " + userInfo.email : null}
                  </Typography>
                  <Typography
                    level="body-sm"
                    fontWeight="lg"
                    textColor={"#000"}
                  >
                    {userInfo.affiliation
                      ? "Affiliation: " + userInfo.affiliation
                      : null}
                  </Typography>
                  <Typography
                    level="body-sm"
                    fontWeight="md"
                    textColor={"#000"}
                  >
                    {userInfo.bio ? "Bio: " + userInfo.bio : null}
                  </Typography>
                  {allowProfileOps && (
                    <Stack
                      direction="row"
                      spacing={2}
                      justifyContent="flex-start"
                      sx={{ py: 2 }}
                    >
                      <Button
                        component="a"
                        href="/user-profile-update"
                        variant="outlined"
                        size="sm"
                        color="success"
                        endDecorator={<EditIcon />}
                      >
                        Edit Profile
                      </Button>
                      <Dropdown>
                        <MenuButton
                          variant="outlined"
                          size="sm"
                          color="warning"
                          endDecorator={<LibraryAddIcon />}
                        >
                          New Contribution
                        </MenuButton>
                        <Menu placement="bottom-end" color="primary">
                          <MenuItem component="a" href="/contribution/dataset">
                            New Dataset
                          </MenuItem>
                          <MenuItem component="a" href="/contribution/notebook">
                            New Notebook
                          </MenuItem>
                          <MenuItem
                            component="a"
                            href="/contribution/publication"
                          >
                            New Publication
                          </MenuItem>
                          <MenuItem component="a" href="/contribution/oer">
                            New Educational Resource
                          </MenuItem>
                        </Menu>
                      </Dropdown>
                    </Stack>
                  )}
                </Stack>
              </Grid>
              <Grid xs={12} md={3}>
                {contributionCount > 0 && (
                  <Stack
                    direction="column"
                    sx={{ m: 3 }}
                    spacing={1}
                    alignItems="center"
                  >
                    <Typography level="h1" fontWeight="lg" textColor={"#000"}>
                      {contributionCount}
                    </Typography>
                    <Typography level="h4" fontWeight="lg" textColor={"#000"}>
                      Contribution{contributionCount > 1 && "s"}
                    </Typography>
                  </Stack>
                )}
              </Grid>
            </Grid>
          </Container>
        </CardContent>
      </Card>
    </Box>
  );
}
