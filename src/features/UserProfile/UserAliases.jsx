import { useState } from "react";

import Stack from "@mui/joy/Stack";
import Typography from "@mui/joy/Typography";
import Grid from "@mui/material/Grid2";
import Button from "@mui/joy/Button";
import Modal from "@mui/joy/Modal";
import ModalClose from "@mui/joy/ModalClose";
import Sheet from "@mui/joy/Sheet";
import Chip from "@mui/joy/Chip";
import Link from "@mui/joy/Link";

import UserAliasCard from "./UserAliasCard";

export default function UserAliases(props) {
  const userInfo = props.userInfo;
  const loading = props.loading;

  const [openModal, setOpenModal] = useState(false);

  if (loading || !userInfo) {
    return;
  }

  const userAliases = userInfo.aliases;

  if (!Array.isArray(userAliases) || userAliases.length === 0) {
    return;
  }

  return (
    <>
      <Stack spacing={2}>
        <Stack direction="row" justifyContent="center" spacing={1}>
          <Typography
            level="title-md"
            sx={{
              mb: 1,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            Linked CILogon {userAliases.length > 1 ? "Identities" : "Identity"}
          </Typography>
          <Button variant="soft" size="xs" onClick={() => setOpenModal(true)}>
            What Is This?
          </Button>
        </Stack>

        <Grid
          container
          spacing={3}
          columns={12}
          sx={{ flexGrow: 1 }}
          justifyContent="flex-start"
        >
          {userAliases?.map((alias) => (
            <Grid key={alias.openid} size={{ xs: 12, sm: 6, md: 4 }}>
              <UserAliasCard userAlias={alias} />
            </Grid>
          ))}
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <UserAliasCard defaultMessage="You'll soon be able to manage your linked CILogon identities." />
          </Grid>
        </Grid>
      </Stack>
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
            <Typography level="title-md" fontWeight="lg">
              What is a linked CILogon identity?
            </Typography>
            <Typography level="body-md">
              <Link
                component="a"
                href="https://www.cilogon.org/"
                target="_blank"
                rel="noopener noreferrer"
                fontWeight="lg"
              >
                CILogon
              </Link>{" "}
              allows you to sign in using trusted identity providers like your
              university, ORCID, or Google. This section lists all identities
              linked to your I-GUIDE Platform account.
            </Typography>
            <Typography level="body-md">
              The name of your{" "}
              <Chip color="primary" variant="solid">
                primary
              </Chip>{" "}
              identity provider is displayed on your public user profile.
            </Typography>
            <Typography level="body-md">
              We will soon allow you to manage your linked CILogon identities,
              including adding or removing identities.
            </Typography>
          </Stack>
        </Sheet>
      </Modal>
    </>
  );
}
