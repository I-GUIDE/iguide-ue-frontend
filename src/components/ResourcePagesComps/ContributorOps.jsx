import { React, useState, useEffect } from "react";

import { useOutletContext } from "react-router-dom";

import Stack from "@mui/joy/Stack";
import IconButton from "@mui/joy/IconButton";
import DialogTitle from "@mui/joy/DialogTitle";
import DialogContent from "@mui/joy/DialogContent";
import DialogActions from "@mui/joy/DialogActions";
import Modal from "@mui/joy/Modal";
import ModalDialog from "@mui/joy/ModalDialog";
import DeleteForever from "@mui/icons-material/DeleteForever";
import WarningRoundedIcon from "@mui/icons-material/WarningRounded";
import Divider from "@mui/joy/Divider";
import Button from "@mui/joy/Button";
import Link from "@mui/joy/Link";

const USER_BACKEND_URL = import.meta.env.VITE_DATABASE_BACKEND_URL;

export default function ContributorOps(props) {
  const elementId = props.elementId;
  const contributorId = props.contributorId;
  const title = props.title;
  const afterDeleteRedirection = props.afterDeleteRedirection
    ? props.afterDeleteRedirection
    : "/";

  const [deleteMetadataTitle, setDeleteMetadataTitle] = useState(undefined);
  const [deleteMetadataId, setDeleteMetadataId] = useState(undefined);

  // OutletContext retrieving the user object to display user info
  const [
    isAuthenticated,
    setIsAuthenticated,
    userInfo,
    setUserInfo,
    localUserInfo,
    setLocalUserInfo,
  ] = useOutletContext();

  if (!isAuthenticated) {
    return null;
  }

  if (!localUserInfo || localUserInfo.openid !== contributorId) {
    return null;
  }

  async function handleElementDelete(elementId) {
    console.log("Deleting...", elementId);
    try {
      const response = await fetch(
        `${USER_BACKEND_URL}/api/resources/${elementId}`,
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
      if (result && result.message === "Resource deleted successfully") {
        window.location.href = afterDeleteRedirection;
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error deleting resource");
    }
  }

  return (
    <Stack direction="row" spacing={2} sx={{ px: { xs: 2, md: 4 }, py: 1 }}>
      <Button size="sm" variant="outlined" color="primary">
        <Link
          underline="none"
          href={"/element-update/" + elementId}
          sx={{ color: "inherit" }}
        >
          Edit
        </Link>
      </Button>
      <Button
        color="danger"
        variant="outlined"
        size="sm"
        onClick={() => {
          setDeleteMetadataTitle(title);
          setDeleteMetadataId(elementId);
          console.log("Attempting to delete:", title, elementId);
        }}
      >
        Delete
      </Button>
      <Modal
        open={!!deleteMetadataTitle && !!deleteMetadataId}
        onClose={() => {
          setDeleteMetadataId(undefined);
          setDeleteMetadataTitle(undefined);
        }}
      >
        <ModalDialog variant="outlined" role="alertdialog">
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
              onClick={() => handleElementDelete(deleteMetadataId)}
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
