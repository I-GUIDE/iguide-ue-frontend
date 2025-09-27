import { useState, useEffect } from "react";

import Snackbar from "@mui/joy/Snackbar";
import Button from "@mui/joy/Button";
import Stack from "@mui/joy/Stack";
import Typography from "@mui/joy/Typography";

export default function NotificationSnackbar(props) {
  const snackbarMessage = props.snackbarMessage;

  const [openSnackbar, setOpenSnackbar] = useState(false);

  useEffect(() => {
    const hasSeenSnackbar = sessionStorage.getItem("seenSnackbar");
    if (!hasSeenSnackbar) {
      setOpenSnackbar(true);
      sessionStorage.setItem("seenSnackbar", "true");
    }
  }, []);

  return (
    <Snackbar
      open={openSnackbar}
      variant="soft"
      color="danger"
      size="md"
      onClose={(event, reason) => {
        if (reason === "clickaway") {
          return;
        }
        setOpenSnackbar(false);
      }}
      sx={{ maxWidth: 500, p: 2 }}
    >
      <Stack
        direction="column"
        spacing={1}
        sx={{
          justifyContent: "center",
          alignItems: "flex-start",
          width: "100%",
        }}
      >
        <Typography level="title-sm">{snackbarMessage}</Typography>
        <Button
          variant="soft"
          color="danger"
          onClick={() => setOpenSnackbar(false)}
          sx={{ p: 1 }}
        >
          Close
        </Button>
      </Stack>
    </Snackbar>
  );
}
