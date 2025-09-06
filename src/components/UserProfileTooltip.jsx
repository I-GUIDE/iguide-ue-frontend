import { useState } from "react";

import Tooltip from "@mui/joy/Tooltip";
import { fetchUser, getUserRole } from "../utils/UserManager";
import { getNumberOfContributions } from "../utils/DataRetrieval";

import UserPreviewCard from "./UserPreviewCard";

export default function UserProfileTooltip(props) {
  const children = props.children;
  const userId = props.userId;
  const enterDelay = props.enterDelay || 1000;

  const [open, setOpen] = useState(false);
  const [userData, setUserData] = useState();
  const [isLoading, setIsLoading] = useState(true);

  async function getUserInformation(uid) {
    const user = await fetchUser(uid);
    const numberOfContributions = await getNumberOfContributions(uid);
    const role = await getUserRole(uid);
    console.log("User returned", user, numberOfContributions, role);

    setUserData({
      first_name: user["display-first-name"],
      last_name: user["display-last-name"],
      email: user["email"],
      affiliation: user["affiliation"],
      bio: user["bio"],
      avatar_url: user["avatar-url"],
      role: role,
      openid: user["openid"],
      id: user["id"],
      gitHubLink: user.gitHubLink,
      linkedInLink: user.linkedInLink,
      googleScholarLink: user.googleScholarLink,
      personalWebsiteLink: user.personalWebsiteLink,
      numberOfContributions: numberOfContributions,
    });
    setIsLoading(false);
  }

  function handleClose() {
    setOpen(false);
  }

  async function handleOpen() {
    await getUserInformation(userId);
    setOpen(true);
  }

  return (
    <Tooltip
      open={open}
      onClose={handleClose}
      onOpen={handleOpen}
      enterDelay={enterDelay}
      leaveDelay={300}
      variant="outlined"
      title={<UserPreviewCard user={userData} />}
      arrow
    >
      {children}
    </Tooltip>
  );
}
