import React from "react";

import Box from "@mui/joy/Box";
import Button from "@mui/joy/Button";
import Card from "@mui/joy/Card";
import CardContent from "@mui/joy/CardContent";
import Typography from "@mui/joy/Typography";
import Stack from "@mui/joy/Stack";
import Tooltip from "@mui/joy/Tooltip";
import Divider from "@mui/joy/Divider";

const TEST_MODE = import.meta.env.VITE_TEST_MODE;

export default function SpatialMetadataInfoCard(props) {
  const displayName = props.displayName;
  const addressType = props.addressType;
  const type = props.type;
  const category = props.category;
  const listIndex = props.listIndex;
  const setListIndex = props.setListIndex;

  const handleSelect = () => {
    TEST_MODE &&
      console.log("SpatialMetadataInfoCard: Selected option", listIndex + 1);
    setListIndex(listIndex);
  };

  return (
    <Box
      sx={{
        maxWidth: 300,
        position: "relative",
        overflow: { xs: "auto", sm: "initial" },
      }}
    >
      <Card
        variant="outlined"
        orientation="horizontal"
        sx={{
          maxWidth: "100%",
        }}
      >
        <CardContent sx={{ alignItems: "center" }}>
          <Box
            sx={{
              p: 0.5,
              display: "flex",
              gap: 1.5,
              "& > button": { flex: 1 },
            }}
          >
            <Stack spacing={1} sx={{ alignItems: "flex-start" }}>
              <Typography level="title-md">Option {listIndex + 1}</Typography>
              <Typography level="body-sm">
                <Typography level="title-sm">Name: </Typography>
                {displayName}
              </Typography>
              <Typography level="body-sm">
                <Typography level="title-sm">Address type: </Typography>
                {addressType}
              </Typography>
              <Typography level="body-sm">
                <Typography level="title-sm">Type: </Typography>
                {type}
              </Typography>
              <Typography level="body-sm">
                <Typography level="title-sm">Category: </Typography>
                {category}
              </Typography>
              <Divider />
              <Button variant="soft" color="success" onClick={handleSelect}>
                Select
              </Button>
            </Stack>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
