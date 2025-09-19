import { CssVarsProvider } from "@mui/joy/styles";
import CssBaseline from "@mui/joy/CssBaseline";
import Box from "@mui/joy/Box";
import Grid from "@mui/joy/Grid";
import Stack from "@mui/joy/Stack";
import Container from "@mui/joy/Container";
import Divider from "@mui/joy/Divider";
import Link from "@mui/joy/Link";
import Typography from "@mui/joy/Typography";

import { NO_HEADER_BODY_HEIGHT, PT_OFFSET } from "../../configs/VarConfigs";
import usePageTitle from "../../hooks/usePageTitle";

export default function CookiePolicy() {
  usePageTitle("Legal - Cookie Policy");

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
              px: { xs: 1, md: 3, lg: 6 },
              pt: PT_OFFSET,
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
                  I-GUIDE Platform Cookie Policy
                </Typography>
                <Typography level="body-lg">
                  Legal Information & Notices
                </Typography>
              </Stack>

              <Divider sx={{ mx: 2, my: 4 }} />

              <Typography level="body-md" sx={{ p: 2 }}>
                This Cookie Policy explains how I-GUIDE Platform ("we", "our",
                or "us") uses cookies and similar tracking technologies on our
                website{" "}
                <Link
                  href="https://platform.i-guide.io"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  https://platform.i-guide.io
                </Link>{" "}
                ("the Website"). By accessing or using our Website, you consent
                to our use of cookies in accordance with this policy.
              </Typography>

              {/* Item 1 */}
              <Stack spacing={1} sx={{ p: 2 }}>
                <Typography level="title-lg">1. What are cookies?</Typography>
                <Typography level="body-md">
                  Cookies are small text files that are stored on your device
                  when you visit a website. They help the website remember your
                  actions and preferences (such as login information, language,
                  font size, and other display preferences) for a period of
                  time, so you don't have to re-enter them each time you visit
                  the website or browse from one page to another.
                </Typography>
              </Stack>

              {/* Item 2 */}
              <Stack spacing={1} sx={{ p: 2 }}>
                <Typography level="title-lg">
                  2. Types of cookies we use
                </Typography>
                <Typography level="title-md">Necessary Cookies</Typography>
                <Typography level="body-md">
                  These cookies are essential for the operation of our website
                  and enable basic functions like authentication and security.
                  Without these cookies, services like logging in or accessing
                  secure areas of the website cannot be provided.
                </Typography>
                <Typography level="body-md" sx={{ pb: 2 }}>
                  <Typography sx={{ fontWeight: 500 }}>
                    Authentication Cookies:{" "}
                  </Typography>
                  These cookies are used to remember your login details during
                  your visit or when you revisit the website. They allow you to
                  navigate our website without needing to sign in each time.
                </Typography>
                <Typography level="title-md">Performance Cookies</Typography>
                <Typography level="body-md">
                  These cookies collect information about how visitors use our
                  website, such as which pages are visited most often and if
                  users encounter any errors. These cookies help us improve the
                  performance of our website by understanding user behavior.
                </Typography>
                <Typography level="body-md">
                  <Typography sx={{ fontWeight: 500 }}>
                    Google Analytics:{" "}
                  </Typography>
                  We use Google Analytics to track and analyze website traffic.
                  Google Analytics uses cookies to collect information such as
                  how visitors navigate through our website, their IP address,
                  the type of browser used, and the duration of their visits.
                  This data is anonymous and aggregated, helping us improve the
                  structure and content of our website. These cookies are
                  governed by the privacy policies of the third parties that
                  provide them, such as Google. For more information on how
                  Google collects and uses data, please refer to their{" "}
                  <Link
                    href="https://policies.google.com/privacy"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Privacy Policy
                  </Link>
                  .
                </Typography>
              </Stack>

              {/* Item 3 */}
              <Stack spacing={1} sx={{ p: 2 }}>
                <Typography level="title-lg">3. Managing Cookies</Typography>
                <Typography level="body-md">
                  You can control the use of cookies on our Website through your
                  browser settings. Most browsers allow you to refuse cookies,
                  delete cookies, or alert you when a cookie is being placed.
                  However, please note that blocking or deleting cookies may
                  impact your experience on our Website, and certain parts of
                  the Website may not function as intended.
                </Typography>
                <Typography level="body-md">
                  For more information on how to manage cookies in various
                  browsers, please visit:
                </Typography>
                <Typography component="ul" sx={{ pl: 3 }}>
                  <li>
                    <Typography level="body-md">
                      <Link
                        href="https://support.google.com/chrome/answer/95647"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Google Chrome
                      </Link>
                    </Typography>
                  </li>
                  <li>
                    <Typography level="body-md">
                      <Link
                        href="https://support.mozilla.org/en-US/kb/enhanced-tracking-protection-firefox-desktop?redirectslug=enable-and-disable-cookies-website-preferences&redirectlocale=en-US"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Mozilla Firefox
                      </Link>
                    </Typography>
                  </li>
                  <li>
                    <Typography level="body-md">
                      <Link
                        href="https://support.apple.com/guide/safari/manage-cookies-sfri11471/mac"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Safari
                      </Link>
                    </Typography>
                  </li>
                  <li>
                    <Typography level="body-md">
                      <Link
                        href="https://support.microsoft.com/en-us/windows/manage-cookies-in-microsoft-edge-view-allow-block-delete-and-use-168dab11-0753-043d-7c16-ede5947fc64d"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Microsoft Edge
                      </Link>
                    </Typography>
                  </li>
                </Typography>
              </Stack>

              {/* Item 4 */}
              <Stack spacing={1} sx={{ p: 2 }}>
                <Typography level="title-lg">4. Consent</Typography>
                <Typography level="body-md">
                  By using our Website, you consent to the placement of cookies
                  on your device in accordance with this Cookie Policy. If you
                  do not agree with the use of cookies, you should adjust your
                  browser settings or refrain from using the Website.
                </Typography>
              </Stack>

              {/* Item 5 */}
              <Stack spacing={1} sx={{ p: 2 }}>
                <Typography level="title-lg">
                  5. Changes to this Cookie Policy
                </Typography>
                <Typography level="body-md">
                  We may update this Cookie Policy from time to time. Any
                  changes will become effective upon posting of the revised
                  Cookie Policy. We encourage you to review this policy
                  periodically to stay informed about how we use cookies.
                </Typography>
              </Stack>

              {/* Item 6 */}
              <Stack spacing={1} sx={{ p: 2 }}>
                <Typography level="title-lg">6. Contact Us</Typography>
                <Typography level="body-md">
                  If you have any questions or concerns about our use of
                  cookies, please contact us via email at{" "}
                  <Link
                    href="mailto:help@i-guide.io"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    help@i-guide.io
                  </Link>
                  .
                </Typography>
              </Stack>

              {/* Update timing info */}
              <Stack spacing={1} sx={{ p: 2 }}>
                <Typography level="body-sm">Updated on Sep 19, 2025</Typography>
              </Stack>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </CssVarsProvider>
  );
}
