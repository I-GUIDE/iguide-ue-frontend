import Typography from "@mui/joy/Typography";
import Stack from "@mui/joy/Stack";
import Link from "@mui/joy/Link";

export default function MapViewer(props) {
  const iframeSrc = props.iframeSrc;

  if (!iframeSrc || iframeSrc === "") {
    return null;
  }

  const iFrameStyle = {
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    width: "100%",
    height: "600px",
  };

  return (
    <Stack spacing={2} sx={{ py: 3 }}>
      <Typography level="h4" fontWeight="lg" mb={1}>
        Map viewer
      </Typography>
      <Typography color="neutral" level="body-xs" variant="plain">
        If the map doesn't display correctly, please click{" "}
        <Link href={iframeSrc} target="_blank" rel="noopener noreferrer">
          here
        </Link>{" "}
        to visit the map's website.
      </Typography>
      <div className="standards-page">
        <iframe style={iFrameStyle} src={iframeSrc} title="Static map" />
      </div>
    </Stack>
  );
}
