import React, { useState, useEffect } from "react";

import { Link as RouterLink } from "react-router-dom";

import { CssVarsProvider } from "@mui/joy/styles";
import AspectRatio from "@mui/joy/AspectRatio";
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
import ReportIcon from "@mui/icons-material/Report";
import IconButton from "@mui/joy/IconButton";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { styled } from "@mui/joy";

import { NO_HEADER_BODY_HEIGHT, IMAGE_SIZE_LIMIT } from "../configs/VarConfigs";
import usePageTitle from "../hooks/usePageTitle";

const VITE_SLACK_API_URL = import.meta.env.VITE_SLACK_API_URL;
const VITE_SLACK_API_TOKEN = import.meta.env.VITE_SLACK_API_TOKEN;

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

export default function ContactUs() {
  usePageTitle("Contact Us");

  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactCategory, setContactCategory] = useState("Question");
  const [contactMessage, setContactMessage] = useState("");
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [contactImageFile, setContactImageFile] = useState("");
  const [contactImageFileURL, setContactImageFileURL] = useState("");

  async function handleImageUploadToSlack() {
    // 1. Get an image upload URL from Slack
    const res = await fetch(
      `https://slack.com/api/files.getUploadURLExternal?filename=${contactImageFile.name}&length=${contactImageFile.size}&pretty=1`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Bearer ${VITE_SLACK_API_TOKEN}`,
        },
      }
    );

    const data = await res.json();

    // 2. Upload file to that URL
    // 3. Finalize upload and share on the channel with files.completeUploadExternal
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!contactName || !contactEmail || !contactMessage) {
      setError("Please fill all the fields in the form");
      return;
    }

    // Send text data to Slack channel
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
                text: `*${contactCategory}*`,
              },
            },
            {
              type: "section",
              text: {
                type: "mrkdwn",
                text: `_Name:_ ${contactName}\n_Email:_ ${contactEmail}\n_Message:_\n${contactMessage}`,
              },
            },
          ],
        }),
      }
    );

    if (res.ok) {
      setSuccessMsg("Your inquiry has been noted");
    } else {
      setError("There was an error, please try again later.");
    }

    if (contactImageFile) {
      await handleImageUploadToSlack();
    }
  }

  const handleImageUpload = (event) => {
    const thumbnailFile = event.target.files[0];
    if (!thumbnailFile.type.startsWith("image/")) {
      alert("Please upload an image!");
      setContactImageFile(null);
      setContactImageFileURL(null);
      return null;
    }
    if (thumbnailFile.size > IMAGE_SIZE_LIMIT) {
      alert("Please upload an image smaller than 5MB!");
      setContactImageFile(null);
      setContactImageFileURL(null);
      return null;
    }
    setContactImageFile(thumbnailFile);
    setContactImageFileURL(URL.createObjectURL(thumbnailFile));

    console.log(contactImageFileURL);
  };

  function RequiredFieldIndicator() {
    return (
      <Typography color="danger" level="title-lg">
        *
      </Typography>
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
                spacing={3}
                alignItems={{ xs: "flex-start", md: "center" }}
                sx={{ p: 2 }}
              >
                <Typography level="h2">Any questions or comments?</Typography>
              </Stack>

              <Divider sx={{ mx: 2, my: 4 }} />

              <Typography level="body-md" sx={{ p: 2 }}>
                You may find the answers to your questions{" "}
                <Tooltip title="Tutorials" placement="top">
                  <Link component={RouterLink} to="/tutorials">
                    here
                  </Link>
                </Tooltip>
                .
              </Typography>
              <Typography level="body-md" sx={{ p: 2 }}>
                If not, please feel free to email{" "}
                <Link
                  href="mailto:help@i-guide.io"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  help@i-guide.io
                </Link>{" "}
                for assistance or to report any issues.
              </Typography>

              <Box
                sx={{
                  my: 4,
                  p: 3,
                  border: "1px solid #ddd",
                  borderRadius: "5px",
                }}
              >
                <Typography level="h2">Reach out to us</Typography>
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
                          placeholder="Name"
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
                          placeholder="Email"
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
                              onClick={(e) => setContactCategory(option)}
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
                      <FormLabel>Thumbnail image {"(< 5MB)"}</FormLabel>
                      <Button
                        component="label"
                        role={undefined}
                        tabIndex={-1}
                        variant="outlined"
                        color="primary"
                        name="contact-page-image"
                      >
                        Upload a thumbnail image
                        <VisuallyHiddenInput
                          type="file"
                          onChange={handleImageUpload}
                        />
                      </Button>
                      {contactImageFileURL && (
                        <div style={{ margin: "10px 0" }}>
                          <Typography>Thumbnail preview</Typography>
                          <AspectRatio ratio="1" sx={{ width: 190 }}>
                            <img
                              src={contactImageFileURL}
                              loading="lazy"
                              alt="thumbnail-preview"
                            />
                          </AspectRatio>
                        </div>
                      )}
                    </FormControl>

                    <Button type="submit">Submit</Button>
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
