import React, { useState, useEffect, useRef } from "react";

import { useOutletContext } from "react-router";
import AvatarEditor from "react-avatar-editor";

import Card from "@mui/joy/Card";
import AspectRatio from "@mui/joy/AspectRatio";
import Stack from "@mui/joy/Stack";
import CardActions from "@mui/joy/CardActions";
import CardContent from "@mui/joy/CardContent";
import Divider from "@mui/joy/Divider";
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import Input from "@mui/joy/Input";
import Typography from "@mui/joy/Typography";
import Button from "@mui/joy/Button";
import Textarea from "@mui/joy/Textarea";
import Slider from "@mui/joy/Slider";
import Modal from "@mui/joy/Modal";
import DialogTitle from "@mui/joy/DialogTitle";
import DialogContent from "@mui/joy/DialogContent";
import DialogActions from "@mui/joy/DialogActions";
import ModalDialog from "@mui/joy/ModalDialog";
import { styled } from "@mui/joy/styles";

import {
  IMAGE_SIZE_LIMIT,
  ACCEPTED_IMAGE_TYPES,
} from "../../configs/VarConfigs";

import UserProfileEditStatusCard from "./UserProfileEditStatusCard";
import { updateUser, checkTokens } from "../../utils/UserManager";
import { dataURLtoFile } from "../../helpers/helper";

import { fetchWithAuth } from "../../utils/FetcherWithJWT";

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

function RequiredFieldIndicator() {
  return (
    <Typography color="danger" level="title-lg">
      *
    </Typography>
  );
}

export default function UserProfileEditCard(props) {
  useEffect(() => {
    checkTokens();
  }, []);

  const userProfileEditType = props.userProfileEditType;

  const { localUserInfo } = useOutletContext();

  const [userProfileSubmissionStatus, setUserProfileSubmissionStatus] =
    useState("no-submission");

  const [firstNameFromDB, setFirstNameFromDB] = useState();
  const [lastNameFromDB, setLastNameFromDB] = useState();
  const [emailFromDB, setEmailFromDB] = useState();
  const [affiliationFromDB, setAffiliationFromDB] = useState();
  const [bio, setBio] = useState();

  const [gitHubLink, setGitHubLink] = useState("");
  const [linkedInLink, setLinkedInLink] = useState("");
  const [googleScholarLink, setGoogleScholarLink] = useState("");
  const [personalWebsiteLink, setPersonalWebsiteLink] = useState("");

  const [firstName, setFirstName] = useState();
  const [lastName, setLastName] = useState();
  const [email, setEmail] = useState();
  const [affiliation, setAffiliation] = useState();

  const [profilePictureFile, setProfilePictureFile] = useState();

  const profilePictureEditor = useRef(null);
  const [confirmedProfilePictureURL, setConfirmedProfilePictureURL] =
    useState();
  const [profilePictureModal, setProfilePictureModal] = useState(false);
  const [profilePictureScale, setProfilePictureScale] = useState(1);
  const [newProfilePicture, setNewProfilePicture] = useState(false);

  const [buttonDisabled, setButtonDisabled] = useState(false);

  useEffect(() => {
    const getLocalUserInfo = async () => {
      setFirstNameFromDB(localUserInfo["first_name"]);
      setFirstName(localUserInfo["first_name"]);
      setLastNameFromDB(localUserInfo["last_name"]);
      setLastName(localUserInfo["last_name"]);
      setEmailFromDB(localUserInfo["email"]);
      setEmail(localUserInfo["email"]);
      setAffiliationFromDB(localUserInfo["affiliation"]);
      setAffiliation(localUserInfo["affiliation"]);
      setBio(localUserInfo["bio"]);
      setGitHubLink(localUserInfo["gitHubLink"]);
      setLinkedInLink(localUserInfo["linkedInLink"]);
      setGoogleScholarLink(localUserInfo["googleScholarLink"]);
      setPersonalWebsiteLink(localUserInfo["personalWebsiteLink"]);
      setConfirmedProfilePictureURL(localUserInfo["avatar_url"]);
    };
    if (localUserInfo && localUserInfo.id) {
      getLocalUserInfo();
    }
  }, [localUserInfo]);

  // Read file to profilePictureFile
  function handleProfilePictureUpload(event) {
    const profilePicture = event.target.files[0];
    if (!profilePicture.type.startsWith("image/")) {
      alert("Please upload an image!");
      return null;
    }
    if (profilePicture.size > IMAGE_SIZE_LIMIT) {
      alert("Please upload an image smaller than 5MB!");
      return null;
    }
    setProfilePictureFile(profilePicture);
    setProfilePictureModal(true);
  }

  // Change the scale in the editor
  function handleScaleChange(event) {
    const scale = parseFloat(event.target.value);
    setProfilePictureScale(scale);
  }

  // Save the edited profile picture
  function handleSavingEditedPicture() {
    if (profilePictureEditor) {
      const profilePictureCropped = profilePictureEditor.current
        ?.getImageScaledToCanvas()
        .toDataURL();
      setConfirmedProfilePictureURL(profilePictureCropped);
      setProfilePictureModal(false);
      setNewProfilePicture(true);
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();
    let avatar_url = "";
    setButtonDisabled(true);

    // If the user uploads and confirms the new picture, use it.
    if (newProfilePicture) {
      const formData = new FormData();
      const confirmedProfilePictureFile = dataURLtoFile(
        confirmedProfilePictureURL,
        "user-upload.png"
      );
      formData.append("file", confirmedProfilePictureFile);
      formData.append("id", localUserInfo.id);

      try {
        const response = await fetchWithAuth(
          `${USER_BACKEND_URL}/api/users/avatar`,
          {
            method: "POST",
            body: formData,
          }
        );

        const profilePictureResult = await response.json();
        TEST_MODE &&
          console.log("Upload avatar returned", profilePictureResult);
        avatar_url = profilePictureResult["image-urls"];
      } catch (error) {
        console.error("Error:", error);
        alert("Error updating user profile!");
      }
    } else {
      avatar_url = confirmedProfilePictureURL;
    }

    const result = await updateUser(
      localUserInfo.id,
      firstName,
      lastName,
      email,
      affiliation,
      bio,
      gitHubLink,
      linkedInLink,
      googleScholarLink,
      personalWebsiteLink,
      avatar_url
    );

    setButtonDisabled(false);

    if (result && result.message === "User updated successfully") {
      setUserProfileSubmissionStatus("update-succeeded");
    } else {
      setUserProfileSubmissionStatus("update-failed");
    }
  }

  // After submission, show users the submission status.
  if (userProfileSubmissionStatus !== "no-submission") {
    return (
      <UserProfileEditStatusCard
        userProfileSubmissionStatus={userProfileSubmissionStatus}
      />
    );
  }

  return (
    <Card
      variant="outlined"
      sx={{
        maxHeight: "max-content",
        maxWidth: "900px",
        width: "100%",
      }}
    >
      <Typography level="title-lg">
        {userProfileEditType === "mandatory"
          ? "Please fill out the required fields"
          : "Update your user profile"}
      </Typography>
      <Typography level="body-sm">
        Fields marked <RequiredFieldIndicator /> are required.
      </Typography>
      <Divider inset="none" />
      <form onSubmit={handleSubmit} name="resourceForm">
        <CardContent
          sx={{
            display: "grid",
            gap: 2,
          }}
        >
          {firstNameFromDB ? (
            <FormControl sx={{ gridColumn: "1/-1" }}>
              <FormLabel>First name</FormLabel>
              <Input name="first_name" disabled value={firstNameFromDB} />
            </FormControl>
          ) : (
            <FormControl sx={{ gridColumn: "1/-1" }}>
              <FormLabel>
                <Typography
                  level="title-md"
                  endDecorator={<RequiredFieldIndicator />}
                >
                  First name
                </Typography>
              </FormLabel>
              <Input
                name="first_name"
                required
                value={firstName}
                onChange={(event) => setFirstName(event.target.value)}
              />
            </FormControl>
          )}
          {lastNameFromDB ? (
            <FormControl sx={{ gridColumn: "1/-1" }}>
              <FormLabel>Last name</FormLabel>
              <Input name="last_name" disabled value={lastNameFromDB} />
            </FormControl>
          ) : (
            <FormControl sx={{ gridColumn: "1/-1" }}>
              <FormLabel>
                <Typography
                  level="title-md"
                  endDecorator={<RequiredFieldIndicator />}
                >
                  Last name
                </Typography>
              </FormLabel>
              <Input
                name="last_name"
                required
                value={lastName}
                onChange={(event) => setLastName(event.target.value)}
              />
            </FormControl>
          )}
          {emailFromDB ? (
            <FormControl sx={{ gridColumn: "1/-1" }}>
              <FormLabel>Email</FormLabel>
              <Input name="email" disabled value={emailFromDB} />
            </FormControl>
          ) : (
            <FormControl sx={{ gridColumn: "1/-1" }}>
              <FormLabel>
                <Typography
                  level="title-md"
                  endDecorator={<RequiredFieldIndicator />}
                >
                  Email
                </Typography>
              </FormLabel>
              <Input
                name="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
            </FormControl>
          )}
          {affiliationFromDB ? (
            <FormControl sx={{ gridColumn: "1/-1" }}>
              <FormLabel>Affiliation</FormLabel>
              <Input name="affiliation" disabled value={affiliationFromDB} />
            </FormControl>
          ) : (
            <FormControl sx={{ gridColumn: "1/-1" }}>
              <FormLabel>
                <Typography
                  level="title-md"
                  endDecorator={<RequiredFieldIndicator />}
                >
                  Affiliation
                </Typography>
              </FormLabel>
              <Input
                name="affiliation"
                required
                value={affiliation}
                onChange={(event) => setAffiliation(event.target.value)}
              />
            </FormControl>
          )}

          <FormControl sx={{ gridColumn: "1/-1" }}>
            <FormLabel>Upload profile picture {"(< 5MB)"}</FormLabel>
            <Button
              component="label"
              role={undefined}
              tabIndex={-1}
              variant="outlined"
              color="primary"
              name="avatar_url"
            >
              Upload your profile picture
              <VisuallyHiddenInput
                type="file"
                accept={ACCEPTED_IMAGE_TYPES}
                onChange={handleProfilePictureUpload}
              />
            </Button>
            <Modal
              aria-labelledby="modal-title"
              aria-describedby="modal-desc"
              open={profilePictureModal}
              onClose={() => setProfilePictureModal(false)}
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <ModalDialog variant="outlined" role="alertdialog">
                <DialogTitle>Edit your profile picture</DialogTitle>
                <Divider />
                <DialogContent>
                  <Stack spacing={2} sx={{ px: 3 }}>
                    <AvatarEditor
                      ref={profilePictureEditor}
                      image={profilePictureFile}
                      width={250}
                      height={250}
                      border={50}
                      scale={profilePictureScale}
                    />
                    <Stack
                      direction="row"
                      spacing={3}
                      alignItems="center"
                      justifyContent="center"
                    >
                      <Typography>Zoom</Typography>
                      <Slider
                        name="scale"
                        onChange={handleScaleChange}
                        min={1}
                        max={2}
                        step={0.01}
                        defaultValue={1}
                      />
                    </Stack>
                  </Stack>
                </DialogContent>
                <DialogActions>
                  <Button
                    variant="solid"
                    color="primary"
                    onClick={handleSavingEditedPicture}
                  >
                    Confirm
                  </Button>
                  <Button
                    variant="plain"
                    color="neutral"
                    onClick={() => setProfilePictureModal(false)}
                  >
                    Cancel
                  </Button>
                </DialogActions>
              </ModalDialog>
            </Modal>
            {confirmedProfilePictureURL && (
              <Stack sx={{ width: "50%" }}>
                <Typography>Profile picture preview</Typography>
                <AspectRatio
                  ratio="1"
                  variant="outlined"
                  sx={{
                    width: 150,
                    bgcolor: "background.level2",
                    borderRadius: "lg",
                  }}
                >
                  <img
                    alt="User profile picture"
                    src={
                      typeof confirmedProfilePictureURL === "string"
                        ? confirmedProfilePictureURL
                        : confirmedProfilePictureURL.low
                    }
                  />
                </AspectRatio>
              </Stack>
            )}
          </FormControl>
          <FormControl sx={{ gridColumn: "1/-1" }}>
            <FormLabel>GitHub profile</FormLabel>
            <Input
              name="github"
              placeholder="https://github.com/{username}"
              value={gitHubLink}
              onChange={(event) => setGitHubLink(event.target.value)}
            />
          </FormControl>
          <FormControl sx={{ gridColumn: "1/-1" }}>
            <FormLabel>LinkedIn profile</FormLabel>
            <Input
              name="linkedin"
              placeholder="https://linkedin.com/in/{username}"
              value={linkedInLink}
              onChange={(event) => setLinkedInLink(event.target.value)}
            />
          </FormControl>
          <FormControl sx={{ gridColumn: "1/-1" }}>
            <FormLabel>Google Scholar profile</FormLabel>
            <Input
              name="google-scholar"
              placeholder="https://scholar.google.com/"
              value={googleScholarLink}
              onChange={(event) => setGoogleScholarLink(event.target.value)}
            />
          </FormControl>
          <FormControl sx={{ gridColumn: "1/-1" }}>
            <FormLabel>Personal website</FormLabel>
            <Input
              name="personal-website"
              placeholder="https://example.com"
              value={personalWebsiteLink}
              onChange={(event) => setPersonalWebsiteLink(event.target.value)}
            />
          </FormControl>
          <FormControl sx={{ gridColumn: "1/-1" }}>
            <FormLabel>Bio</FormLabel>
            <Textarea
              name="contents"
              minRows={4}
              maxRows={10}
              value={bio}
              onChange={(event) => setBio(event.target.value)}
            />
          </FormControl>

          <CardActions sx={{ gridColumn: "1/-1" }}>
            <Button
              type="submit"
              variant="solid"
              color="primary"
              disabled={buttonDisabled}
            >
              {buttonDisabled ? "Sending..." : "Update your profile"}
            </Button>
          </CardActions>
        </CardContent>
      </form>
    </Card>
  );
}
