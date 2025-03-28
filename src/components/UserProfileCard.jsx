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
import Delete from "@mui/icons-material/Delete";

import UserAvatar from "./UserAvatar";

export default function UserProfileCard(props) {
  const userId = props.id;
  const userFirstName = props.firstName;
  const userLastName = props.lastName;
  const [userRole, setUserRole] = useState(props.role);
  const userAvatar = props.avatar;
  const userAffiliation = props.affiliation;
  const userEmail = props.email;
  const deleteUser = props.deleteUser;

  const [roleOpen, setRoleOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

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
                  onClick={() => setRoleOpen(true)}
                >
                  <AssignmentIndIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Edit user profile" placement="right">
                <IconButton
                  color="primary"
                  size="sm"
                  component="a"
                  href="#future-user-edit-page"
                >
                  <Edit />
                </IconButton>
              </Tooltip>
              <Tooltip title="Delete User" placement="right">
                <IconButton
                  color="danger"
                  size="sm"
                  onClick={() => setDeleteOpen(true)}
                >
                  <Delete />
                </IconButton>
              </Tooltip>
            </Stack>
          </CardActions>
        </CardOverflow>
      </Card>

      {/* Change Role Modal */}
      <Modal
        open={roleOpen}
        onClose={() => setRoleOpen(false)}
        sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
      >
        <form
          onSubmit={(event) => {
            event.preventDefault();
            const formData = new FormData(event.currentTarget);
            const formJson = Object.fromEntries(formData.entries());
            setUserRole(formJson["role"]);
            setRoleOpen(false);
            // Do backend request
          }}
        >
          <Sheet
            variant="outlined"
            sx={{ maxWidth: 500, borderRadius: "md", p: 3, boxShadow: "lg" }}
          >
            <ModalClose />
            <Stack spacing={2} sx={{ px: 2 }}>
              <Typography align="center" level="h4">
                Change User Role
              </Typography>
              <Typography
                align="center"
                level="body-sm"
                sx={{ fontStyle: "italic" }}
              >
                Work in progress...
              </Typography>
              <Select defaultValue={userRole} name="role">
                <Option value="Admin">Admin</Option>
                <Option value="Trusted User"> Trusted User</Option>
                <Option value="User">User</Option>
              </Select>
              <Button
                color="primary"
                size="sm"
                sx={{ width: "100%", my: 1, mx: 0.5 }}
                onClick={() => setRoleOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                color="danger"
                size="sm"
                sx={{ width: "100%", my: 1, mx: 0.5 }}
              >
                Confirm
              </Button>
            </Stack>
          </Sheet>
        </form>
      </Modal>

      {/* Delete User Modal */}
      <Modal
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
      >
        <form
          onSubmit={(event) => {
            event.preventDefault();
            const formData = new FormData(event.currentTarget);
            const formJson = Object.fromEntries(formData.entries());
            deleteUser(userId);
            // Do backend request
            setDeleteOpen(false);
          }}
        >
          <Sheet
            variant="outlined"
            sx={{ maxWidth: 500, borderRadius: "md", p: 3, boxShadow: "lg" }}
          >
            <ModalClose />
            <Stack spacing={2} sx={{ px: 2 }}>
              <Typography align="center" level="h4">
                Delete User: {userFirstName} {userLastName}
              </Typography>
              <Typography
                align="center"
                level="body-sm"
                sx={{ fontStyle: "italic" }}
              >
                Work in progress...
              </Typography>
              <Typography align="center" level="title-sm" color="danger">
                Are you sure you would like to delete user {userFirstName}{" "}
                {userLastName}? This action cannot be undone.
              </Typography>
              <Button
                color="primary"
                size="sm"
                sx={{ width: "100%", my: 1, mx: 0.5 }}
                onClick={() => setDeleteOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                color="danger"
                size="sm"
                sx={{ width: "100%", my: 1, mx: 0.5 }}
              >
                Delete
              </Button>
            </Stack>
          </Sheet>
        </form>
      </Modal>
    </>
  );
}
