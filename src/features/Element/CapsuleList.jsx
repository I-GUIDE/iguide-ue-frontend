import { Link as RouterLink } from "react-router";

import Stack from "@mui/joy/Stack";
import Box from "@mui/joy/Box";
import Link from "@mui/joy/Link";
import Chip from "@mui/joy/Chip";
import Tooltip from "@mui/joy/Tooltip";

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
          <Tooltip
            key={item}
            title={`Open tag "${item}"`}
            placement="top"
            enterDelay={1000}
          >
            <Link
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
                variant="plain"
                color="neutral"
                size="md"
                sx={{
                  "--Chip-radius": "15px",
                  overflow: "hidden",
                  boxShadow:
                    "0 1px 2px rgba(0, 0, 0, 0.3), 0 2px 4px rgba(0, 0, 0, 0.2)",
                  transition: "transform 0.25s ease, box-shadow 0.25s ease",
                  cursor: "pointer",
                  "&:hover": {
                    transform: "scale(1.01) translateY(-1px)",
                    boxShadow: "0 8px 16px rgba(0, 0, 0, 0.3)",
                  },
                }}
              >
                {item}
              </Chip>
            </Link>
          </Tooltip>
        ))}
      </Box>
    </Stack>
  );
}
