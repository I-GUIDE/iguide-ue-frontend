import { useState, useEffect } from "react";

import Modal from "@mui/joy/Modal";
import ModalDialog from "@mui/joy/ModalDialog";
import Button from "@mui/joy/Button";
import Typography from "@mui/joy/Typography";
import Sheet from "@mui/joy/Sheet";
import Stack from "@mui/joy/Stack";
import Box from "@mui/joy/Box";

import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

import { userLogin } from "../utils/UserManager";

export default function SessionExpirationModal() {
  const [openModal, setOpenModal] = useState(false);
  const [message, setMessage] = useState();

  useEffect(() => {
    function handleSessionExpired(event) {
      const sessionExpirationMessage = event.detail?.message;
      setMessage(
        sessionExpirationMessage ||
          "Your session has expired. Please log in again."
      );
      setOpenModal(true);
    }

    window.addEventListener("session-expired", handleSessionExpired);

    return () => {
      window.removeEventListener("session-expired", handleSessionExpired);
    };
  }, []);

  function handleLoginRedirect() {
    setOpenModal(false);
    userLogin();
  }

  return (
    <Modal open={openModal} onClose={() => setOpenModal(false)}>
      <ModalDialog>
        <Box sx={{ p: 1, maxWidth: 400 }}>
          <Stack spacing={1}>
            <Typography
              id="alert-dialog-title"
              level="title-lg"
              startDecorator={<ErrorOutlineIcon />}
            >
              Session Expired
            </Typography>
            <Typography id="alert-dialog-description" level="body-md">
              {message}
            </Typography>
          </Stack>
          <Sheet
            sx={{ display: "flex", justifyContent: "flex-end", mt: 2, gap: 1 }}
          >
            <Button variant="outlined" onClick={() => setOpenModal(false)}>
              Close
            </Button>
            <Button onClick={handleLoginRedirect}>Log In</Button>
          </Sheet>
        </Box>
      </ModalDialog>
    </Modal>
  );
}
