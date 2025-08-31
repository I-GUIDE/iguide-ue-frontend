import { useState } from "react";

import Modal from "@mui/joy/Modal";
import ModalDialog from "@mui/joy/ModalDialog";
import Button from "@mui/joy/Button";
import Typography from "@mui/joy/Typography";
import Sheet from "@mui/joy/Sheet";
import Stack from "@mui/joy/Stack";
import Box from "@mui/joy/Box";

import SearchRoundedIcon from "@mui/icons-material/SearchRounded";

import SearchBar from "../SearchBar";
import WebsiteNav from "../WebsiteNav";

export default function SearchModal() {
  const [open, setOpen] = useState(false);

  function onClose() {
    setOpen(false);
  }
  return (
    <>
      <Button
        variant="soft"
        color="neutral"
        startDecorator={<SearchRoundedIcon />}
        sx={{
          borderRadius: "20px",
          minWidth: "140px",
          justifyContent: "space-between",
          bgcolor: "background.level1",
          "&:hover": {
            bgcolor: "background.level2",
          },
        }}
        onClick={() => setOpen(true)}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            width: "100%",
            justifyContent: "space-between",
          }}
        >
          <Typography level="body-sm" color="neutral">
            Search...
          </Typography>
        </Box>
      </Button>
      <Modal open={open} onClose={onClose}>
        <ModalDialog
          variant="outlined"
          role="alertdialog"
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <Box sx={{ p: 1 }}>
            <Stack spacing={5}>
              <Stack spacing={2}>
                <Typography level="h3" sx={{ textAlign: "center" }}>
                  Search Knowledge Elements
                </Typography>
                <SearchBar
                  placeholder="Search..."
                  showTrendingSearchKeywords
                  onSearch={() => {
                    setTimeout(() => setOpen(false), 300);
                  }}
                />
              </Stack>
              <Stack spacing={2}>
                <Typography level="h3" sx={{ textAlign: "center" }}>
                  Explore the Platform
                </Typography>
                <WebsiteNav />
              </Stack>
            </Stack>
            <Sheet sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
              <Button onClick={onClose}>Close</Button>
            </Sheet>
          </Box>
        </ModalDialog>
      </Modal>
    </>
  );
}
