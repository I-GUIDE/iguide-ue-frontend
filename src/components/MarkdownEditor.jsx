import React, { useState, useRef, useMemo } from "react";

import JoditEditor from "jodit-react";
import Stack from "@mui/joy/Stack";

import { fetchWithAuth } from "../utils/FetcherWithJWT";
import { IMAGE_SIZE_LIMIT } from "../configs/VarConfigs";

const USER_BACKEND_URL = import.meta.env.VITE_DATABASE_BACKEND_URL;
const TEST_MODE = import.meta.env.VITE_TEST_MODE;

export default function MarkdownEditor(props) {
  const editor = useRef(null);

  const contents = props.contents;
  const setContents = props.setContents;

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

          setUploadSucceeded(true);
          TEST_MODE && console.log("Img link", result.url);

          const image = editor.selection.j.createInside.element("img");
          image.setAttribute("src", result.url);
          editor.selection.insertNode(image);
        } catch (error) {
          console.error("Error fetching a single element: ", error.message);
          setUploadSucceeded(false);
        }
      } else {
        setUploadSucceeded(false);
      }
    }.bind(this);
  }

  const config = useMemo(
    () => ({
      readonly: false, // all options from https://xdsoft.net/jodit/docs/,
      placeholder: "Type here...",
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
        {
          name: "imageUpload",
          tooltip: "Upload image",
          iconURL: "/images/image-upload-icon.png",
          exec: async (editor) => {
            imageUpload(editor);
          },
        },
        {
          name: "image",
          tooltip: "Insert image",
          iconURL: "/images/insert-image-icon.png",
        },
        "|",
        {
          name: "embedment",
          tooltip: "Embed webpage",
          iconURL: "/images/iframe-icon.png",
          popup: (editor, current, self, close) => {
            function handleClick(e) {
              const embedURL = document.getElementById("embed-url").value;
              console.log("URL for iframe", embedURL);
              if (embedURL) {
                const iframe =
                  editor.selection.j.createInside.element("iframe");
                iframe.setAttribute("src", embedURL);
                iframe.setAttribute("width", "100%");
                iframe.setAttribute("height", "100%");
                editor.selection.insertNode(iframe);
              }
            }
            const divElement = editor.create.div("iframe-embed-popup");

            const inputElement = document.createElement("input");
            inputElement.setAttribute("type", "text");
            inputElement.id = "embed-url";
            divElement.appendChild(inputElement);

            const buttonElement = document.createElement("button");
            buttonElement.innerHTML = "Embed";
            buttonElement.onclick = handleClick;
            divElement.appendChild(buttonElement);

            console.log("div element", divElement);
            return divElement;
          },
        },
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
      height: 800,
    }),
    []
  );

  return (
    <div data-color-mode="light">
      <Stack spacing={1}>
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
