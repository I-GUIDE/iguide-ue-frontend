import { useState, useRef, useEffect } from "react";

import Typography from "@mui/joy/Typography";
import Box from "@mui/joy/Box";
import Modal from "@mui/joy/Modal";
import ModalClose from "@mui/joy/ModalClose";
import Sheet from "@mui/joy/Sheet";
import Stack from "@mui/joy/Stack";
import Button from "@mui/joy/Button";

export default function TextBlockModal(props) {
  const text = props.text;
  const modalTitle = props.modalTitle;
  const textLevel = props.textLevel || "title-sm";
  const numberOfLines = props.numberOfLines || 2;
  const modalButtonText = props.modalButtonText || "Expand";

  const [openModal, setOpenModal] = useState(false);
  const [showModalButton, setShowModalButton] = useState(false);
  const textRef = useRef(null);

  useEffect(() => {
    if (textRef.current) {
      const hasOverflow =
        textRef.current.scrollHeight > textRef.current.clientHeight;
      setShowModalButton(hasOverflow);
    }
  }, [text]);

  if (!text) {
    return;
  }

  return (
    <Box>
      <Typography
        ref={textRef}
        level={textLevel}
        sx={{
          display: "-webkit-box",
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
          textOverflow: "ellipsis",
          WebkitLineClamp: numberOfLines,
        }}
      >
        {text}
      </Typography>
      {showModalButton && (
        <Button
          color="primary"
          size="xs"
          variant="plain"
          onClick={() => setOpenModal(true)}
          sx={{ p: 0 }}
        >
          {modalButtonText}
        </Button>
      )}
      <Modal
        open={openModal}
        onClose={() => setOpenModal(false)}
        sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
      >
        <Sheet
          variant="outlined"
          sx={{ maxWidth: 500, borderRadius: "md", p: 3, boxShadow: "lg" }}
        >
          <ModalClose />
          <Stack spacing={1} sx={{ p: 1 }}>
            {modalTitle && (
              <Typography level="title-lg" fontWeight="lg">
                {modalTitle}
              </Typography>
            )}
            <Typography level="body-md">{text}</Typography>
          </Stack>
        </Sheet>
      </Modal>
    </Box>
  );
}
