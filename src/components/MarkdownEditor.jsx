import React, { useState, useRef, useMemo } from "react";

import JoditEditor from "jodit-react";
import { CopyToClipboard } from "react-copy-to-clipboard";

import Button from "@mui/joy/Button";
import Typography from "@mui/joy/Typography";
import { styled } from "@mui/joy/styles";
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
  const editor = useRef(null);

  const contents = props.contents;
  const setContents = props.setContents;

  const [copied, setCopied] = useState(false);
  const [imgMarkdown, setImgMarkdown] = useState();
  const [uploadSucceeded, setUploadSucceeded] = useState(false);

  function imageUpload(editor) {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();

    input.onchange = async function () {
      const toBeUploaded = input.files[0];

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
      setCopied(false);

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

          setImgMarkdown("![image](" + result.url + ")");
          setUploadSucceeded(true);
          TEST_MODE && console.log("Img link", result.url);

          const image = editor.selection.j.createInside.element("img");
          image.setAttribute("src", result.url);
          editor.selection.insertNode(image);
        } catch (error) {
          console.error("Error fetching a single element: ", error.message);
          setImgMarkdown("WARNING: Upload failed...");
          setUploadSucceeded(false);
        }
      } else {
        setImgMarkdown("WARNING: No file to be uploaded...");
        setUploadSucceeded(false);
      }
    }.bind(this);
  }

  const config = useMemo(
    () => ({
      readonly: false, // all options from https://xdsoft.net/jodit/docs/,
      placeholder: "Start typings...",
      uploader: {
        insertImageAsBase64URI: true,
      },
      buttons: [
        "undo",
        "redo",
        "|",
        "bold",
        "underline",
        "italic",
        "strikethrough",
        "|",
        "superscript",
        "subscript",
        "|",
        "align",
        "|",
        "ul",
        "ol",
        "outdent",
        "indent",
        "|",
        "font",
        "fontsize",
        "brush",
        "paragraph",
        "|",
        "image",
        "link",
        "table",
        "|",
        "hr",
        "eraser",
        "copyformat",
        "|",
        "fullsize",
        "|",
        "source",
        "|",
      ],
      extraButtons: [
        {
          name: "uploadImage",
          tooltip: "Insert an image",
          iconURL:
            "https://www.kindpng.com/picc/m/261-2619141_cage-clipart-victorian-cloud-upload-icon-svg-hd.png",
          exec: async (editor) => {
            imageUpload(editor);
          },
        },
      ],
      height: 800,
    }),
    []
  );

  function handleCopy() {
    setCopied(true);
  }

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
    setCopied(false);

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

        setImgMarkdown("![image](" + result.url + ")");
        setUploadSucceeded(true);
        TEST_MODE && console.log("Img link", result.url);
      } catch (error) {
        console.error("Error fetching a single element: ", error.message);
        setImgMarkdown("WARNING: Upload failed...");
        setUploadSucceeded(false);
      }
    } else {
      setImgMarkdown("WARNING: No file to be uploaded...");
      setUploadSucceeded(false);
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
          Upload an image for Markdown (Optional)
          <VisuallyHiddenInput type="file" onChange={handleImageUpload} />
        </Button>
        {uploadSucceeded ? (
          <div>
            <Typography level="body-xs" color="success">
              Upload succeeded!
            </Typography>
            <Typography level="body-xs">
              Markdown script:{" "}
              <Typography
                textColor="#000"
                sx={{ fontFamily: "monospace", opacity: "50%" }}
              >
                {imgMarkdown}
              </Typography>
            </Typography>
            <CopyToClipboard onCopy={handleCopy} text={imgMarkdown}>
              <Button size="sm">Copy markdown image script</Button>
            </CopyToClipboard>
          </div>
        ) : (
          <div>
            <Typography level="body-sm" color="danger">
              {imgMarkdown}
            </Typography>
          </div>
        )}
        {copied && (
          <Typography level="body-sm" color="success">
            Markdown image script copied!
          </Typography>
        )}
        <JoditEditor
          ref={editor}
          value={contents}
          config={config}
          tabIndex={1} // tabIndex of textarea
          onBlur={(newContent) => setContents(newContent)} // preferred to use only this option to update the content for performance reasons
          onChange={(newContent) => {}}
        />
      </Stack>
    </div>
  );
}
