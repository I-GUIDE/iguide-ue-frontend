import Card from "@mui/joy/Card";
import Box from "@mui/joy/Box";
import Chip from "@mui/joy/Chip";
import Stack from "@mui/joy/Stack";
import Typography from "@mui/joy/Typography";
import CardContent from "@mui/joy/CardContent";

export default function UserAliasCard(props) {
  const userAlias = props.userAlias;
  const defaultMessage = props.defaultMessage;

  if (defaultMessage) {
    return (
      <Card
        variant="plain"
        sx={{
          width: "100%",
          height: "100%",
          "--Card-radius": "15px",
          overflow: "hidden",
          border: "2px dashed rgba(0, 0, 0, 0.3)",
          boxShadow: "none",
        }}
      >
        <CardContent>
          <Typography level="body-sm">{defaultMessage}</Typography>
        </CardContent>
      </Card>
    );
  }

  const affiliation = userAlias.affiliation;
  const email = userAlias.email;
  const isPrimary = userAlias["is-primary"];

  return (
    <Box position="relative" width="100%" height="100%">
      {isPrimary && (
        <Chip
          size="md"
          color="primary"
          variant="solid"
          label="Primary identity"
          sx={{
            position: "absolute",
            top: -10,
            right: -10,
            zIndex: 100,
          }}
        >
          Primary
        </Chip>
      )}
      <Card
        variant="plain"
        sx={{
          width: "100%",
          height: "100%",
          "--Card-radius": "15px",
          overflow: "hidden",
          boxShadow: `
            0 1px 2px rgba(0, 0, 0, 0.3),
            0 2px 4px rgba(0, 0, 0, 0.2)
          `,
        }}
      >
        <CardContent>
          <Stack direction="column" spacing={1}>
            {affiliation ? (
              <Typography level="body-sm">
                <Typography fontWeight="lg">
                  Identity Provider (IdP):{" "}
                </Typography>
                {affiliation}
              </Typography>
            ) : (
              <Typography level="body-sm" color="danger">
                No affiliation returned by CILogon
              </Typography>
            )}
            {email ? (
              <Typography level="body-sm">
                <Typography fontWeight="lg">Email:</Typography> {email}
              </Typography>
            ) : (
              <Typography level="body-sm" color="danger">
                No email returned by CILogon
              </Typography>
            )}
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}
