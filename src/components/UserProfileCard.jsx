import React, { useState } from "react";

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

import UserAvatar from "./UserAvatar";
import { updateUserRole } from "../utils/UserManager";

const TEST_MODE = import.meta.env.VITE_TEST_MODE;

export default function UserProfileCard(props) {
  const userId = props.id;
  const userFirstName = props.firstName;
  const userLastName = props.lastName;
  const roleFromDB = props.role;
  // Actual user role
  const [userRole, setUserRole] = useState(roleFromDB);
  // User role displayed on the select user role modal
  const [selectedUserRole, setSelectedUserRole] = useState(roleFromDB);
  const userAvatar = props.avatar;
  const userAffiliation = props.affiliation;
  const userEmail = props.email;

  const [roleChangeModalOpen, setRoleChangeModalOpen] = useState(false);
  const [roleChangeStatus, setRoleChangeStatus] = useState("no-status");

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
    if (newValue) {
      TEST_MODE && console.log("Setting role to", newValue);
      setSelectedUserRole(newValue);
    }
  }

  function closeChangeUserRoleModal() {
    setRoleChangeStatus("no-status");
    setSelectedUserRole(userRole);
    setRoleChangeModalOpen(false);
  }

  return (
    <>
      <Card
        variant="outlined"
        orientation="horizontal"
        sx={{
          width: "100%",
          height: "100%",
          "--Card-radius": "15px",
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
              size="75px"
              sx={{ ml: "auto" }}
            />
            <Stack direction="column" spacing={1}>
              <Typography level="h4" sx={{ fontWeight: "bold" }}>
                {userLastName || <Typography color="danger">nln</Typography>},{" "}
                {userFirstName || <Typography color="danger">nfn</Typography>}
              </Typography>
              <Typography level="title-sm">
                ID: {userId || <Typography color="danger">No ID</Typography>}
              </Typography>
              <Typography level="title-sm">
                Role:{" "}
                {userRole || <Typography color="danger">No role</Typography>}
              </Typography>
              <Typography level="title-sm">
                {userAffiliation || (
                  <Typography color="danger">No affiliation</Typography>
                )}
              </Typography>
              <Typography level="title-sm">
                {userEmail || <Typography color="danger">No email</Typography>}
              </Typography>
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
                  href={`/contributor/${userId}`}
                >
                  <ContactPageIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Change user role" placement="right">
                <IconButton
                  color="primary"
                  size="sm"
                  onClick={() => setRoleChangeModalOpen(true)}
                >
                  <AssignmentIndIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Edit user profile" placement="right">
                <IconButton
                  color="success"
                  size="sm"
                  component="a"
                  href="#future-user-edit-page"
                >
                  <Edit />
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
              <Option value={2}>Admin (2)</Option>
              <Option value={3}>Moderator (3)</Option>
              <Option value={4}>Trusted User Plus (4)</Option>
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
    </>
  );
}
