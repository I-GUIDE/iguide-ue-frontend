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

export default function Header(props) {
  const title = props.title ? props.title : "";
  const subtitle = props.subtitle ? props.subtitle : "";
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
    <Box sx={{ display: "flex", flexWrap: "wrap", p: 0, m: 0, height: 150 }}>
      <Card component="li" sx={{ borderRadius: 0, minWidth: 300, flexGrow: 1 }}>
        <CardCover>
          <img
            src="/images/green-blue.png"
            srcSet="/images/green-blue.png 2x"
            loading="lazy"
            alt=""
          />
        </CardCover>
        <CardContent>
          <Container maxWidth="xl">
            <Stack spacing={1} sx={{ m: 3 }}>
              {title.length > 30 ? (
                <Typography level="h3" textColor="#fff">
                  {title}
                </Typography>
              ) : (
                <Typography level="h2" textColor="#fff">
                  {title}
                </Typography>
              )}
              {/* {isAuthenticated && displayNewContributionButton ? ( */}
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <Typography level="body-md" textColor="#fff">
                  {subtitle}
                </Typography>
                {isAuthenticated && displayNewContributionButton && (
                  <Dropdown>
                    <MenuButton
                      variant="solid"
                      size="sm"
                      color="warning"
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
