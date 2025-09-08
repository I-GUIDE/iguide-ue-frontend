import { useState, useRef } from "react";

import Tooltip from "@mui/joy/Tooltip";
import { fetchUser, getUserRole } from "../utils/UserManager";
import { getNumberOfContributions } from "../utils/DataRetrieval";

import UserPreviewCard from "./UserPreviewCard";

export default function UserProfileTooltip(props) {
  const children = props.children;
  const userId = props.userId;
  const enterDelay = props.enterDelay || 1000;
  const leaveDelay = props.leaveDelay || 300;

  const timer = useRef(null);
  const isHoveringTooltip = useRef(false);

  const [open, setOpen] = useState(false);
  const [userData, setUserData] = useState();
  const [isLoading, setIsLoading] = useState(true);

  const isMobile = useRef(isTouchDevice());

  async function getUserInformation(uid) {
    const user = await fetchUser(uid);
    const numberOfContributions = await getNumberOfContributions(uid);
    const role = await getUserRole(uid);
    console.log("User returned", user, numberOfContributions, role);

    setUserData({
      first_name: user["display-first-name"],
      last_name: user["display-last-name"],
      affiliation: user["affiliation"],
      bio: user["bio"],
      avatar_url: user["avatar-url"],
      role: role,
      id: user["id"],
      gitHubLink: user.gitHubLink,
      linkedInLink: user.linkedInLink,
      googleScholarLink: user.googleScholarLink,
      personalWebsiteLink: user.personalWebsiteLink,
      numberOfContributions: numberOfContributions,
    });
    setIsLoading(false);
  }

  function handleTriggerMouseEnter() {
    if (isMobile.current) return;

    timer.current = setTimeout(async function () {
      await getUserInformation(userId);
      setOpen(true);
    }, enterDelay);
  }

  function handleTriggerMouseLeave() {
    if (isMobile.current) return;

    clearTimeout(timer.current);
    setTimeout(function () {
      if (!isHoveringTooltip.current) {
        setOpen(false);
      }
    }, leaveDelay);
  }

  function handleTooltipMouseEnter() {
    isHoveringTooltip.current = true;
    clearTimeout(timer.current);
  }

  function handleTooltipMouseLeave() {
    isHoveringTooltip.current = false;
    setOpen(false);
  }

  // Decide if this is a mobile device, if yes, tooltip will be disabled
  function isTouchDevice() {
    return (
      "ontouchstart" in window ||
      navigator.maxTouchPoints > 0 ||
      navigator.msMaxTouchPoints > 0
    );
  }

  return (
    <Tooltip
      open={open}
      variant="outlined"
      disableHoverListener
      disableTouchListener
      disableInteractive={false}
      arrow
      title={
        <div
          onMouseEnter={handleTooltipMouseEnter}
          onMouseLeave={handleTooltipMouseLeave}
          style={{ pointerEvents: "auto" }}
        >
          <UserPreviewCard user={userData} />
        </div>
      }
    >
      <span
        onMouseEnter={handleTriggerMouseEnter}
        onMouseLeave={handleTriggerMouseLeave}
        style={{ display: "inline-block" }}
      >
        {children}
      </span>
    </Tooltip>
  );
}
