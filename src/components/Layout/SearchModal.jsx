import { useState, useRef, useEffect } from "react";

import Modal from "@mui/joy/Modal";
import ModalDialog from "@mui/joy/ModalDialog";
import Button from "@mui/joy/Button";
import Typography from "@mui/joy/Typography";
import Stack from "@mui/joy/Stack";
import Box from "@mui/joy/Box";
import Divider from "@mui/joy/Divider";

import SearchRoundedIcon from "@mui/icons-material/SearchRounded";

import SearchBar from "../SearchBar";
import WebsiteNav from "../WebsiteNav";

const TEST_MODE = import.meta.env.VITE_TEST_MODE;

export default function SearchModal() {
  const [open, setOpen] = useState(false);
  const searchRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (open && searchRef.current) {
        // searchRef.current might be a wrapper div, so find the input inside
        const input = searchRef.current.querySelector("input");
        if (input) {
          input.focus();
          TEST_MODE &&
            console.log(
              "searchRef.current",
              searchRef.current,
              "Input element tagName:",
              searchRef.current?.tagName
            );
        }
      }
    }, 1);
    return () => clearTimeout(timer);
  }, [open]);

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
            <Stack spacing={1}>
              <SearchBar
                placeholder="Search..."
                showTrendingSearchKeywords
                onSearch={() => {
                  setTimeout(() => setOpen(false), 300);
                }}
                ref={searchRef}
              />
              <Divider />
              <WebsiteNav />
            </Stack>
          </Box>
        </ModalDialog>
      </Modal>
    </>
  );
}
