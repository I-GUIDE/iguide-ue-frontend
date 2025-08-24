import { Link as RouterLink } from "react-router";

import Stack from "@mui/joy/Stack";
import Box from "@mui/joy/Box";
import Link from "@mui/joy/Link";
import Chip from "@mui/joy/Chip";

export default function CapsuleList(props) {
  const items = props.items;

  // If items object doesn't exist, or it only has one empty item, return null
  if (!items || (items.length === 1 && items[0] === "")) {
    return null;
  }

  // Filter out empty strings
  const filteredItems = items.filter(function (elem) {
    return elem !== null && elem !== "";
  });

  return (
    <Stack spacing={2} sx={{ px: { xs: 2, md: 4 }, py: 2 }}>
      <Box
        direction="row"
        justifyContent="flex-start"
        alignItems="flex-end"
        spacing={1}
      >
        {filteredItems.map((item) => (
          <Link
            key={item}
            component={RouterLink}
            to={"/tag/" + item}
            underline="none"
            sx={{
              "--Link-gap": "0.5rem",
              my: 1,
              mx: 0.5,
            }}
          >
            <Chip
              variant="outlined"
              color="neutral"
              size="md"
              sx={{
                transition: "transform 0.3s ease, box-shadow 0.3s ease",
                "&:hover": {
                  transform: "scale(1.03)",
                  boxShadow: "lg",
                },
              }}
            >
              {item}
            </Chip>
          </Link>
        ))}
      </Box>
    </Stack>
  );
}
