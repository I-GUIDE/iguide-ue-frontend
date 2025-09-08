import { Link as RouterLink } from "react-router";

import Typography from "@mui/joy/Typography";
import Stack from "@mui/joy/Stack";
import Link from "@mui/joy/Link";
import Card from "@mui/joy/Card";
import CardContent from "@mui/joy/CardContent";

import UserAvatar from "../../components/UserAvatar";
import UserProfileTooltip from "../../components/UserProfileTooltip";

export default function ContributorCard(props) {
  const encodedUserId = props.encodedUserId;
  const avatar = props.avatar;
  const userId = props.userId;
  const name = props.name;
  const isLoading = props.isLoading;
  const timePassedText = props.timePassedText;

  return (
    <Link
      component={RouterLink}
      to={"/contributor/" + encodedUserId}
      style={{ textDecoration: "none" }}
      aria-label={`View ${name}'s profile`}
    >
      <Card
        variant="plain"
        orientation="horizontal"
        sx={{
          maxHeight: "150px",
          bgcolor: "#fff",
          p: 0,
          "&:hover": {
            borderColor: "theme.vars.palette.primary.outlinedHoverBorder",
            transform: "translateY(-2px)",
          },
          transition: "box-shadow 0.3s ease, transform 0.3s ease",
        }}
      >
        <CardContent>
          <UserProfileTooltip userId={userId}>
            <Stack
              direction="row"
              alignItems="center"
              spacing={2}
              sx={{ py: 1 }}
            >
              <UserAvatar
                userAvatarUrls={avatar}
                userId={userId}
                avatarResolution="low"
                isLoading={isLoading}
              />
              <Stack direction="column">
                <Typography level="title-lg">{name}</Typography>
                <Typography level="body-sm">{timePassedText}</Typography>
              </Stack>
            </Stack>
          </UserProfileTooltip>
        </CardContent>
      </Card>
    </Link>
  );
}
