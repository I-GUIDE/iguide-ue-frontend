import React, { useState } from "react";

import MDEditor from "@uiw/react-md-editor";

import Button from "@mui/joy/Button";
import Typography from "@mui/joy/Typography";
import { styled } from "@mui/joy";
import Stack from "@mui/joy/Stack";

import { fetchWithAuth } from "../utils/FetcherWithJWT";
import { IMAGE_SIZE_LIMIT } from "../configs/VarConfigs";

const USER_BACKEND_URL = import.meta.env.VITE_DATABASE_BACKEND_URL;
const TEST_MODE = import.meta.env.VITE_TEST_MODE;

const VisuallyHiddenInput = styled("input")`
  clip: rect(0 0 0 0);
  clip-path: inset(50%);
  height: 1px;
  overflow: hidden;
  position: absolute;
  bottom: 0;
  left: 0;
  white-space: nowrap;
  width: 1px;
`;

export default function MarkdownEditor(props) {
  const contents = props.contents;
  const setContents = props.setContents;
  const [imgMarkdown, setImgMarkdown] = useState();

  async function handleImageUpload(event) {
    const toBeUploaded = event.target.files[0];
    TEST_MODE && console.log("image to be uploaded", toBeUploaded);

    if (!toBeUploaded.type.startsWith("image/")) {
      alert("Please upload an image!");
      return null;
    }
    if (toBeUploaded.size > IMAGE_SIZE_LIMIT) {
      alert("Please upload an image smaller than 5MB!");
      return null;
    }
    const imgFile = toBeUploaded;
    const imgURL = URL.createObjectURL(toBeUploaded);

    TEST_MODE && console.log("Image info", imgFile, imgURL);

    // If user uploads a new thumbnail, use the new one, otherwise, use the existing one.
    if (imgFile) {
      const formData = new FormData();
      formData.append("file", imgFile);

      try {
        const response = await fetchWithAuth(
          `${USER_BACKEND_URL}/api/elements/thumbnail`,
          {
            method: "POST",
            body: formData,
          }
        );
        TEST_MODE && console.log("Response", formData, response);

        const result = await response.json();

        setImgMarkdown(
          <Typography>
            Markdown script:{" "}
            <Typography
              textColor="#000"
              sx={{ fontFamily: "monospace", opacity: "50%" }}
            >
              {"![image](" + result.url + ")"}
            </Typography>
          </Typography>
        );
        TEST_MODE && console.log("Img link", result.url);
      } catch (error) {
        console.error("Error fetching a single element: ", error.message);
        setImgMarkdown(
          <Typography color="danger">WARNING: Upload failed...</Typography>
        );
      }
    } else {
      setImgMarkdown(
        <Typography color="danger">
          WARNING: No file to be uploaded...
        </Typography>
      );
    }
  }

  return (
    <div data-color-mode="light">
      <Stack spacing={1}>
        <Button
          component="label"
          role={undefined}
          tabIndex={-1}
          variant="outlined"
          color="primary"
          name="thumbnail-image"
        >
          Upload an image for Markdown
          <VisuallyHiddenInput type="file" onChange={handleImageUpload} />
        </Button>
        {imgMarkdown && (
          <div>
            <Typography level="body-sm">{imgMarkdown}</Typography>
          </div>
        )}
        <MDEditor
          height={400}
          value={contents}
          onChange={(value) => {
            setContents(value);
          }}
        />
      </Stack>
    </div>
  );
}