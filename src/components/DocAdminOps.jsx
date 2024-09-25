import { React, useState, useEffect } from "react";

import { useOutletContext, Link as RouterLink } from "react-router-dom";

import Stack from "@mui/joy/Stack";
import DialogTitle from "@mui/joy/DialogTitle";
import DialogContent from "@mui/joy/DialogContent";
import DialogActions from "@mui/joy/DialogActions";
import Modal from "@mui/joy/Modal";
import ModalDialog from "@mui/joy/ModalDialog";
import WarningRoundedIcon from "@mui/icons-material/WarningRounded";
import Divider from "@mui/joy/Divider";
import Button from "@mui/joy/Button";
import Link from "@mui/joy/Link";
import IconButton from "@mui/joy/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";

import { fetchWithAuth } from "../utils/FetcherWithJWT";
import { PERMISSIONS } from "../configs/Permissions";

const USER_BACKEND_URL = import.meta.env.VITE_DATABASE_BACKEND_URL;
const TEST_MODE = import.meta.env.VITE_TEST_MODE;

export default function DocAdminOps(props) {
  const docId = props.docId;
  const title = props.title;
  const afterDeleteRedirection = props.afterDeleteRedirection
    ? props.afterDeleteRedirection
    : "/";

  const [deleteMetadataTitle, setDeleteMetadataTitle] = useState(undefined);
  const [deleteMetadataId, setDeleteMetadataId] = useState(undefined);

  // OutletContext retrieving the user object to display user info
  const { isAuthenticated, localUserInfo } = useOutletContext();

  if (!localUserInfo || !isAuthenticated) {
    return null;
  }

  // Check if the current user is admin, if yes, allow edit
  const isAdmin = localUserInfo.role < PERMISSIONS["edit_all"];
  if (!isAdmin) {
    return null;
  }

  async function handleDocDelete(docId) {
    TEST_MODE && console.log("Deleting...", docId);
    try {
      const response = await fetch(
        `${USER_BACKEND_URL}/api/documentation/${docId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Error deleting resource");
      }

      setDeleteMetadataId(undefined);
      setDeleteMetadataTitle(undefined);

      const result = await response.json();
      // When the deletion was successful, rerender the list
      if (result && result.message === "Documentation deleted successfully") {
        window.location.href = afterDeleteRedirection;
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error deleting resource");
    }
  }

  return (
    <Stack direction="row" spacing={1} sx={{ px: { xs: 2, md: 4 }, py: 1 }}>
      <IconButton size="sm" variant="soft" color="primary">
        <Link
          underline="none"
          component={RouterLink}
          to={"/doc-update/" + docId}
          sx={{ color: "inherit" }}
        >
          <EditIcon />
        </Link>
      </IconButton>
      <IconButton
        color="danger"
        variant="soft"
        size="sm"
        onClick={() => {
          setDeleteMetadataTitle(title);
          setDeleteMetadataId(docId);
          TEST_MODE && console.log("Attempting to delete:", title, docId);
        }}
      >
        <DeleteForeverIcon />
      </IconButton>
      <Modal
        open={!!deleteMetadataTitle && !!deleteMetadataId}
        onClose={() => {
          setDeleteMetadataId(undefined);
          setDeleteMetadataTitle(undefined);
        }}
      >
        <ModalDialog variant="outlined" role="alertdialog" color="danger">
          <DialogTitle>
            <WarningRoundedIcon />
            Confirmation
          </DialogTitle>
          <Divider />
          <DialogContent>
            Are you sure you want to delete "{deleteMetadataTitle}"? This
            deletion is permanent!
          </DialogContent>
          <DialogActions>
            <Button
              variant="solid"
              color="danger"
              onClick={() => handleDocDelete(deleteMetadataId)}
            >
              Delete
            </Button>
            <Button
              variant="plain"
              color="neutral"
              onClick={() => {
                setDeleteMetadataId(undefined);
                setDeleteMetadataTitle(undefined);
              }}
            >
              Cancel
            </Button>
          </DialogActions>
        </ModalDialog>
      </Modal>
    </Stack>
  );
}
