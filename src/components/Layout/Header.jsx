import * as React from "react";

import { useOutletContext } from "react-router-dom";

import Stack from "@mui/joy/Stack";
import Typography from "@mui/joy/Typography";
import Container from "@mui/joy/Container";
import Menu from "@mui/joy/Menu";
import MenuButton from "@mui/joy/MenuButton";
import Dropdown from "@mui/joy/Dropdown";
import MenuItem from "@mui/joy/MenuItem";
import Box from "@mui/joy/Box";
import Card from "@mui/joy/Card";
import CardCover from "@mui/joy/CardCover";
import CardContent from "@mui/joy/CardContent";
import LibraryAddIcon from "@mui/icons-material/LibraryAdd";

import { HEADER_HEIGHT } from "../../configs/VarConfigs";

export default function Header(props) {
  const title = props.title ? props.title : "";
  const subtitle = props.subtitle ? props.subtitle : "";
  const icon = props.icon;
  const displayNewContributionButton = props.displayNewContributionButton;

  const [
    isAuthenticated,
    setIsAuthenticated,
    userInfo,
    setUserInfo,
    localUserInfo,
    setLocalUserInfo,
  ] = useOutletContext();

  return (
    <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
        height: HEADER_HEIGHT,
      }}
    >
      <Card
        variant="plain"
        component="li"
        sx={{ borderRadius: 0, minWidth: 300, flexGrow: 1 }}
      >
        <CardCover>
          <img
            src="/images/network-bg.png"
            loading="lazy"
            alt="Network with nodes and connections"
          />
        </CardCover>
        <CardContent>
          <Container maxWidth="xl">
            <Stack spacing={0.5} sx={{ px: 4, py: 2 }}>
              {title.length > 30 ? (
                <Typography level="h3" textColor="#000" startDecorator={icon}>
                  {title}
                </Typography>
              ) : (
                <Typography level="h2" textColor="#000" startDecorator={icon}>
                  {title}
                </Typography>
              )}
              <Stack
                spacing={1}
                direction={{ xs: "column", md: "row" }}
                justifyContent={{ xs: "center", md: "space-between" }}
                alignItems={{ xs: "flex-start", md: "center" }}
              >
                <Typography level="body-md" textColor="#696969">
                  {subtitle}
                </Typography>
                {isAuthenticated && displayNewContributionButton && (
                  <Dropdown>
                    <MenuButton
                      variant="outlined"
                      size="sm"
                      endDecorator={<LibraryAddIcon />}
                    >
                      New Contribution
                    </MenuButton>
                    <Menu placement="bottom-end" color="primary">
                      <MenuItem component="a" href="/contribution/dataset">
                        New Dataset
                      </MenuItem>
                      <MenuItem component="a" href="/contribution/notebook">
                        New Notebook
                      </MenuItem>
                      <MenuItem component="a" href="/contribution/publication">
                        New Publication
                      </MenuItem>
                      <MenuItem component="a" href="/contribution/oer">
                        New Educational Resource
                      </MenuItem>
                    </Menu>
                  </Dropdown>
                )}
              </Stack>
            </Stack>
          </Container>
        </CardContent>
      </Card>
    </Box>
  );
}
