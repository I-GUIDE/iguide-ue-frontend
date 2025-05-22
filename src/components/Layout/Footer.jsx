import { Link as RouterLink } from "react-router";

import Typography from "@mui/joy/Typography";
import Container from "@mui/joy/Container";
import Box from "@mui/joy/Box";
import Card from "@mui/joy/Card";
import Grid from "@mui/joy/Grid";
import Stack from "@mui/joy/Stack";
import Link from "@mui/joy/Link";
import CardContent from "@mui/joy/CardContent";
import Tooltip from "@mui/joy/Tooltip";

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
          <Container maxWidth="lg" sx={{ flexGrow: 1 }}>
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
                    <Tooltip title="NSF website" placement="top">
                      <Box
                        component="img"
                        sx={{ height: 55, mx: 1 }}
                        alt="Logo"
                        src="/images/nsf.png"
                      />
                    </Tooltip>
                  </Link>
                </Stack>
              </Grid>
              <Grid xs={12} sm={10} lg={4}>
                <Typography
                  level="h5"
                  textColor="#606060"
                  sx={{
                    py: 0.2,
                    textAlign: {
                      xs: "center",
                      sm: "left",
                    },
                  }}
                >
                  © {new Date().getFullYear()} I-GUIDE All Rights Reserved.
                </Typography>
                <Typography
                  level="body-xs"
                  textColor="#606060"
                  sx={{
                    py: 0.2,
                    textAlign: {
                      xs: "center",
                      sm: "left",
                    },
                  }}
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
                  sx={{
                    py: 0.2,
                    textAlign: {
                      xs: "center",
                      sm: "left",
                    },
                  }}
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
                      <Tooltip
                        title="I-GUIDE support email"
                        placement="top"
                        arrow
                      >
                        <EmailIcon
                          aria-label="I-GUIDE support email"
                          sx={{ color: grey[700] }}
                        />
                      </Tooltip>
                    </Link>
                  </Box>
                  <Box sx={{ width: "flex", px: 0.5 }}>
                    <Link
                      href="https://www.youtube.com/@nsf-iguide"
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ textDecoration: "none" }}
                    >
                      <Tooltip
                        title="I-GUIDE YouTube channel"
                        placement="top"
                        arrow
                      >
                        <YouTubeIcon
                          aria-label="I-GUIDE YouTube"
                          sx={{ color: grey[700] }}
                        />
                      </Tooltip>
                    </Link>
                  </Box>
                  <Box sx={{ width: "flex", px: 0.5 }}>
                    <Link
                      href="https://x.com/NSFiGUIDE"
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ textDecoration: "none" }}
                    >
                      <Tooltip title="I-GUIDE X account" placement="top" arrow>
                        <XIcon
                          aria-label="I-GUIDE X"
                          sx={{ color: grey[700] }}
                        />
                      </Tooltip>
                    </Link>
                  </Box>
                  <Box sx={{ width: "flex", px: 0.5 }}>
                    <Link
                      href="https://www.linkedin.com/company/nsf-i-guide/"
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ textDecoration: "none" }}
                    >
                      <Tooltip
                        title="I-GUIDE LinkedIn profile"
                        placement="top"
                        arrow
                      >
                        <LinkedInIcon
                          aria-label="I-GUIDE LinkedIn"
                          sx={{ color: grey[700] }}
                        />
                      </Tooltip>
                    </Link>
                  </Box>
                </Stack>
              </Grid>
              <Grid xs={12}>
                <Stack
                  direction={{ xs: "column", sm: "row" }}
                  justifyContent="center"
                  alignItems="center"
                  spacing={{ xs: 1, sm: 2 }}
                  sx={{ display: "flex" }}
                >
                  <Link
                    component={RouterLink}
                    to="https://i-guide.io"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Typography level="body-xs">I-GUIDE</Typography>
                  </Link>
                  <Link component={RouterLink} to="/contact-us">
                    <Typography level="body-xs">Contact Us</Typography>
                  </Link>
                  <Link component={RouterLink} to="/terms-of-use">
                    <Typography level="body-xs">Terms of Use</Typography>
                  </Link>
                  <Link
                    component={RouterLink}
                    to="/contributor-license-agreement"
                  >
                    <Typography level="body-xs">
                      Contributor License Agreement
                    </Typography>
                  </Link>
                  <Link component={RouterLink} to="/sitemap">
                    <Typography level="body-xs">Site Map</Typography>
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
