import React, { useRef, useEffect } from "react";

import { update } from "jdenticon";

import Avatar from "@mui/joy/Avatar";

export default function UserAvatar(props) {
  const link = props.link;
  const userId = props.userId ? props.userId : "";
  const size = props.size;

  const icon = useRef(null);
  useEffect(() => {
    update(icon.current, userId);
  }, [userId]);

  if (!link) {
    return (
      <Avatar
        variant="outlined"
        alt="Generated avatar"
        sx={{ width: size, height: size }}
      >
        <svg
          data-jdenticon-value={userId}
          height={size}
          ref={icon}
          width={size}
        />
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
