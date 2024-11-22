import { React, useState } from "react";

import { useOutletContext } from "react-router-dom";

import Tooltip from "@mui/joy/Tooltip";
import DialogTitle from "@mui/joy/DialogTitle";
import DialogContent from "@mui/joy/DialogContent";
import DialogActions from "@mui/joy/DialogActions";
import Modal from "@mui/joy/Modal";
import ModalDialog from "@mui/joy/ModalDialog";
import WarningRoundedIcon from "@mui/icons-material/WarningRounded";
import Divider from "@mui/joy/Divider";
import Button from "@mui/joy/Button";

import { fetchWithAuth } from "../utils/FetcherWithJWT";
import { PERMISSIONS } from "../configs/Permissions";

const USER_BACKEND_URL = import.meta.env.VITE_DATABASE_BACKEND_URL;
const TEST_MODE = import.meta.env.VITE_TEST_MODE;

export default function ElementDeleteButton(props) {
  const elementId = props.elementId;
  const contributorId = props.contributorId;
  const title = props.title;
  const tooltipTitle = props.tooltipTitle;
  const variant = props.variant;
  const color = props.color;
  const size = props.size;
  const children = props.children;
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
  const canEditAllElements = localUserInfo.role <= PERMISSIONS["edit_all"];
  const isContributor = localUserInfo.id === contributorId;
  if (!isContributor && !canEditAllElements) {
    return null;
  }

  async function handleElementDelete(elementId) {
    TEST_MODE && console.log("Deleting...", elementId);
    try {
      const response = await fetchWithAuth(
        `${USER_BACKEND_URL}/api/elements/${elementId}`,
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
    <>
      <Button
        aria-label="Delete this element"
        color={color}
        variant={variant}
        size={size}
        onClick={() => {
          setDeleteMetadataTitle(title);
          setDeleteMetadataId(elementId);
          TEST_MODE && console.log("Attempting to delete:", title, elementId);
        }}
      >
        <Tooltip title={tooltipTitle} placement="top" arrow>
          {children}
        </Tooltip>
      </Button>
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
              onClick={() => handleElementDelete(deleteMetadataId)}
            >
              Delete
              {!isContributor &&
                canEditAllElements &&
                " (YOU ARE NOT THE CONTRIBUTOR)"}
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
    </>
  );
}
