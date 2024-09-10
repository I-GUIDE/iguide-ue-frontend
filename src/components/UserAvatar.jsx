import * as React from "react";

import Jdenticon from "react-jdenticon";

import Avatar from "@mui/joy/Avatar";

export default function UserAvatar(props) {
  const localUserInfo = props.localUserInfo;
  const size = props.size;

  if (localUserInfo) {
    if (localUserInfo.avatar_url) {
      return (
        <Avatar
          variant="outlined"
          alt="User avatar"
          src={localUserInfo.avatar_url}
          sx={{ width: size, height: size }}
        />
      );
    } else {
      return (
        <Avatar>
          <Jdenticon size="200" value={localUserInfo.openid} />
        </Avatar>
      );
    }
  } else {
    return <Avatar variant="outlined" />;
  }
}
