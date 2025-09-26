import { useState } from "react";

import { useNavigate } from "react-router";

import Card from "@mui/joy/Card";
import Modal from "@mui/joy/Modal";
import ModalClose from "@mui/joy/ModalClose";
import Sheet from "@mui/joy/Sheet";
import Select from "@mui/joy/Select";
import Option from "@mui/joy/Option";
import Stack from "@mui/joy/Stack";
import Typography from "@mui/joy/Typography";
import Tooltip from "@mui/joy/Tooltip";
import CardContent from "@mui/joy/CardContent";
import CardOverflow from "@mui/joy/CardOverflow";
import CardActions from "@mui/joy/CardActions";
import Button from "@mui/joy/Button";
import IconButton from "@mui/joy/IconButton";

import Edit from "@mui/icons-material/Edit";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import ContactPageIcon from "@mui/icons-material/ContactPage";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";

import UserAvatar from "./UserAvatar";
import { updateUserRole, deleteUser } from "../utils/UserManager";
import { formatIsoStringToYYYYMMDD } from "../utils/PeriodAgoText";

const TEST_MODE = import.meta.env.VITE_TEST_MODE;

export default function UserProfileCard(props) {
  const userId = props.id;
  const userFirstName = props.firstName;
  const userLastName = props.lastName;
  const authFirstName = props.authFirstName;
  const authLastName = props.authLastName;
  const roleFromDB = props.role;
  const creationTime = props.creationTime;

  const creationTimeYYYYMMDD = formatIsoStringToYYYYMMDD(creationTime);

  const navigate = useNavigate();

  // Actual user role
  const [userRole, setUserRole] = useState(roleFromDB);
  // User role displayed on the select user role modal
  const [selectedUserRole, setSelectedUserRole] = useState(roleFromDB);
  const userAvatar = props.avatar;
  const userAffiliation = props.affiliation;
  const userEmail = props.email;

  const [roleChangeModalOpen, setRoleChangeModalOpen] = useState(false);
  const [roleChangeStatus, setRoleChangeStatus] = useState("no-status");

  const [userDeletionModalOpen, setUserDeletionModalOpen] = useState(false);
  const [userDeletionStatus, setUserDeletionStatus] = useState("no-status");

  // Handling role changes
  async function handleSubmitNewRole() {
    if (!selectedUserRole) {
      return;
    }
    const result = await updateUserRole(userId, selectedUserRole);
    if (result === "ERROR") {
      setRoleChangeStatus("error");
    } else {
      setRoleChangeStatus("good");
      setUserRole(selectedUserRole);
    }
  }

  async function handleRoleChange(e, newValue) {
    if (newValue && newValue !== 1) {
      TEST_MODE && console.log("Setting role to", newValue);
      setSelectedUserRole(newValue);
    }
  }

  function closeChangeUserRoleModal() {
    setRoleChangeStatus("no-status");
    setSelectedUserRole(userRole);
    setRoleChangeModalOpen(false);
  }

  // Handling user deletion
  async function handleUserDeletion() {
    const result = await deleteUser(userId);
    if (result === "ERROR") {
      setUserDeletionStatus("error");
    } else if (result === "CONFLICT") {
      setUserDeletionStatus("conflict");
    } else {
      setUserDeletionStatus("good");
    }
  }

  function closeUserDeletionModal() {
    if (userDeletionStatus === "good") {
      // Reload page when exiting the modal after a successful user deletion
      navigate(0);
    }
    setUserDeletionStatus("no-status");
    setUserDeletionModalOpen(false);
  }

  return (
    <>
      <Card
        variant="plain"
        orientation="horizontal"
        sx={{
          width: "100%",
          height: "100%",
          "--Card-radius": "15px",
          overflow: "hidden",
          boxShadow: `
            0 1px 2px rgba(0, 0, 0, 0.3),
            0 2px 4px rgba(0, 0, 0, 0.2)
          `,
        }}
      >
        <CardContent
          sx={{
            justifyContent: "center",
          }}
        >
          <Stack
            direction="row"
            spacing={3}
            sx={{
              width: "100%",
              px: 1,
              justifyContent: "flex-start",
              alignItems: "center",
            }}
          >
            <UserAvatar
              userAvatarUrls={userAvatar}
              userId={userId}
              userFirstName={userFirstName}
              userLastName={userLastName}
              size="75px"
              sx={{ ml: "auto" }}
            />
            <Stack direction="column" spacing={1}>
              <Typography
                level="h4"
                sx={{ fontWeight: "bold", lineHeight: "0.5", pb: 1 }}
              >
                {userLastName || <Typography color="danger">nln</Typography>},{" "}
                {userFirstName || <Typography color="danger">nfn</Typography>}
                {/* Display first and last name from CILogon if different */}
                {(authLastName !== userLastName ||
                  authFirstName !== userFirstName) && (
                  <Typography level="title-sm">
                    {" ("}
                    {authLastName || (
                      <Typography color="danger">nln</Typography>
                    )}
                    ,{" "}
                    {authFirstName || (
                      <Typography color="danger">nfn</Typography>
                    )}
                    {")"}
                  </Typography>
                )}
              </Typography>

              <Typography level="title-sm">
                Role:{" "}
                {userRole || <Typography color="danger">No role</Typography>}
              </Typography>
              <Stack direction="column" spacing={0.5}>
                <Typography level="body-sm">
                  {userId || <Typography color="danger">No ID</Typography>}
                </Typography>
                <Typography level="body-sm">
                  {userAffiliation || (
                    <Typography color="danger">No affiliation</Typography>
                  )}
                </Typography>
                <Typography level="body-sm">
                  {userEmail || (
                    <Typography color="danger">No email</Typography>
                  )}
                </Typography>
                <Typography level="body-sm">
                  {creationTimeYYYYMMDD ? (
                    <Typography>Created on {creationTimeYYYYMMDD}</Typography>
                  ) : (
                    <Typography color="danger">No creation time</Typography>
                  )}
                </Typography>
              </Stack>
            </Stack>
          </Stack>
        </CardContent>
        <CardOverflow variant="plain">
          <CardActions>
            <Stack direction="column" spacing={1} sx={{ px: 1 }}>
              <Tooltip title="Open user profile in new page" placement="right">
                <IconButton
                  color="warning"
                  size="sm"
                  component="a"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Open user profile in new page"
                  href={`/contributor/${userId}`}
                >
                  <ContactPageIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Change user role" placement="right">
                <IconButton
                  color="primary"
                  size="sm"
                  aria-label="Change user role"
                  onClick={() => setRoleChangeModalOpen(true)}
                >
                  <AssignmentIndIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Edit user profile" placement="right">
                <IconButton
                  color="success"
                  size="sm"
                  aria-label="Edit user profile"
                  disabled
                >
                  <Edit />
                </IconButton>
              </Tooltip>
              <Tooltip title="Delete this user" placement="right">
                <IconButton
                  color="danger"
                  size="sm"
                  aria-label="Delete this user"
                  // Disable the button if the user is super admin
                  disabled={userRole === 1}
                  onClick={() => setUserDeletionModalOpen(true)}
                >
                  <DeleteForeverIcon />
                </IconButton>
              </Tooltip>
            </Stack>
          </CardActions>
        </CardOverflow>
      </Card>

      {/* Change Role Modal */}
      <Modal
        open={roleChangeModalOpen}
        onClose={closeChangeUserRoleModal}
        sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
      >
        <Sheet
          variant="outlined"
          sx={{ maxWidth: 500, borderRadius: "md", p: 3, boxShadow: "lg" }}
        >
          <ModalClose />
          <Stack spacing={1} sx={{ p: 1 }}>
            <Typography align="center" level="title-lg">
              Change User Role
            </Typography>
            <Typography align="center" level="title-md">
              {userLastName || "nln"}, {userFirstName || "nfn"}
            </Typography>
            <Typography align="center" level="body-xs">
              ID: {userId}
            </Typography>
            <Typography align="center" level="body-xs">
              Current role number: {userRole}
            </Typography>
            <Select
              defaultValue={userRole}
              value={selectedUserRole}
              name="role"
              onChange={handleRoleChange}
            >
              {/* You cannot bump users to super admin using the admin panel */}
              <Option value={1} disabled>
                Super Admin (1)
              </Option>
              <Option value={2} disabled>
                Admin (2)
              </Option>
              <Option value={3}>Moderator (3)</Option>
              <Option value={4}>Core Contributor (4)</Option>
              <Option value={5} disabled={userAffiliation !== "ACCESS"}>
                Trusted User Plus (5)
              </Option>
              <Option value={8}>Trusted User (8)</Option>
              <Option value={10}>User (10)</Option>
            </Select>
            <Stack direction="row" spacing={1} sx={{ width: "100%", py: 1 }}>
              <Button
                color="primary"
                size="sm"
                sx={{ width: "100%", my: 1 }}
                onClick={closeChangeUserRoleModal}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                color="danger"
                size="sm"
                sx={{ width: "100%", my: 1 }}
                // Disable the button if the selected role is the same as the current one
                disabled={userRole === selectedUserRole}
                onClick={handleSubmitNewRole}
              >
                Change
              </Button>
            </Stack>
            {roleChangeStatus === "error" && (
              <Typography color="danger" level="body-sm">
                Role change failed!
              </Typography>
            )}
            {roleChangeStatus === "good" && (
              <Typography color="success" level="body-sm">
                Role change succeeded!
              </Typography>
            )}
          </Stack>
        </Sheet>
      </Modal>

      {/* Delete User Modal */}
      <Modal
        open={userDeletionModalOpen}
        onClose={closeUserDeletionModal}
        sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
      >
        <Sheet
          variant="outlined"
          sx={{ maxWidth: 400, borderRadius: "md", p: 3, boxShadow: "lg" }}
        >
          <ModalClose />
          <Stack spacing={1} sx={{ p: 1 }}>
            <Typography align="center" level="title-lg">
              Delete User
            </Typography>
            <Typography align="center" level="title-md">
              {userLastName || "nln"}, {userFirstName || "nfn"}
            </Typography>
            <Typography align="center" level="body-xs">
              ID: {userId}
            </Typography>
            <Typography align="center" level="body-xs">
              Current role number: {userRole}
            </Typography>
            <Typography color="danger" align="center" level="title-sm">
              Are you sure you would like to delete this user? This action
              cannot be undone.
            </Typography>
            <Stack direction="row" spacing={1} sx={{ width: "100%", py: 1 }}>
              <Button
                color="primary"
                size="sm"
                sx={{ width: "100%", my: 1 }}
                onClick={closeUserDeletionModal}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                color="danger"
                size="sm"
                sx={{ width: "100%", my: 1 }}
                // Disable the button if the user is super admin
                disabled={userRole === 1}
                onClick={handleUserDeletion}
              >
                Delete
                <DeleteForeverIcon />
              </Button>
            </Stack>
            {userDeletionStatus === "error" && (
              <Typography color="danger" level="body-sm">
                User deletion failed!
              </Typography>
            )}
            {userDeletionStatus === "conflict" && (
              <Typography color="warning" level="body-sm">
                User deletion failed due to one of these scenarios: 1. The user
                is a super admin. 2. The user has contributions.
              </Typography>
            )}
            {userDeletionStatus === "good" && (
              <Typography color="success" level="body-sm">
                User deletion succeeded!
              </Typography>
            )}
          </Stack>
        </Sheet>
      </Modal>
    </>
  );
}
