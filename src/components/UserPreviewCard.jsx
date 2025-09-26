import { Link as RouterLink } from "react-router";

import Stack from "@mui/joy/Stack";
import Box from "@mui/joy/Box";
import Link from "@mui/joy/Link";
import IconButton from "@mui/joy/IconButton";
import Typography from "@mui/joy/Typography";
import Tooltip from "@mui/joy/Tooltip";

import { grey } from "@mui/material/colors";
import GitHubIcon from "@mui/icons-material/GitHub";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import GoogleIcon from "@mui/icons-material/Google";
import WebIcon from "@mui/icons-material/Web";

import UserAvatar from "./UserAvatar";
import { UserRoleChip } from "../features/UserProfile/UserRoleChip";
import { UNTRUSTED_AFFILIATIONS } from "../configs/VarConfigs";

export default function UserPreviewCard(props) {
  const user = props.user;

  if (!user) {
    return;
  }

  const userId = user.id;
  const name = `${user.first_name} ${user.last_name}`;
  const avatar = user.avatar_url?.low;
  const bio = user.bio;
  const affiliation = user.affiliation;
  const role = user.role;
  const numberOfContributions = user.numberOfContributions;

  const gitHubLink = user.gitHubLink;
  const linkedInLink = user.linkedInLink;
  const googleScholarLink = user.googleScholarLink;
  const personalWebsiteLink = user.personalWebsiteLink;

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        width: 350,
        justifyContent: "center",
        p: 1,
      }}
    >
      <Stack spacing={0.5} sx={{ alignItems: "flex-start" }}>
        <Link component={RouterLink} to={`/contributor/${userId}`}>
          <UserAvatar
            size={50}
            userAvatarUrls={avatar}
            userId={userId}
            userFirstName={user.first_name}
            userLastName={user.last_name}
            avatarResolution="low"
          />
        </Link>

        <Stack
          direction="row"
          flexWrap="wrap"
          spacing={0.5}
          sx={{ alignItems: "center" }}
        >
          <Link component={RouterLink} to={`/contributor/${userId}`}>
            <Typography level="title-lg" sx={{ fontWeight: "bold" }}>
              {name}
            </Typography>
          </Link>
          <UserRoleChip roleNumber={role} usePublicRoleName disabledTooltip />
        </Stack>

        {affiliation &&
          (UNTRUSTED_AFFILIATIONS.includes(affiliation?.toLowerCase()) ? (
            <Typography level="body-sm">
              Signed up with{" "}
              <Typography fontWeight="lg">{affiliation}</Typography>
            </Typography>
          ) : (
            <Typography level="title-sm" fontWeight="lg">
              {affiliation}
            </Typography>
          ))}

        {numberOfContributions > 0 && (
          <Link component={RouterLink} to={`/contributor/${userId}`}>
            <Typography level="body-sm" fontWeight="lg">
              {numberOfContributions} contribution
              {numberOfContributions > 1 && "s"}
            </Typography>
          </Link>
        )}

        {bio && (
          <Typography
            level="body-xs"
            sx={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "-webkit-box",
              WebkitLineClamp: "3",
              WebkitBoxOrient: "vertical",
            }}
          >
            {bio}
          </Typography>
        )}

        <Stack direction="row" sx={{ p: 0 }}>
          {gitHubLink && (
            <Tooltip title="User GitHub profile" placement="top" arrow>
              <IconButton
                component="a"
                href={gitHubLink}
                target="_blank"
                rel="noopener noreferrer"
                style={{ textDecoration: "none" }}
              >
                <GitHubIcon sx={{ color: grey[800] }} />
              </IconButton>
            </Tooltip>
          )}
          {linkedInLink && (
            <Tooltip title="User LinkedIn profile" placement="top" arrow>
              <IconButton
                component="a"
                href={linkedInLink}
                target="_blank"
                rel="noopener noreferrer"
                style={{ textDecoration: "none" }}
              >
                <LinkedInIcon sx={{ color: grey[800] }} />
              </IconButton>
            </Tooltip>
          )}
          {googleScholarLink && (
            <Tooltip title="User Google Scholar profile" placement="top" arrow>
              <IconButton
                component="a"
                href={googleScholarLink}
                target="_blank"
                rel="noopener noreferrer"
                style={{ textDecoration: "none" }}
              >
                <GoogleIcon sx={{ color: grey[800] }} />
              </IconButton>
            </Tooltip>
          )}
          {personalWebsiteLink && (
            <Tooltip title="User personal website" placement="top" arrow>
              <IconButton
                component="a"
                href={personalWebsiteLink}
                target="_blank"
                rel="noopener noreferrer"
                style={{ textDecoration: "none" }}
              >
                <WebIcon sx={{ color: grey[800] }} />
              </IconButton>
            </Tooltip>
          )}
        </Stack>
      </Stack>
    </Box>
  );
}
