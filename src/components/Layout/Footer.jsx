import * as React from "react";

import { Link as RouterLink } from "react-router-dom";

import Typography from "@mui/joy/Typography";
import Container from "@mui/joy/Container";
import Box from "@mui/joy/Box";
import Card from "@mui/joy/Card";
import Grid from "@mui/joy/Grid";
import Stack from "@mui/joy/Stack";
import Link from "@mui/joy/Link";
import CardContent from "@mui/joy/CardContent";

import { grey } from "@mui/material/colors";
import XIcon from "@mui/icons-material/X";
import YouTubeIcon from "@mui/icons-material/YouTube";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import EmailIcon from "@mui/icons-material/Email";

import { FOOTER_HEIGHT } from "../../configs/VarConfigs";

export default function Footer() {
  return (
    <Box sx={{ display: "flex", flexWrap: "wrap", minHeight: FOOTER_HEIGHT }}>
      <Card
        component="li"
        color="neutural"
        sx={{ borderRadius: 0, flexGrow: 1 }}
      >
        <CardContent sx={{ justifyContent: "center" }}>
          <Container maxWidth="xl" sx={{ flexGrow: 1 }}>
            <Grid
              container
              spacing={1}
              justifyContent="center"
              alignItems="center"
            >
              <Grid xs={12} sm={2} lg={1}>
                <Stack
                  direction="row"
                  justifyContent="center"
                  alignItems="center"
                  sx={{ display: "flex" }}
                >
                  <Link
                    href={"https://www.nsf.gov/"}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ textDecoration: "none" }}
                  >
                    <Box
                      component="img"
                      sx={{ height: 55, mx: 1 }}
                      alt="Logo"
                      src="/images/nsf.png"
                    />
                  </Link>
                </Stack>
              </Grid>
              <Grid xs={12} sm={10} lg={4}>
                <Typography level="h5" textColor="#606060" sx={{ py: 0.2 }}>
                  © {new Date().getFullYear()} I-GUIDE All Rights Reserved.
                </Typography>
                <Typography
                  level="body-xs"
                  textColor="#606060"
                  sx={{ py: 0.2 }}
                >
                  Institute for Geospatial Understanding through an Integrative
                  Discovery Environment (I-GUIDE) is supported by the National
                  Science Foundation.
                </Typography>
              </Grid>
              <Grid xs={12} sm={9} lg={5}>
                <Typography
                  level="body-xs"
                  textColor="#606060"
                  sx={{ py: 0.2 }}
                >
                  This material is based upon work supported by the National
                  Science Foundation under award No. 2118329. Any opinions,
                  findings, conclusions, or recommendations expressed in this
                  material are those of the author(s) and do not necessarily
                  reflect the views of the National Science Foundation.
                </Typography>
              </Grid>
              <Grid xs={12} sm={3} lg={2}>
                <Stack
                  direction="row"
                  justifyContent="center"
                  alignItems="center"
                  spacing={1}
                  sx={{ display: "flex" }}
                >
                  <Box sx={{ width: "flex", px: 0.5 }}>
                    <Link
                      href="mailto:help@i-guide.io"
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ textDecoration: "none" }}
                    >
                      <EmailIcon sx={{ color: grey[700] }} />
                    </Link>
                  </Box>
                  <Box sx={{ width: "flex", px: 0.5 }}>
                    <Link
                      href="https://www.youtube.com/@nsf-iguide"
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ textDecoration: "none" }}
                    >
                      <YouTubeIcon sx={{ color: grey[700] }} />
                    </Link>
                  </Box>
                  <Box sx={{ width: "flex", px: 0.5 }}>
                    <Link
                      href="https://x.com/NSFiGUIDE"
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ textDecoration: "none" }}
                    >
                      <XIcon sx={{ color: grey[700] }} />
                    </Link>
                  </Box>
                  <Box sx={{ width: "flex", px: 0.5 }}>
                    <Link
                      href="https://www.linkedin.com/company/nsf-i-guide/"
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ textDecoration: "none" }}
                    >
                      <LinkedInIcon sx={{ color: grey[700] }} />
                    </Link>
                  </Box>
                </Stack>
              </Grid>
              <Grid xs={12}>
                <Stack
                  direction="row"
                  justifyContent="center"
                  alignItems="center"
                  spacing={1}
                  sx={{ display: "flex" }}
                >
                  <Link component={RouterLink} to="/terms-of-use">
                    <Typography level="body-xs">Terms of Use</Typography>
                  </Link>
                </Stack>
              </Grid>
            </Grid>
          </Container>
        </CardContent>
      </Card>
    </Box>
  );
}
