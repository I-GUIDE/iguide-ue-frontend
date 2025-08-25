import { useOutletContext } from "react-router";

import Stack from "@mui/joy/Stack";
import Tooltip from "@mui/joy/Tooltip";
import Button from "@mui/joy/Button";
import Typography from "@mui/joy/Typography";
import Container from "@mui/joy/Container";
import Box from "@mui/joy/Box";
import Card from "@mui/joy/Card";
import CardCover from "@mui/joy/CardCover";
import CardContent from "@mui/joy/CardContent";
import Add from "@mui/icons-material/Add";

import {
  HEADER_HEIGHT,
  ELEMENT_TYPE_CAP_PLURAL,
  ELEMENT_TYPE_URI,
  NAVBAR_HEIGHT,
} from "../../configs/VarConfigs";
import { PERMISSIONS } from "../../configs/Permissions";
import PageNav from "../PageNav";
import SearchBar from "../SearchBar";

export default function Header(props) {
  const title = props.title ? props.title : "";
  const subtitle = props.subtitle ? props.subtitle : "";
  const icon = props.icon;
  const currentPage = props.currentPage;
  const parentPages = props.parentPages;
  const contribution = props.contribution ? props.contribution : {};
  const elementType = props.elementType;

  const elementTypeDisplayPlural = elementType
    ? ELEMENT_TYPE_CAP_PLURAL[elementType]
    : "Elements";
  const elementTypeUri = elementType ? ELEMENT_TYPE_URI[elementType] : "any";

  const contributionText = contribution.text;
  const contributionLink = contribution.link;

  const { localUserInfo } = useOutletContext();

  const canContributeElements =
    localUserInfo?.role <= PERMISSIONS["contribute"];

  return (
    <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
        minHeight: HEADER_HEIGHT,
      }}
    >
      <Card
        variant="plain"
        component="li"
        sx={{ borderRadius: 0, minWidth: 300, flexGrow: 1, p: 1 }}
      >
        <CardCover>
          <img src="/images/header-bg.png" loading="lazy" alt="Gray scale" />
        </CardCover>
        {/* Translate 80 to "80px" */}
        <CardContent sx={{ pt: NAVBAR_HEIGHT / 8 }}>
          <Container maxWidth="lg">
            <Stack spacing={3} sx={{ px: 4, py: 2 }}>
              <PageNav
                parentPages={parentPages}
                currentPage={currentPage}
                fontLevel="body-xs"
                sx={{ px: 0, pb: { xs: 1, sm: 2.5 } }}
              />
              <Stack
                direction="row"
                alignItems="flex-end"
                justifyContent="space-between"
                spacing={2}
                sx={{ p: 0 }}
              >
                <Stack spacing={2} sx={{ p: 0 }}>
                  {title.length > 30 ? (
                    <Typography
                      level="h3"
                      textColor="#000"
                      startDecorator={icon}
                    >
                      {title}
                    </Typography>
                  ) : (
                    <Typography
                      level="h2"
                      textColor="#000"
                      startDecorator={icon}
                    >
                      {title}
                    </Typography>
                  )}
                  <Typography level="body-sm" textColor="#696969">
                    {subtitle}
                  </Typography>
                </Stack>
                {canContributeElements && contributionText && (
                  <Tooltip
                    title={contributionText}
                    placement="top"
                    variant="solid"
                  >
                    <Button
                      variant="outlined"
                      color="neutral"
                      startDecorator={<Add />}
                      component="a"
                      href={contributionLink}
                      sx={{ display: { xs: "none", md: "flex" } }}
                    >
                      New
                    </Button>
                  </Tooltip>
                )}
              </Stack>
              {elementType && (
                <Stack
                  direction="row"
                  spacing={2}
                  sx={{
                    justifyContent: "flex-end",
                    alignItems: "center",
                  }}
                >
                  <SearchBar
                    placeholder={`Search ${elementTypeDisplayPlural}...`}
                    searchCategory={elementTypeUri}
                  />
                </Stack>
              )}
            </Stack>
          </Container>
        </CardContent>
      </Card>
    </Box>
  );
}
