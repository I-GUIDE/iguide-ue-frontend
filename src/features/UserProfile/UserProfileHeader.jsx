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
import Tooltip from "@mui/joy/Tooltip";

import EditIcon from "@mui/icons-material/Edit";
import LibraryAddIcon from "@mui/icons-material/LibraryAdd";

import { grey } from "@mui/material/colors";
import GitHubIcon from "@mui/icons-material/GitHub";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import GoogleIcon from "@mui/icons-material/Google";
import WebIcon from "@mui/icons-material/Web";

import UserAvatar from "../../components/UserAvatar";
import { UserRoleChip } from "./UserRoleChip";
import {
  USER_PROFILE_HEADER_HEIGHT,
  UNTRUSTED_AFFILIATIONS,
  NAVBAR_HEIGHT,
} from "../../configs/VarConfigs";
import { PERMISSIONS } from "../../configs/Permissions";

export default function UserProfileHeader(props) {
  const localUserInfo = props.localUserInfo;
  const allowProfileOps = props.allowProfileOps;
  const contributionCount = props.contributionCount
    ? props.contributionCount
    : 0;
  const loading = props.loading;
  const hideEmail = props.hideEmail;

  // When the localUserInfo is still loading...
  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          p: 0,
          m: 0,
          height: "100%",
          maxHeight: USER_PROFILE_HEADER_HEIGHT,
        }}
      >
        <Card
          component="li"
          sx={{ borderRadius: 0, minWidth: 300, flexGrow: 1 }}
        >
          <CardCover>
            <img
              src="/images/network-bg.png"
              loading="lazy"
              alt="Network with nodes and connections"
            />
          </CardCover>
          <CardContent
            sx={{
              justifyContent: "center",
              alignItems: "center",
              pt: NAVBAR_HEIGHT / 8,
            }}
          >
            <Container maxWidth="lg">
              <Grid
                container
                sx={{ justifyContent: "center", alignItems: "center" }}
              >
                <Stack sx={{ m: 3 }} spacing={1}>
                  <Typography
                    level="title-lg"
                    fontWeight="sm"
                    textColor="#bdbdbd"
                  >
                    Loading profile...
                  </Typography>
                </Stack>
              </Grid>
            </Container>
          </CardContent>
        </Card>
      </Box>
    );
  }

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
              src="/images/network-bg.png"
              loading="lazy"
              alt="Network with nodes and connections"
            />
          </CardCover>
          <CardContent
            sx={{
              justifyContent: "center",
              alignItems: "center",
              pt: NAVBAR_HEIGHT / 8,
            }}
          >
            <Container maxWidth="lg">
              <Grid
                container
                sx={{ justifyContent: "center", alignItems: "center" }}
              >
                <Stack sx={{ m: 3 }} spacing={1}>
                  <Typography level="title-lg" fontWeight="md">
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
  const canContributeElements = localUserInfo.role <= PERMISSIONS["contribute"];

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
        <CardContent
          sx={{
            justifyContent: "center",
            alignItems: "center",
            pt: NAVBAR_HEIGHT / 8,
          }}
        >
          <Container maxWidth="lg">
            <Grid
              container
              sx={{
                justifyContent: "center",
                alignItems: "center",
                px: { xs: 1, md: 2, lg: 4 },
              }}
            >
              <Grid xs={12} md={3}>
                <Stack
                  sx={{ m: 2, justifyContent: "center", alignItems: "center" }}
                >
                  <UserAvatar
                    userAvatarUrls={localUserInfo["avatar_url"]}
                    userId={localUserInfo.id}
                    size={200}
                    avatarResolution="high"
                    isLoading={!localUserInfo}
                  />
                </Stack>
              </Grid>
              <Grid xs={12} md={6}>
                <Stack
                  direction="column"
                  sx={{ m: { md: 3 } }}
                  spacing={2}
                  alignItems={{
                    xs: "center",
                    md: "flex-start",
                  }}
                >
                  <Stack
                    direction="column"
                    sx={{ m: { md: 3 } }}
                    spacing={0.5}
                    alignItems={{
                      xs: "center",
                      md: "flex-start",
                    }}
                  >
                    <Stack
                      direction={{ xs: "column", md: "row" }}
                      sx={{ m: { md: 3 } }}
                      spacing={1}
                      alignItems="center"
                    >
                      <Typography
                        level="h2"
                        fontWeight="lg"
                        textColor="#000"
                        textAlign={{ xs: "center", sm: "left" }}
                        sx={{
                          fontSize: {
                            xs: "1.5rem", // h3
                            sm: "2rem", // h2
                          },
                        }}
                      >
                        {localUserInfo.first_name
                          ? localUserInfo.first_name
                          : "First name unknown"}
                        &nbsp;
                        {localUserInfo.last_name
                          ? localUserInfo.last_name
                          : "Last name unknown"}
                      </Typography>
                      <UserRoleChip roleNumber={localUserInfo.role} />
                    </Stack>

                    {/* Don't show user affiliation if it's in the untrusted affiliation list */}
                    {localUserInfo.affiliation &&
                      !UNTRUSTED_AFFILIATIONS.includes(
                        localUserInfo.affiliation?.toLowerCase()
                      ) && (
                        <Typography
                          level="body-lg"
                          fontWeight="sm"
                          textAlign={{ xs: "center", sm: "left" }}
                        >
                          {localUserInfo.affiliation}
                        </Typography>
                      )}
                  </Stack>
                  <Stack
                    direction="column"
                    sx={{ m: { md: 3 } }}
                    spacing={0.5}
                    alignItems={{
                      xs: "center",
                      md: "flex-start",
                    }}
                  >
                    {localUserInfo.bio &&
                      (localUserInfo["bio"].length > 100 ? (
                        <Tooltip
                          title={
                            <Box
                              sx={{
                                display: "flex",
                                flexDirection: "column",
                                maxWidth: 450,
                                justifyContent: "center",
                                p: 1,
                              }}
                            >
                              <Typography level="title-sm">Bio</Typography>
                              <Typography level="body-sm">
                                {localUserInfo.bio}
                              </Typography>
                            </Box>
                          }
                          variant="outlined"
                        >
                          <Typography
                            level="body-sm"
                            fontWeight="lg"
                            sx={{
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              display: "-webkit-box",
                              WebkitLineClamp: { xs: "3", md: "2" },
                              WebkitBoxOrient: "vertical",
                            }}
                          >
                            {localUserInfo.bio}
                          </Typography>
                        </Tooltip>
                      ) : (
                        <Typography
                          level="body-sm"
                          fontWeight="lg"
                          sx={{
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            display: "-webkit-box",
                            WebkitLineClamp: "2",
                            WebkitBoxOrient: "vertical",
                          }}
                        >
                          {localUserInfo.bio}
                        </Typography>
                      ))}
                    {localUserInfo.email && !hideEmail && (
                      <Link
                        href={"mailto:" + localUserInfo.email}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Typography
                          level="body-sm"
                          fontWeight="lg"
                          color="primary"
                        >
                          {localUserInfo.email}
                        </Typography>
                      </Link>
                    )}
                    <Stack direction="row" spacing={1.5} sx={{ py: 0.5 }}>
                      {localUserInfo.gitHubLink && (
                        <Tooltip
                          title="User GitHub profile"
                          variant="solid"
                          arrow
                        >
                          <Link
                            href={localUserInfo.gitHubLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ textDecoration: "none" }}
                          >
                            <GitHubIcon sx={{ color: grey[800] }} />
                          </Link>
                        </Tooltip>
                      )}
                      {localUserInfo.linkedInLink && (
                        <Tooltip
                          title="User LinkedIn profile"
                          variant="solid"
                          arrow
                        >
                          <Link
                            href={localUserInfo.linkedInLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ textDecoration: "none" }}
                          >
                            <LinkedInIcon sx={{ color: grey[800] }} />
                          </Link>
                        </Tooltip>
                      )}
                      {localUserInfo.googleScholarLink && (
                        <Tooltip
                          title="User Google Scholar profile"
                          variant="solid"
                          arrow
                        >
                          <Link
                            href={localUserInfo.googleScholarLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ textDecoration: "none" }}
                          >
                            <GoogleIcon sx={{ color: grey[800] }} />
                          </Link>
                        </Tooltip>
                      )}
                      {localUserInfo.personalWebsiteLink && (
                        <Tooltip
                          title="User personal website"
                          variant="solid"
                          arrow
                        >
                          <Link
                            href={localUserInfo.personalWebsiteLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ textDecoration: "none" }}
                          >
                            <WebIcon sx={{ color: grey[800] }} />
                          </Link>
                        </Tooltip>
                      )}
                    </Stack>
                  </Stack>

                  {allowProfileOps && (
                    <Stack
                      direction={{ xs: "column", sm: "row" }}
                      spacing={2}
                      justifyContent={{ xs: "center", sm: "flex-start" }}
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
                        Edit
                      </Button>
                      {canContributeElements && (
                        <Dropdown>
                          <MenuButton
                            variant="outlined"
                            size="sm"
                            color="warning"
                            endDecorator={<LibraryAddIcon />}
                          >
                            New Element
                          </MenuButton>
                          <Menu placement="bottom-end" color="primary">
                            <MenuItem
                              component="a"
                              href="/contribution/dataset"
                            >
                              New Dataset
                            </MenuItem>
                            <MenuItem
                              component="a"
                              href="/contribution/notebook"
                            >
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
                            <MenuItem component="a" href="/contribution/map">
                              New Map
                            </MenuItem>
                            <MenuItem component="a" href="/contribution/code">
                              New Code
                            </MenuItem>
                          </Menu>
                        </Dropdown>
                      )}
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
