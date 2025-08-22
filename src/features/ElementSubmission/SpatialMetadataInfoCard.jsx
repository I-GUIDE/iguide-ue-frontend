import Box from "@mui/joy/Box";
import Card from "@mui/joy/Card";
import CardContent from "@mui/joy/CardContent";
import Typography from "@mui/joy/Typography";
import Stack from "@mui/joy/Stack";
import Tooltip from "@mui/joy/Tooltip";
import Link from "@mui/joy/Link";
import IconButton from "@mui/joy/IconButton";
import CheckBoxIcon from "@mui/icons-material/CheckBox";

const TEST_MODE = import.meta.env.VITE_TEST_MODE;

export default function SpatialMetadataInfoCard(props) {
  const displayName = props.displayName;
  const addressType = props.addressType;
  const type = props.type;
  const category = props.category;
  const listIndex = props.listIndex;
  const setListIndex = props.setListIndex;
  const selectedSpatialMetadataIndex = props.selectedSpatialMetadataIndex;

  const handleSelect = () => {
    TEST_MODE &&
      console.log("SpatialMetadataInfoCard: Selected option", listIndex + 1);
    setListIndex(listIndex);
  };

  return (
    <Tooltip title="Click to select this location" placement="top">
      <Card
        variant={
          selectedSpatialMetadataIndex === listIndex ? "soft" : "outlined"
        }
        color="primary"
        sx={{
          width: "100%",
          height: "100%",
          "--Card-radius": "15px",
          transition: "transform 0.3s ease, box-shadow 0.3s ease",
          "&:hover": {
            transform: "scale(1.01)",
            boxShadow: "xl",
          },
        }}
        onClick={handleSelect}
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
            <Stack direction="column" sx={{ justifyContent: "space-around" }}>
              <Stack spacing={1} sx={{ alignItems: "flex-start" }}>
                {/* Link component is to change cursor to hand when hovering over */}
                <Link overlay underline="none">
                  <Typography level="title-md">
                    Location {listIndex + 1}
                  </Typography>
                  {selectedSpatialMetadataIndex === listIndex && (
                    <IconButton size="sm" color="primary">
                      <CheckBoxIcon />
                    </IconButton>
                  )}
                </Link>
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
              </Stack>
            </Stack>
          </Box>
        </CardContent>
      </Card>
    </Tooltip>
  );
}
