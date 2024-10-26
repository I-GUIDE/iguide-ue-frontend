import React from "react";

import { CssVarsProvider } from "@mui/joy/styles";
import CssBaseline from "@mui/joy/CssBaseline";
import Box from "@mui/joy/Box";
import Grid from "@mui/joy/Grid";
import Stack from "@mui/joy/Stack";
import Container from "@mui/joy/Container";
import Divider from "@mui/joy/Divider";
import Link from "@mui/joy/Link";
import Typography from "@mui/joy/Typography";

import { NO_HEADER_BODY_HEIGHT } from "../../configs/VarConfigs";
import usePageTitle from "../../hooks/usePageTitle";

export default function LicenseAgreement() {
  usePageTitle("Legal - Contributor License Agreement");

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
                <Typography level="h2">
                  I-GUIDE Platform Contributor License Agreement
                </Typography>
                <Typography level="body-lg">
                  Legal Information & Notices
                </Typography>
              </Stack>

              <Divider sx={{ mx: 2, my: 4 }} />

              <Typography level="body-md" sx={{ p: 2 }}>
                Thank you for your interest in contributing to the Institute for
                Geospatial Understanding through an Integrative Discovery
                Environment (I-GUIDE), a project funded by the National Science
                Foundation (NSF). The collaborating institutions in the I-GUIDE
                project include the University of Illinois Urbana-Champaign
                (Illinois), Columbia University, Consortium of Universities for
                the Advancement of Hydrologic Science, Inc. (CUAHSI), Florida
                International University (FIU), Michigan State University, Open
                Geospatial Consortium (OGC), Purdue University, University
                Consortium of Atmospheric Research (UCAR), University Consortium
                for Geographic Information Science (UCGIS), University of
                Minnesota, and Utah State University, referred to in this
                License Agreement as the "Collaborating Institutions".
              </Typography>
              <Typography level="body-md" sx={{ p: 2 }}>
                In order to contribute, you will need to provide your name and
                contact information and sign this I-GUIDE Project Contributor
                License Agreement, which sets the terms and conditions of the
                intellectual property license granted with your contributions.
              </Typography>
              <Typography level="body-md" sx={{ p: 2 }}>
                This I-GUIDE Project Contributor License Agreement ("Agreement")
                is by and between you, any person or entity ("You" or "Your")
                and the Board of Trustees of the University of Illinois, a body
                corporate and politic of the State of Illinois ("Illinois")
                which is the lead institution of the I-GUIDE Project. Please
                read this document carefully before signing and keep a copy for
                your records. By signing this Agreement or making a
                "Contribution" to the "Project" as defined below (even if You do
                not sign), You agree to the following:
              </Typography>

              {/* Item 1 */}
              <Stack spacing={1} sx={{ p: 2 }}>
                <Typography level="body-md">
                  1. "I-GUIDE Platform" is an open-source software project that
                  aims to enable open access and sharing of geospatial
                  data-intensive knowledge under Apache 2.0 license agreement:{" "}
                  <Link
                    href="https://www.apache.org/licenses/LICENSE-2.0"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    https://www.apache.org/licenses/LICENSE-2.0
                  </Link>
                  .
                </Typography>
              </Stack>

              {/* Item 2 */}
              <Stack spacing={1} sx={{ p: 2 }}>
                <Typography level="body-md">
                  2. "Contribution" means all of Your contributions of object
                  code, source code, dataset, content, documentation, and any
                  modifications thereof, to the I-GUIDE Project.
                </Typography>
              </Stack>

              {/* Item 3 */}
              <Stack spacing={1} sx={{ p: 2 }}>
                <Typography level="body-md">
                  3. "Licensed Patents" mean patent claims licensable by You
                  which are necessarily infringed by the making, using, selling,
                  offering for sale, having made, import, or transfer of either
                  Your Contribution alone or when combined with the I-GUIDE
                  Project.
                </Typography>
              </Stack>

              {/* Item 4 */}
              <Stack spacing={1} sx={{ p: 2 }}>
                <Typography level="body-md">
                  4. "Representation." You represent the following to the best
                  of your knowledge:
                </Typography>
                <Typography level="body-md">
                  a. You are at least 18 years of age and have full power and
                  authority to enter into this Agreement and to grant the rights
                  in and to the Contribution as set forth herein (individuals
                  who are under 18 years of age and who wish to contribute to
                  the I-GUIDE Platform may not enter into this Agreement, but
                  may contact I-GUIDE at{" "}
                  <Link
                    href="mailto:help@i-guide.io"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    help@i-guide.io
                  </Link>{" "}
                  to explore alternatives);
                </Typography>
                <Typography level="body-md">
                  b. If your employer has rights to intellectual property that
                  You create as part of the Contribution, You represent that You
                  have obtained permission from Your employer to make the
                  Contribution on behalf of that employer, or Your employer
                  waives any rights in and to Your Contribution, or Your
                  employer authorizes the Contribution and agrees to be bound by
                  the terms herein by signing as an entity below;
                </Typography>
                <Typography level="body-md">c. That either:</Typography>
                <Typography level="body-md">
                  (i). all data, software, and documentation in the Contribution
                  is Your original work and includes complete details of any
                  third-party license and any other restriction (including, but
                  not limited to related patents and trademarks) of which You
                  are personally aware and which are associated with any part of
                  Your Contributions; or
                </Typography>
                <Typography level="body-md">
                  (ii). any part of the Contribution that is not Your original
                  creation is submitted to I-GUIDE Platform separately from any
                  original Contribution, includes the complete details of its
                  source and any corresponding license and any other restriction
                  (including, but not limited to related patents, trademarks,
                  and license agreements) of which You are personally aware.
                </Typography>
                <Typography level="body-md">
                  d. That Your Contribution does not include any viruses, worms,
                  Trojan horses, malicious code or other harmful or destructive
                  content;
                </Typography>
                <Typography level="body-md">
                  e. The I-GUIDE Project delivered under this Agreement may be
                  subject to U.S. export control laws and may be subject to
                  export or import regulations in other countries. You agree to
                  comply strictly with all such laws and regulations and
                  acknowledge that You have the responsibility, at Your own
                  expense, to obtain such licenses to export, re-export, or
                  import as may be required; and
                </Typography>
                <Typography level="body-md">
                  f. Your Contribution does not include any encryption
                  technology and no government license or permission is required
                  for the export, import, transfer or use of the Contribution.
                </Typography>
              </Stack>

              {/* Item 5 */}
              <Stack spacing={1} sx={{ p: 2 }}>
                <Typography level="body-md">
                  5. Notification. Your representations are accurate, and You
                  agree to notify the I-GUIDE Project of any facts or
                  circumstances of which You become aware that would make any of
                  Your representations inaccurate in any respect.
                </Typography>
              </Stack>

              {/* Item 6 */}
              <Stack spacing={1} sx={{ p: 2 }}>
                <Typography level="body-md">
                  6. License grant to Contributions. You grant to the I-GUIDE
                  Project and to recipients of the I-GUIDE Platform
                  (collectively, "Recipients"), a perpetual, irrevocable,
                  non-exclusive, worldwide, royalty-free unrestricted license to
                  use, reproduce, prepare derivative works of, publicly display,
                  publicly perform, distribute, and sublicense the Contribution,
                  and such derivative works, in source code, object code,
                  dataset forms.
                </Typography>
              </Stack>

              {/* Item 7 */}
              <Stack spacing={1} sx={{ p: 2 }}>
                <Typography level="body-md">
                  7. License grant to Patents.
                </Typography>
              </Stack>

              {/* Item 8 */}
              <Stack spacing={1} sx={{ p: 2 }}>
                <Typography level="body-md">
                  8. No support. Except for the rights granted to Recipients
                  above, You reserve all right, title, and interest in and to
                  Your Contribution. You are not expected to provide support for
                  your Contributions.
                </Typography>
              </Stack>

              {/* Item 9 */}
              <Stack spacing={1} sx={{ p: 2 }}>
                <Typography level="body-md">
                  9. No Warranties. Subject to Your representations above, Your
                  Contributions are provided on an "AS-IS" basis WITHOUT
                  WARRANTIES OR CONDITIONS OF ANY KIND (express or implied),
                  including, without limitation, any implied warranty of
                  merchantability and fitness for a particular purpose, and any
                  warranty of non-infringement.
                </Typography>
              </Stack>

              {/* Item 10 */}
              <Stack spacing={1} sx={{ p: 2 }}>
                <Typography level="body-md">
                  10. No Liability. Illinois, Collaborating Institutions, their
                  trustees, directors, officers, employees, students, and agents
                  have no liability for any infringement of any copyright,
                  patent, or other right of third parties in connection with any
                  Contributions, the I-GUIDE Project, or software, and are not
                  liable for any direct, indirect, punitive, special,
                  incidental, consequential, or exemplary damages arising in
                  connection with any Contribution, the I-GUIDE Project, or
                  software.
                </Typography>
              </Stack>

              {/* Item 11 */}
              <Stack spacing={1} sx={{ p: 2 }}>
                <Typography level="body-md">
                  11. Indemnity. You agree to indemnify, defend, and hold
                  Illinois and its subsidiaries, affiliates, officers, agents,
                  employees, partners, licensees, and licensors harmless from
                  any claim or demand, including but not limited to reasonable
                  attorneys' fees, made by any third party due to or arising out
                  of Contributions You submit, post, transmit or otherwise make
                  available through the I-GUIDE Project, as well as Your use of
                  the I-GUIDE software; connection to the I-GUIDE Project; or
                  violation of any rights of another.
                </Typography>
              </Stack>

              {/* Item 12 */}
              <Stack spacing={1} sx={{ p: 2 }}>
                <Typography level="body-md">
                  12. You agree that Illinois may assign this Agreement and
                  I-GUIDE Platform to any third party without notice or consent.
                </Typography>
              </Stack>

              {/* Item 13 */}
              <Stack spacing={1} sx={{ p: 2 }}>
                <Typography level="body-md">
                  13. Illinois is under no obligation to accept or include Your
                  Contribution to the I-GUIDE Platform.
                </Typography>
              </Stack>

              {/* Item 14 */}
              <Stack spacing={1} sx={{ p: 2 }}>
                <Typography level="body-md">
                  14. This Agreement is governed by the laws of the State of
                  Illinois, excluding its conflict of laws provisions.
                </Typography>
              </Stack>

              {/* Update timing info */}
              <Stack spacing={1} sx={{ p: 2 }}>
                <Typography level="body-sm">Updated on Oct 7, 2024</Typography>
              </Stack>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </CssVarsProvider>
  );
}
