import * as React from "react";

import Jdenticon from "react-jdenticon";

import Avatar from "@mui/joy/Avatar";

export default function UserAvatar(props) {
  const link = props.link;
  const userId = props.userId;
  const size = props.size;

  if (!link) {
    return (
      <Avatar
        variant="outlined"
        alt="Generated avatar"
        sx={{ width: size, height: size }}
      >
        <Jdenticon value={userId} />
      </Avatar>
    );
  }

  return (
    <Avatar
      variant="outlined"
      alt="User avatar"
      src={link}
      sx={{ width: size, height: size }}
    />
  );
}
