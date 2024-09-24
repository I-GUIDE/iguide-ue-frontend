import React, { useState } from "react";

import MDEditor from "@uiw/react-md-editor";

import Button from "@mui/joy/Button";
import Typography from "@mui/joy/Typography";
import { styled } from "@mui/joy";

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

  const [imgFile, setImgFile] = useState();
  const [imgURL, setImgURL] = useState();
  const [imgLink, setImgLink] = useState();

  async function handleImageUpload(event) {
    const toBeUploaded = event.target.files[0];
    if (!toBeUploaded.type.startsWith("image/")) {
      alert("Please upload an image!");
      setImgFile(null);
      setImgURL(null);
      return null;
    }
    if (toBeUploaded.size > IMAGE_SIZE_LIMIT) {
      alert("Please upload an image smaller than 5MB!");
      setImgFile(null);
      setImgURL(null);
      return null;
    }
    setImgFile(toBeUploaded);
    setImgURL(URL.createObjectURL(toBeUploaded));

    // If user uploads a new thumbnail, use the new one, otherwise, use the existing one.
    if (imgFile) {
      const formData = new FormData();
      formData.append("file", imgFile);

      const response = await fetchWithAuth(
        `${USER_BACKEND_URL}/api/elements/thumbnail`,
        {
          method: "POST",
          body: formData,
        }
      );

      const result = await response.json();
      setImgLink(result.url);
      TEST_MODE && console.log("img link", result.url);
    } else {
      setImgLink("Upload failed...");
    }
    setImgFile(null);
    setImgURL(null);
  }

  return (
    <div data-color-mode="light">
      <Button
        component="label"
        role={undefined}
        tabIndex={-1}
        variant="outlined"
        color="primary"
        name="thumbnail-image"
      >
        Upload an image
        <VisuallyHiddenInput type="file" onChange={handleImageUpload} />
      </Button>
      {imgLink && (
        <div>
          <Typography>Image link: {imgLink}</Typography>
        </div>
      )}
      <MDEditor
        height={400}
        value={contents}
        onChange={(value) => {
          setContents(value);
        }}
      />
    </div>
  );
}
