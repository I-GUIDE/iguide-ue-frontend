import Stack from "@mui/joy/Stack";
import Typography from "@mui/joy/Typography";
import Chip from "@mui/joy/Chip";
import Box from "@mui/joy/Box";

export default function Logo(props) {
  const sx = props.sx;
  return (
    <Typography
      level="h1"
      textColor={"#000"}
      sx={sx}
      endDecorator={
        <Chip component="span" size="sm" color="primary">
          BETA
        </Chip>
      }
      justifyContent="center"
    >
      <Stack
        direction="row"
        spacing={0}
        sx={{
          justifyContent: "center",
          alignItems: "center",
        }}
        className="tourid-0"
      >
        <Box
          component="img"
          src="/images/iguide-word-color.png"
          alt="I-GUIDE"
          sx={{
            width: {
              xs: "120px",
              sm: "150px",
              md: "200px",
              lg: "250px",
            },
            height: "auto",
          }}
        />
        <Box
          component="img"
          src="/images/platform-word-gray.png"
          alt="Platform"
          sx={{
            width: {
              xs: "120px",
              sm: "150px",
              md: "200px",
              lg: "250px",
            },
            height: "auto",
          }}
        />
      </Stack>
    </Typography>
  );
}
