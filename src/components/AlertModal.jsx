import Modal from "@mui/joy/Modal";
import ModalDialog from "@mui/joy/ModalDialog";
import Button from "@mui/joy/Button";
import Typography from "@mui/joy/Typography";
import Sheet from "@mui/joy/Sheet";
import Stack from "@mui/joy/Stack";
import Box from "@mui/joy/Box";

import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

export default function AlertModal({ open, onClose, title, message }) {
  return (
    <Modal open={open} onClose={onClose}>
      <ModalDialog
        variant="outlined"
        role="alertdialog"
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <Box sx={{ p: 1 }}>
          <Stack spacing={1}>
            <Typography
              id="alert-dialog-title"
              level="title-lg"
              startDecorator={<ErrorOutlineIcon />}
            >
              {title || "Alert"}
            </Typography>
            <Typography id="alert-dialog-description" level="body-md">
              {message}
            </Typography>
          </Stack>
          <Sheet sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
            <Button onClick={onClose}>OK</Button>
          </Sheet>
        </Box>
      </ModalDialog>
    </Modal>
  );
}
