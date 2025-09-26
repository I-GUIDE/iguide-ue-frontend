import Avatar from "@mui/joy/Avatar";

import { stringToHSLColor } from "../utils/StringToColor";

function getInitials(userFirstName, userLastName) {
  const firstInitial = userFirstName
    ? userFirstName.charAt(0).toUpperCase()
    : "";
  const lastInitial = userLastName ? userLastName.charAt(0).toUpperCase() : "";
  return firstInitial + lastInitial;
}

export default function UserAvatar(props) {
  const userAvatarUrls = props.userAvatarUrls;
  const userId = props.userId ? props.userId : "";
  const userFirstName = props.userFirstName;
  const userLastName = props.userLastName;
  const size = props.size;
  const avatarResolution = props.avatarResolution || "high";
  const isLoading = props.isLoading;

  const initials = getInitials(userFirstName, userLastName);

  if (isLoading) {
    return <Avatar variant="outlined" sx={{ width: size, height: size }} />;
  }

  const { bgColor, fontColor } = stringToHSLColor(userId);

  // When the avatar urls are not available, use initials with colors
  if (!userAvatarUrls) {
    return (
      <Avatar
        variant="outlined"
        alt={`${userFirstName} ${userLastName} profile`}
        src={
          typeof userAvatarUrls === "string"
            ? userAvatarUrls
            : userAvatarUrls?.[avatarResolution]
        }
        sx={{
          width: size,
          height: size,
          fontSize: size * 0.4,
          color: fontColor,
          bgcolor: bgColor,
          fontWeight: "lg",
        }}
      >
        {initials}
      </Avatar>
    );
  }

  return (
    <Avatar
      variant="outlined"
      alt={`${userFirstName} ${userLastName} profile`}
      src={
        typeof userAvatarUrls === "string"
          ? userAvatarUrls
          : userAvatarUrls[avatarResolution]
      }
      sx={{ width: size, height: size }}
    >
      {initials}
    </Avatar>
  );
}
