import React, { useState, useEffect } from "react";

import { CssVarsProvider } from "@mui/joy/styles";
import CssBaseline from "@mui/joy/CssBaseline";
import Box from "@mui/joy/Box";
import Grid from "@mui/joy/Grid";
import Stack from "@mui/joy/Stack";
import Container from "@mui/joy/Container";
import Divider from "@mui/joy/Divider";
import Link from "@mui/joy/Link";

import { NO_HEADER_BODY_HEIGHT } from "../../configs/VarConfigs";
import Typography from "@mui/joy/Typography";

export default function TermsOfUse() {
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
              <Stack spacing={3} alignItems="center" sx={{ p: 2 }}>
                <Typography level="h1">
                  I-GUIDE Platform Terms of Use
                </Typography>
                <Typography level="title-lg">
                  Legal Information & Notices
                </Typography>
              </Stack>

              <Divider sx={{ my: 4 }} />

              <Typography level="body-md" sx={{ p: 2 }}>
                The Institute for Geospatial Understanding through an
                Integrative Discovery Environment (I-GUIDE) is funded as a
                project by the National Science Foundation (NSF), which is
                referred to as “Project” in these Terms of Use. The
                collaborating institutions in the Project include the University
                of Illinois Urbana-Champaign (Illinois), Columbia University,
                Consortium of Universities for the Advancement of Hydrologic
                Science, Inc. (CUAHSI), Florida International University (FIU),
                Michigan State University, Open Geospatial Consortium (OGC),
                Purdue University, University Consortium of Atmospheric Research
                (UCAR), University Consortium of Geographic Information Science
                (UCGIS), University of Minnesota, and Utah State University,
                referred to in these Terms of Use as the “Participating
                Institutions”. The I-GUIDE Platform is hosted at{" "}
                <Link href="https://platform.i-guide.io">
                  platform.i-guide.io
                </Link>
                . The I-GUIDE Platform, services, and{" "}
                <Link href="https://i-guide.io">i-guide.io</Link> website,
                including any information, products, or applications available
                through the Project services, platform and website, are referred
                to in these Terms of Use as the “Site”. The Project aims to
                enable open access and sharing of geospatial data-intensive
                knowledge, under Apache 2.0 license agreement. The University of
                Illinois Urbana-Champaign represented by The Board of Trustees
                of the Illinois of Illinois (“Illinois”, “we”, “our”, “us”) is
                the lead institution of the Project.
              </Typography>
              <Typography level="body-md" sx={{ p: 2 }}>
                By using the Site, you agree that you have read and accepted the
                terms of use as presented below (“Terms”). The Terms apply to
                you because You (“End User”, “you”) are using, contributing to
                or installing software of the Project, or otherwise accessing
                the Site. Please read these Terms carefully. The Terms govern
                your use of the Site and any incorporated content (such as
                Illinois, Participating Institutions or third party software,
                text, data, information, or graphics) made available through the
                Site. By continuing to use the Site, You accept these Terms. If
                You are not willing to be bound by these Terms, please stop
                using this Site.
              </Typography>

              {/* Item 1 */}
              <Stack spacing={1} sx={{ p: 2 }}>
                <Typography level="title-lg">1. Governing Terms</Typography>
                <Typography level="body-md">
                  The Terms are governed by Illinois's web privacy notices and
                  policy links presented here:
                  https://www.vpaa.uillinois.edu/resources/web_privacy and
                  https://www.vpaa.uillinois.edu/resources/terms_of_use/.
                </Typography>
              </Stack>

              {/* Item 2 */}
              <Stack spacing={1} sx={{ p: 2 }}>
                <Typography level="title-lg">
                  2. Intellectual Property
                </Typography>
                <Typography level="body-md">
                  You hereby accept that all intellectual property, including
                  copyrights, and other proprietary rights in or related to
                  Project and Site are, and will remain, the exclusive property
                  of the Project, Participating Institutions or Illinois whether
                  or not specifically recognized or perfected under applicable
                  law. As End User, You will not take any action that
                  jeopardizes Project's, Participating Institutions' or
                  Illinois' proprietary rights.
                </Typography>
              </Stack>

              {/* Item 3 */}
              <Stack spacing={1} sx={{ p: 2 }}>
                <Typography level="title-lg">
                  3. Credit and Attribution
                </Typography>
                <Typography level="body-md">
                  You agree to credit and attribute the authors and creators of
                  Project that You use with the copyright notice or statement of
                  credit/attribution as customarily acceptable in industry.
                </Typography>
              </Stack>

              {/* Item 4 */}
              <Stack spacing={1} sx={{ p: 2 }}>
                <Typography level="title-lg">4. Limitations</Typography>
                <Typography level="body-md">
                  In no event shall Illinois, Participating Institutions' or
                  their employees be liable for any damages (including, without
                  limitation, damages for loss of data or profit, or due to
                  business interruption) arising out of the use or inability to
                  use the content on Site, even if Illinois or an Illinois
                  authorized representative has been notified orally or in
                  writing of the possibility of such damage. Because some
                  jurisdictions do not allow limitations on implied warranties,
                  or limitations of liability for consequential or incidental
                  damages, these limitations may not apply to you.
                </Typography>
              </Stack>

              {/* Item 5 */}
              <Stack spacing={1} sx={{ p: 2 }}>
                <Typography level="title-lg">
                  5. Modification of Site and Terms
                </Typography>
                <Typography level="body-md">
                  Illinois reserves the right to modify the Site and may
                  discontinue, temporarily or permanently, the Site for any
                  reason, at its sole discretion, with or without notice to You.
                  Illinois may likewise change the Terms from time to time with
                  or without notice to you. You agree to review the Terms
                  periodically to ensure that you are aware of any
                  modifications. Your continued access to the Site after the
                  modifications have become effective shall be deemed your
                  conclusive acceptance of the modified Terms.
                </Typography>
              </Stack>

              {/* Item 6 */}
              <Stack spacing={1} sx={{ p: 2 }}>
                <Typography level="title-lg">6. Termination</Typography>
                <Typography level="body-md">
                  If you violate or fail to comply with any of these Terms or in
                  Illinois' sole discretion restrict or inhibit any other user
                  from using or enjoying the Site, Illinois may terminate your
                  access to the Site account without notice to You.
                </Typography>
              </Stack>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </CssVarsProvider>
  );
}
