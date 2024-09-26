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
import Link from "@mui/joy/Link";

import EditIcon from "@mui/icons-material/Edit";
import LibraryAddIcon from "@mui/icons-material/LibraryAdd";
import AlternateEmailIcon from "@mui/icons-material/AlternateEmail";
import PublicIcon from "@mui/icons-material/Public";
import MoodIcon from "@mui/icons-material/Mood";

import UserAvatar from "./UserAvatar";
import { USER_PROFILE_HEADER_HEIGHT } from "../configs/VarConfigs";
import { PERMISSIONS } from "../configs/Permissions";

export default function UserProfileHeader(props) {
  const localUserInfo = props.localUserInfo;
  const allowProfileOps = props.allowProfileOps;
  const contributionCount = props.contributionCount
    ? props.contributionCount
    : 0;

  // If the user info from the local DB is still not available, wait...
  if (!localUserInfo) {
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
            <Container maxWidth="lg">
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

  const canEditOER = localUserInfo.role <= PERMISSIONS["edit_oer"];
  const canEditMap = localUserInfo.role <= PERMISSIONS["edit_map"];

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
          <Container maxWidth="lg">
            <Grid
              container
              sx={{ justifyContent: "center", alignItems: "center" }}
            >
              <Grid xs={12} md={3}>
                <Stack
                  sx={{ m: 2, justifyContent: "center", alignItems: "center" }}
                >
                  <UserAvatar
                    link={localUserInfo["avatar_url"]}
                    userId={localUserInfo.id}
                    size={150}
                  />
                </Stack>
              </Grid>
              <Grid xs={12} md={6}>
                <Stack
                  direction="column"
                  sx={{ m: 3 }}
                  spacing={1.5}
                  alignItems={{
                    xs: "center",
                    md: "flex-start",
                  }}
                >
                  <Typography level="h1" fontWeight="lg" textColor="#000">
                    {localUserInfo.first_name
                      ? localUserInfo.first_name
                      : "First name unknown"}
                    &nbsp;
                    {localUserInfo.last_name
                      ? localUserInfo.last_name
                      : "Last name unknown"}
                  </Typography>
                  <Stack
                    direction="column"
                    sx={{ m: 3 }}
                    spacing={1}
                    alignItems={{
                      xs: "center",
                      md: "flex-start",
                    }}
                  >
                    {localUserInfo.affiliation && (
                      <Typography
                        level="body-md"
                        fontWeight="md"
                        startDecorator={<PublicIcon />}
                      >
                        {localUserInfo.affiliation}
                      </Typography>
                    )}
                    {localUserInfo.email && (
                      <Link
                        href={"mailto:" + localUserInfo.email}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ textDecoration: "underline" }}
                      >
                        <Typography
                          level="body-md"
                          fontWeight="md"
                          startDecorator={<AlternateEmailIcon />}
                        >
                          {localUserInfo.email}
                        </Typography>
                      </Link>
                    )}
                    {localUserInfo.bio && (
                      <Typography
                        level="body-sm"
                        fontWeight="md"
                        startDecorator={<MoodIcon />}
                      >
                        {localUserInfo.bio}
                      </Typography>
                    )}
                  </Stack>

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
                          {canEditOER && (
                            <MenuItem component="a" href="/contribution/oer">
                              New Educational Resource
                            </MenuItem>
                          )}
                          {canEditMap && (
                            <MenuItem component="a" href="/contribution/map">
                              New Map
                            </MenuItem>
                          )}
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
