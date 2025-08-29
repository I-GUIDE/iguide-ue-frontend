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

import { HEADER_HEIGHT, NAVBAR_HEIGHT } from "../../configs/VarConfigs";
import PageNav from "../../components/PageNav";

export default function CommunityHeader(props) {
  const title = props.title ? props.title : "";
  const subtitle = props.subtitle ? props.subtitle : "";
  const icon = props.icon;
  const banner = props.banner;

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
        sx={{ borderRadius: 0, minWidth: 300, flexGrow: 1, px: 1 }}
      >
        <CardCover>
          {banner ? (
            <img src={banner} loading="lazy" alt="Gray scale" />
          ) : (
            <img src="/images/header-bg.png" loading="lazy" alt="Gray scale" />
          )}
        </CardCover>
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `linear-gradient(to bottom, 
            rgba(255, 255, 255, 0) 0%, 
            rgba(255, 255, 255, 0.6) 40%, 
            rgba(255, 255, 255, 1) 100%)`,
            zIndex: 1,
          }}
        />
        {/* Translate 80 to "80px" */}
        <CardContent sx={{ pt: NAVBAR_HEIGHT / 8, zIndex: 2 }}>
          <Container maxWidth="lg">
            <Stack spacing={1.5} sx={{ px: { xs: 1, md: 2, lg: 4 }, py: 3 }}>
              <PageNav
                parentPages={[["All Communities", "/communities"]]}
                currentPage={title || "Unknown Community"}
                fontLevel="body-xs"
                sx={{ px: 0 }}
              />
              <Stack
                direction="row"
                alignItems="flex-end"
                justifyContent="space-between"
                spacing={1.5}
                sx={{ p: 0 }}
              >
                <Stack spacing={1.5} sx={{ p: 0 }}>
                  {title.length > 30 ? (
                    <Typography
                      level="h3"
                      textColor="#000"
                      startDecorator={icon}
                      sx={{
                        color: "#000",
                        textShadow: "0 1px 3px rgba(255,255,255,0.6)", // white glow
                      }}
                    >
                      {title}
                    </Typography>
                  ) : (
                    <Typography
                      level="h2"
                      textColor="#000"
                      startDecorator={icon}
                      sx={{
                        color: "#000",
                        textShadow: "0 1px 3px rgba(255,255,255,0.6)", // white glow
                      }}
                    >
                      {title}
                    </Typography>
                  )}
                  <Typography
                    level="title-sm"
                    textColor="#696969"
                    sx={{
                      textShadow: "0 1px 3px rgba(255,255,255,0.6)", // white glow
                    }}
                  >
                    {subtitle}
                  </Typography>
                </Stack>
                <Tooltip
                  title="Add more elements to this community"
                  placement="top"
                  variant="solid"
                >
                  <Button
                    variant="outlined"
                    size="sm"
                    color="primary"
                    startDecorator={<Add />}
                    sx={{ display: { xs: "none", md: "flex" } }}
                  >
                    Add Elements
                  </Button>
                </Tooltip>
              </Stack>
            </Stack>
          </Container>
        </CardContent>
      </Card>
    </Box>
  );
}
