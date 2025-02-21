import React, { useState, useEffect } from "react";

import { Link as RouterLink, useOutletContext } from "react-router";

import { CssVarsProvider, styled } from "@mui/joy/styles";
import CssBaseline from "@mui/joy/CssBaseline";
import Box from "@mui/joy/Box";
import Grid from "@mui/joy/Grid";
import Stack from "@mui/joy/Stack";
import Container from "@mui/joy/Container";
import Divider from "@mui/joy/Divider";
import Link from "@mui/joy/Link";
import Typography from "@mui/joy/Typography";
import Tooltip from "@mui/joy/Tooltip";
import Input from "@mui/joy/Input";
import Button from "@mui/joy/Button";
import Textarea from "@mui/joy/Textarea";
import Select from "@mui/joy/Select";
import Option from "@mui/joy/Option";
import FormLabel from "@mui/joy/FormLabel";
import FormControl from "@mui/joy/FormControl";
import Alert from "@mui/joy/Alert";
import IconButton from "@mui/joy/IconButton";

import ReportIcon from "@mui/icons-material/Report";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import DeleteIcon from "@mui/icons-material/Delete";

import { NO_HEADER_BODY_HEIGHT, IMAGE_SIZE_LIMIT } from "../configs/VarConfigs";
import usePageTitle from "../hooks/usePageTitle";

const VITE_SLACK_API_URL = import.meta.env.VITE_SLACK_API_URL;
const VITE_EXPRESS_BACKEND_URL = import.meta.env.VITE_EXPRESS_BACKEND_URL;
const TEST_MODE = import.meta.env.VITE_TEST_MODE;

export default function ContactUs() {
  usePageTitle("Contact Us");

  const { isAuthenticated, localUserInfo } = useOutletContext();

  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactCategory, setContactCategory] = useState("Question"); // "Question" | "Comment" | "Bug Report" | "Other"
  const [contactMessage, setContactMessage] = useState("");
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [imageFiles, setImageFiles] = useState([]);
  const [imageFilesURL, setImageFilesURL] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function setUserInfo() {
      const userFirstLastName =
        localUserInfo?.["first_name"] + " " + localUserInfo?.["last_name"];
      const userEmail = localUserInfo?.["email"];
      if (userFirstLastName) {
        setContactName(userFirstLastName);
      }
      if (userEmail) {
        setContactEmail(userEmail);
      }
    }

    if (isAuthenticated && localUserInfo) {
      setUserInfo();
    }
  }, [isAuthenticated, localUserInfo]);

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

  const Img = styled("img")`
    width: 100%;
    height: 100%;
    outline: 2px #97c3f0 solid;
    border-radius: 5px;
    transition: all 300ms;
  `;

  const PreviewImgContainer = styled("div")`
    width: calc((100% / 5) - 10px);
    min-width: 120px;
    height: 80px;
    position: relative;
    cursor: pointer;
    transition: all 300ms;
  `;

  const ImageContainer = styled("div")`
    display: flex;
    gap: 10px;
    width: 100%;
    flex-wrap: wrap;
    padding: 10px 0;
    transition: all 300ms;

    @media (max-width: 600px) {
      justify-content: space-between;
      row-gap: 20px;
    }
  `;

  const DeleteBtn = styled(DeleteIcon)`
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: #fff;
    font-size: 24px;
    transition: all 300ms;
  `;

  const handleImageUpload = (event) => {
    if (imageFiles.length === 5) {
      alert("You can upload only up to 5 images");
      return;
    }

    const arrImg = [];
    const arrURL = [];

    for (let idx = 0; idx < event.target.files.length; ++idx) {
      if (arrImg.length === 5) {
        alert("You can upload only up to 5 images");
        return;
      }

      const file = event.target.files[idx];
      if (!file.type.startsWith("image/")) {
        alert("Please upload an image!");
        continue;
      }
      if (file.size > IMAGE_SIZE_LIMIT) {
        alert("Please upload an image smaller than 5MB!");
        continue;
      }

      arrImg.push(file);
      arrURL.push(URL.createObjectURL(file));
    }

    setImageFiles([...imageFiles, ...arrImg]);
    setImageFilesURL([...imageFilesURL, ...arrURL]);
  };

  async function uploadImgToSlack() {
    const formData = new FormData();
    const contactDetails = {
      contactCategory,
      contactEmail,
      contactMessage,
      contactName,
    };

    TEST_MODE && console.log("Uploaded files", imageFiles);
    for (const file of imageFiles) {
      formData.append("files", file);
    }
    formData.append("contactDetails", JSON.stringify(contactDetails));

    const res = await fetch(`${VITE_EXPRESS_BACKEND_URL}/upload-to-slack`, {
      method: "POST",
      body: formData,
    });

    TEST_MODE && console.log("Img upload server response", res);

    return res;
  }

  async function sendMessageToSlack() {
    const res = await fetch(
      `https://hooks.slack.com/services/${VITE_SLACK_API_URL}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: JSON.stringify({
          blocks: [
            {
              type: "section",
              text: {
                type: "mrkdwn",
                text: `*${contactCategory}*\n_Name:_ ${contactName}\n_Email:_ ${contactEmail}\n_Message:_\n${contactMessage}`,
              },
            },
          ],
        }),
      }
    );

    return res;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    let res;

    if (imageFilesURL.length > 0) {
      res = await uploadImgToSlack();
    } else {
      res = await sendMessageToSlack();
    }

    if (res.status === 200) {
      setSuccessMsg(
        "We have received your message and will respond to the email you provided as soon as possible."
      );
      setContactName("");
      setContactEmail("");
      setContactMessage("");
      setContactCategory("Question");
      setImageFiles("");
      setImageFilesURL("");
    } else {
      setError(
        "An error has occurred. Please try again later, or you can reach us via email at help@i-guide.io."
      );
    }

    setLoading(false);
  }

  function RequiredFieldIndicator() {
    return (
      <Typography color="danger" level="title-lg">
        *
      </Typography>
    );
  }

  function removeFile(idx) {
    const imgArr = [...imageFiles];
    imgArr.splice(idx, 1);
    setImageFiles([...imgArr]);

    const urlArr = [...imageFilesURL];
    urlArr.splice(idx, 1);
    setImageFilesURL([...urlArr]);
  }

  function PreviewImg({ fileURL, imgKey, removeFile }) {
    const [isShown, setIsShown] = useState(false);

    return (
      <PreviewImgContainer
        onMouseEnter={() => {
          setIsShown(true);
        }}
        onMouseLeave={() => {
          setIsShown(false);
        }}
        onClick={() => removeFile(imgKey)}
      >
        <Img src={fileURL} loading="lazy" alt="thumbnail-preview" />
        {isShown && (
          <div
            style={{
              width: "100%",
              height: "100%",
              background: "rgba(0,0,0,0.3)",
              position: "absolute",
              top: 0,
              left: 0,
              borderRadius: "5px",
            }}
          ></div>
        )}
        {isShown && <DeleteBtn />}
      </PreviewImgContainer>
    );
  }

  return (
    <CssVarsProvider disableTransitionOnChange>
      <CssBaseline />
      <Container maxWidth="md">
        <Box
          component="main"
          sx={{
            minHeight: NO_HEADER_BODY_HEIGHT,
            display: "grid",
            gridTemplateColumns: { xs: "auto", md: "100%" },
            gridTemplateRows: "auto 1fr auto",
          }}
        >
          <Grid
            container
            rowSpacing={2}
            columnSpacing={{ xs: 1, sm: 2, md: 3 }}
            sx={{
              backgroundColor: "inherit",
              px: { xs: 2, md: 4 },
              pt: 4,
              pb: 8,
            }}
          >
            <Grid xs={12}>
              <Stack
                spacing={2}
                alignItems={{ xs: "flex-start", md: "center" }}
                sx={{ p: 1 }}
              >
                <Typography level="h2">Contact Us</Typography>
                <Typography level="h5">
                  Questions, comments, or bug report
                </Typography>
              </Stack>

              <Divider sx={{ mx: 2, my: 4 }} />

              <Typography level="body-md" sx={{ p: 2 }}>
                You may find the answers to your questions{" "}
                <Tooltip title="FAQ" placement="top">
                  <Link
                    component={RouterLink}
                    to="/docs/frequently-asked-questions"
                  >
                    here
                  </Link>
                </Tooltip>
                .
              </Typography>
              <Typography level="body-md" sx={{ p: 2 }}>
                You can also email{" "}
                <Link
                  href="mailto:help@i-guide.io"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  help@i-guide.io
                </Link>{" "}
                or submit the form below for assistance or to report any issues.
                We will respond to your inquiries as soon as possible.
              </Typography>

              <Box
                sx={{
                  m: 2,
                  p: 3,
                  border: "1px solid #ddd",
                  borderRadius: "5px",
                }}
              >
                <Typography level="h3" sx={{ py: 1 }}>
                  Contact Form
                </Typography>
                <Typography level="body-sm">
                  Fields marked <RequiredFieldIndicator /> are required.
                </Typography>
                <Divider
                  inset="none"
                  sx={{
                    margin: "10px 0 20px 0",
                  }}
                />
                {error.length > 0 && (
                  <Alert
                    sx={{ alignItems: "flex-start", my: "20px" }}
                    startDecorator={<ReportIcon />}
                    variant="soft"
                    color={"danger"}
                    endDecorator={
                      <IconButton
                        variant="soft"
                        color={"danger"}
                        onClick={() => setError("")}
                      >
                        <CloseRoundedIcon />
                      </IconButton>
                    }
                  >
                    <div>
                      <div>{"Error"}</div>
                      <Typography level="body-sm" color={"danger"}>
                        {error}
                      </Typography>
                    </div>
                  </Alert>
                )}

                {successMsg.length > 0 && (
                  <Alert
                    sx={{ alignItems: "flex-start", my: "20px" }}
                    startDecorator={<CheckCircleIcon />}
                    variant="soft"
                    color={"success"}
                    endDecorator={
                      <IconButton
                        variant="soft"
                        color={"success"}
                        onClick={() => setSuccessMsg("")}
                      >
                        <CloseRoundedIcon />
                      </IconButton>
                    }
                  >
                    <div>
                      <div>{"Success"}</div>
                      <Typography level="body-sm" color={"success"}>
                        {successMsg}
                      </Typography>
                    </div>
                  </Alert>
                )}

                <form action="POST" onSubmit={handleSubmit}>
                  <Stack spacing={3}>
                    <Stack
                      spacing={2}
                      direction={{ sx: "column", md: "row" }}
                      sx={{
                        justifyContent: "space-between",
                        alignItems: "center",
                        rowGap: "20px",
                      }}
                    >
                      <FormControl
                        sx={{
                          width: "100%",
                        }}
                      >
                        <FormLabel>
                          Your name <RequiredFieldIndicator />
                        </FormLabel>
                        <Input
                          required
                          placeholder="Your name"
                          value={contactName}
                          onChange={(e) => setContactName(e.target.value)}
                        />
                      </FormControl>
                      <FormControl
                        sx={{
                          width: "100%",
                        }}
                      >
                        <FormLabel>
                          Your email <RequiredFieldIndicator />
                        </FormLabel>
                        <Input
                          required
                          type="email"
                          placeholder="example@email.com"
                          value={contactEmail}
                          onChange={(e) => setContactEmail(e.target.value)}
                        />
                      </FormControl>
                    </Stack>

                    <FormControl>
                      <FormLabel>
                        Category <RequiredFieldIndicator />
                      </FormLabel>
                      <Select
                        defaultValue={contactCategory}
                        placeholder="Category"
                      >
                        {["Question", "Comment", "Bug Report", "Other"].map(
                          (option, i) => (
                            <Option
                              key={i}
                              value={option}
                              onClick={() => setContactCategory(option)}
                            >
                              {option}
                            </Option>
                          )
                        )}
                      </Select>
                    </FormControl>
                    <FormControl>
                      <FormLabel>
                        What would you like to tell us?
                        <RequiredFieldIndicator />
                      </FormLabel>
                      <Textarea
                        required
                        size="md"
                        name="message"
                        placeholder="Your message"
                        minRows={4}
                        maxRows={10}
                        value={contactMessage}
                        sx={{
                          p: 1.5,
                        }}
                        onChange={(e) => setContactMessage(e.target.value)}
                      />
                    </FormControl>

                    <FormControl sx={{ gridColumn: "1/-1", py: 0.5 }}>
                      <FormLabel>
                        Images {"(Up to 5 images, each < 5MB)"}
                      </FormLabel>
                      <Button
                        component="label"
                        role={undefined}
                        tabIndex={-1}
                        variant="outlined"
                        color="primary"
                        name="thumbnail-image"
                      >
                        Upload images
                        <VisuallyHiddenInput
                          type="file"
                          onChange={handleImageUpload}
                          accept="image/png, image/gif, image/jpeg"
                          multiple
                        />
                      </Button>
                      {imageFilesURL.length > 0 && (
                        <div style={{ marginTop: "20px" }}>
                          <Typography>Image preview (tap to remove)</Typography>
                          <ImageContainer>
                            {imageFilesURL.map((fileURL, key) => (
                              <PreviewImg
                                fileURL={fileURL}
                                imgKey={key}
                                removeFile={removeFile}
                              />
                            ))}
                          </ImageContainer>
                        </div>
                      )}
                    </FormControl>

                    <Button type="submit" disabled={loading}>
                      Submit
                    </Button>
                  </Stack>
                </form>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </CssVarsProvider>
  );
}
