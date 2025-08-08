import { useState, useRef } from "react";

import { Link as RouterLink } from "react-router";

import Card from "@mui/joy/Card";
import Box from "@mui/joy/Box";
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import Typography from "@mui/joy/Typography";
import Button from "@mui/joy/Button";
import { styled } from "@mui/joy/styles";
import Stack from "@mui/joy/Stack";
import LinearProgress from "@mui/joy/LinearProgress";
import Link from "@mui/joy/Link";
import Chip from "@mui/joy/Chip";

import CheckIcon from "@mui/icons-material/Check";

import SubmissionCardFieldTitle from "../ElementSubmission/SubmissionCardFieldTitle";

import {
  ACCEPTED_DATASET_TYPES,
  USER_UPLOAD_DATASET_SIZE_LIMIT,
} from "../../configs/VarConfigs";
import {
  initializeUpload,
  singleChunkUpload,
  completeUpload,
  abortUpload,
  deleteUpload,
} from "../../utils/ChunkUpload";
import { formatFileSize, calculateSHA256 } from "../../helpers/helper";

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

export default function UserDatasetUploader(props) {
  const setDatasetDirectDownloadLink = props.setDatasetDirectDownloadLink;
  const setDatasetSize = props.setDatasetSize;
  const setDatasetInfoFromUserUpload = props.setDatasetInfoFromUserUpload;
  const setDatasetUploading = props.setDatasetUploading;

  const [uploadStatus, setUploadStatus] = useState("NO_UPLOAD");
  const requestCancelRef = useRef(false);
  const [fileDetail, setFileDetail] = useState();
  const [uploadProgress, setUploadProgress] = useState(0); // Min: 0, Max: 100
  const [inputKey, setInputKey] = useState(Date.now()); // This allows the same file to be selected again after cancelling
  const [tempLink, setTempLink] = useState("");

  const fileRef = useRef(null);

  const maxRetries = 3;
  const retryDelay = 1000;

  // Reset upload after a complete upload
  async function resetUpload(resetFileRef = true) {
    if (tempLink) {
      try {
        await deleteUpload(tempLink);
      } catch (error) {
        throw new Error("Delete file failed.");
      }
    }

    setFileDetail(null);
    requestCancelRef.current = false;
    setUploadStatus("NO_UPLOAD");
    setUploadProgress(0);
    if (resetFileRef && fileRef.current) {
      fileRef.current.value = null;
      setInputKey(Date.now());
    }
    setTempLink("");
    setDatasetDirectDownloadLink("");
    setDatasetSize("");
    setDatasetInfoFromUserUpload(false);
  }

  // Handle initialize user dataset upload
  async function handleInitializeUpload(event) {
    const datasetFile = event.target.files[0];

    // If no files are selected, return.
    if (!datasetFile) {
      return;
    }

    TEST_MODE && console.log("Selected file", datasetFile);
    resetUpload(false);
    fileRef.current = datasetFile;

    const fileName = datasetFile.name;
    const fileSize = datasetFile.size;
    const fileType = datasetFile.type;

    if (fileSize > USER_UPLOAD_DATASET_SIZE_LIMIT) {
      await alertModal(
        "Failed to upload datset",
        "The file you provided is too large. Please upload a file smaller than 2GB."
      );
      // Clear the file
      event.target.value = "";
      return null;
    }

    // Initialize upload and get basic chunk upload information
    const uploadInfo = await initializeUpload(fileName, fileSize, fileType);

    // Get uploadId and chunk size
    const uploadId = uploadInfo.uploadId;
    const chunkSize = uploadInfo.chunkSize;

    // Calculate total chunks
    const totalChunks = Math.ceil(fileSize / chunkSize);

    TEST_MODE &&
      console.log("uploadInfo", uploadInfo, "total chunk number", totalChunks);

    setFileDetail({
      name: fileName,
      size: fileSize,
      type: fileType,
      uploadId: uploadId,
      chunkSize: chunkSize,
      totalChunks: totalChunks,
    });
  }

  // Kick off the actual file chunks upload
  async function handleStartUpload() {
    if (!fileDetail) {
      return;
    }

    setUploadStatus("UPLOADING");
    setDatasetUploading(true);

    const datasetFile = fileRef.current;
    const localChecksum = await calculateSHA256(datasetFile);

    const totalChunks = fileDetail.totalChunks;
    const chunkSize = fileDetail.chunkSize;
    const fileSize = fileDetail.size;
    const uploadId = fileDetail.uploadId;

    TEST_MODE &&
      console.log(
        "Start to upload",
        fileDetail,
        "Local checksum",
        localChecksum
      );

    if (requestCancelRef.current) {
      setUploadStatus("CANCELED");
      setDatasetUploading(false);
      console.warn("Upload canceled by the user before the upload starts.");
      return; // Exit if the upload is canceled
    }

    for (let chunkIdx = 0; chunkIdx < totalChunks; chunkIdx++) {
      if (requestCancelRef.current) {
        setUploadStatus("CANCELED");
        setDatasetUploading(false);
        console.warn("Upload canceled by the user.");
        return;
      }

      const startingByte = chunkIdx * chunkSize;
      // For the final chunk, use fileSize as the ending Byte
      const endingByte = Math.min(startingByte + chunkSize, fileSize);
      const fileChunk = datasetFile.slice(startingByte, endingByte);

      try {
        await uploadChunksWithRetries(
          uploadId,
          fileChunk,
          chunkIdx,
          totalChunks
        );
      } catch (error) {
        setUploadStatus("ERROR");
        setDatasetUploading(false);
        throw new Error(error);
      }
    }

    if (requestCancelRef.current) {
      setUploadStatus("CANCELED");
      setDatasetUploading(false);
      console.warn(
        "Upload canceled by the user, after finishing the upload but before completing it."
      );
      return;
    }

    // Complete upload
    const result = await completeUpload(uploadId);
    const returnedChecksum = result.checksum;

    TEST_MODE &&
      console.log(
        "Upload is complete",
        result,
        "local checksum",
        localChecksum
      );

    if (localChecksum !== returnedChecksum) {
      setUploadStatus("ERROR");
      setDatasetUploading(false);
      throw new Error(
        "Checksum test failed. File uploaded differs from the user local file."
      );
    }

    setDatasetInfoFromUserUpload(true);
    setDatasetDirectDownloadLink(result.url);
    setTempLink(result.url);
    setDatasetSize(formatFileSize(fileDetail.size));

    setUploadStatus("FINISHED");
    setDatasetUploading(false);

    return result;
  }

  // Upload chunks with given number of retries
  async function uploadChunksWithRetries(
    uploadId,
    fileChunk,
    chunkIdx,
    totalChunks
  ) {
    let retries = 0;

    while (retries < maxRetries && !requestCancelRef.current) {
      if (requestCancelRef.current) {
        throw new Error("Upload canceled during retry");
      }

      try {
        await singleChunkUpload(uploadId, fileChunk, chunkIdx, totalChunks);

        const currProgress = Math.min(
          ((chunkIdx + 1) / totalChunks) * 100,
          100
        );
        setUploadProgress(currProgress);

        return; // Success, exit retry loop
      } catch (error) {
        retries++;
        console.warn(
          `Chunk ${chunkIdx} failed (attempt ${retries}/${maxRetries}):`,
          error
        );

        if (retries >= maxRetries) {
          const errorMsg = `Failed to upload chunk ${chunkIdx} after ${maxRetries} attempts`;
          throw new Error(errorMsg);
        }

        // Wait before retrying
        await new Promise((resolve) =>
          setTimeout(resolve, retryDelay * retries)
        );
      }
    }
  }

  // Handle aborting user requested upload
  async function handleAbortUpload() {
    const uploadId = fileDetail.uploadId;
    setUploadStatus("CANCELED");
    requestCancelRef.current = true;

    await abortUpload(uploadId);

    if (fileRef.current) {
      fileRef.current.value = null;
      setInputKey(Date.now());
    }
  }

  // Handle user requested reset
  function handleResetUpload() {
    resetUpload(true);
  }

  return (
    <FormControl sx={{ gridColumn: "1/-1", py: 0.5 }}>
      <FormLabel>
        <SubmissionCardFieldTitle tooltipTitle="Upload your own dataset">
          <Chip component="span" size="sm" color="primary" sx={{ mr: 0.5 }}>
            BETA
          </Chip>
          Upload your own dataset {"(< 2GB)"}{" "}
        </SubmissionCardFieldTitle>
      </FormLabel>
      <Button
        component="label"
        role={undefined}
        tabIndex={-1}
        disabled={uploadStatus !== "NO_UPLOAD"}
        variant="outlined"
        color="primary"
        name="user-dataset"
      >
        Upload your dataset
        <VisuallyHiddenInput
          type="file"
          accept={ACCEPTED_DATASET_TYPES}
          onChange={handleInitializeUpload}
          key={inputKey}
          ref={fileRef}
        />
      </Button>
      <Typography level="body-xs" sx={{ py: 0.5 }}>
        By clicking "Upload your dataset", you agree to our{" "}
        <Link
          component={RouterLink}
          to="/contributor-license-agreement"
          target="_blank"
          rel="noopener noreferrer"
        >
          Contributor License Agreement
        </Link>
        .
      </Typography>
      {fileDetail && (
        <Card sx={{ my: 1 }}>
          <Stack spacing={1}>
            <Typography level="title-md">File information</Typography>
            <Typography>Filename: {fileDetail.name}</Typography>
            <Typography>Size: {formatFileSize(fileDetail.size)}</Typography>
            <Typography>Type: {fileDetail.type}</Typography>
          </Stack>

          {/* Show upload button when upload hasn't started or has canceled */}
          {uploadStatus === "NO_UPLOAD" && (
            <Stack direction="row" spacing={1}>
              <Button
                variant="solid"
                color="primary"
                onClick={handleStartUpload}
              >
                Upload
              </Button>
              <Button
                variant="outlined"
                color="primary"
                onClick={handleResetUpload}
              >
                Cancel
              </Button>
            </Stack>
          )}
          {/* Show progress bar when upload is in progress */}
          {uploadStatus === "UPLOADING" && (
            <Stack spacing={1} sx={{ alignItems: "flex-start" }}>
              <Box
                sx={{
                  bgcolor: "white",
                  width: "100%",
                }}
              >
                <LinearProgress
                  determinate
                  variant="outlined"
                  color="primary"
                  size="sm"
                  value={uploadProgress}
                  sx={{
                    "--LinearProgress-radius": "0px",
                    "--LinearProgress-progressThickness": "24px",
                    boxShadow: "sm",
                    borderColor: "neutral.500",
                  }}
                >
                  <Typography
                    level="body-xs"
                    textColor="white"
                    sx={{
                      fontWeight: "xl",
                      mixBlendMode: "exclusion",
                    }}
                  >
                    UPLOADING... {`${Math.round(uploadProgress)}%`}
                  </Typography>
                </LinearProgress>
              </Box>
              <Button
                variant="outlined"
                color="danger"
                onClick={handleAbortUpload}
              >
                Cancel Upload
              </Button>
            </Stack>
          )}
          {/* Show green progress bar when upload has finished */}
          {uploadStatus === "FINISHED" && (
            <Stack spacing={1} sx={{ alignItems: "flex-start" }}>
              <Box sx={{ bgcolor: "white", width: "100%" }}>
                <LinearProgress
                  determinate
                  variant="outlined"
                  color="success"
                  size="sm"
                  value={100}
                  sx={{
                    "--LinearProgress-radius": "0px",
                    "--LinearProgress-progressThickness": "24px",
                    boxShadow: "sm",
                    borderColor: "neutral.500",
                  }}
                >
                  <Typography
                    level="body-xs"
                    textColor="common.white"
                    sx={{
                      fontWeight: "xl",
                      mixBlendMode: "lighten",
                    }}
                  >
                    UPLOAD FINISHED 100%
                  </Typography>
                </LinearProgress>
              </Box>
              <Typography
                level="title-sm"
                color="success"
                startDecorator={<CheckIcon />}
              >
                Your upload is complete. We've automatically filled in the
                dataset's direct download link and file size for you.
              </Typography>
              <Typography level="body-xs">
                If you would like to start over, click the "Start Over" button
                below. By clicking this button, your uploaded dataset or file
                will be removed from our server, and any generated download
                links will be invalid.
              </Typography>
              <Button
                variant="outlined"
                color="primary"
                onClick={handleResetUpload}
              >
                Start Over
              </Button>
            </Stack>
          )}
          {uploadStatus === "CANCELED" && (
            <Stack spacing={1} sx={{ alignItems: "flex-start" }}>
              <Box sx={{ bgcolor: "white", width: "100%" }}>
                <LinearProgress
                  determinate
                  variant="outlined"
                  color="danger"
                  size="sm"
                  value={uploadProgress}
                  sx={{
                    "--LinearProgress-radius": "0px",
                    "--LinearProgress-progressThickness": "24px",
                    boxShadow: "sm",
                    borderColor: "neutral.500",
                  }}
                >
                  <Typography
                    level="body-xs"
                    textColor="common.white"
                    sx={{
                      fontWeight: "xl",
                      mixBlendMode: "difference",
                    }}
                  >
                    UPLOAD CANCELED
                  </Typography>
                </LinearProgress>
              </Box>
              <Button
                variant="outlined"
                color="primary"
                onClick={handleResetUpload}
              >
                Reset
              </Button>
            </Stack>
          )}
          {uploadStatus === "ERROR" && (
            <Stack spacing={1} sx={{ alignItems: "flex-start" }}>
              <Box sx={{ bgcolor: "white", width: "100%" }}>
                <LinearProgress
                  determinate
                  variant="outlined"
                  color="danger"
                  size="sm"
                  value={uploadProgress}
                  sx={{
                    "--LinearProgress-radius": "0px",
                    "--LinearProgress-progressThickness": "24px",
                    boxShadow: "sm",
                    borderColor: "neutral.500",
                  }}
                >
                  <Typography
                    level="body-xs"
                    textColor="common.white"
                    sx={{
                      fontWeight: "xl",
                      mixBlendMode: "difference",
                    }}
                  >
                    ERROR {`${Math.round(uploadProgress)}%`}
                  </Typography>
                </LinearProgress>
              </Box>
              <Typography level="body-sm" color="danger">
                Oops! Something went wrong during your upload. We're unable to
                complete the process at this time. Please click "Reset" to try
                again, or reach out to us for assistance with this error.
              </Typography>
              <Button
                variant="outlined"
                color="primary"
                onClick={handleResetUpload}
              >
                Reset
              </Button>
            </Stack>
          )}
        </Card>
      )}
    </FormControl>
  );
}
