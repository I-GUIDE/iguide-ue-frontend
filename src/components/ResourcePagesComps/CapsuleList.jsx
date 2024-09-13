import * as React from "react";

import Divider from "@mui/joy/Divider";
import Typography from "@mui/joy/Typography";
import Stack from "@mui/joy/Stack";
import Box from "@mui/joy/Box";
import Link from "@mui/joy/Link";
import Chip from "@mui/joy/Chip";

export default function CapsuleList(props) {
  const title = props.title;
  const items = props.items;

  // If items object doesn't exist, or it only has one empty item, return null
  if (!items || (items.length == 1 && items[0] == "")) {
    return null;
  }

  // Filter out empty strings
  const filteredItems = items.filter(function (elem) {
    return elem != null && elem !== "";
  });

  return (
    <Stack spacing={2} sx={{ px: { xs: 2, md: 4 }, py: 3 }}>
      <Typography id="notebook-tags" level="h5" fontWeight="lg" mb={1}>
        {title}
      </Typography>
      <Divider inset="none" />
      <Box
        direction="row"
        justifyContent="flex-start"
        alignItems="flex-end"
        spacing={1}
      >
        {filteredItems.map((item) => (
          <Link
            key={item}
            href={"/tag/" + item}
            underline="none"
            sx={{
              "--Link-gap": "0.5rem",
              my: 1,
              mx: 0.5,
            }}
          >
            <Chip variant="outlined" color="neutral" size="md">
              {item}
            </Chip>
          </Link>
        ))}
      </Box>
    </Stack>
  );
}
