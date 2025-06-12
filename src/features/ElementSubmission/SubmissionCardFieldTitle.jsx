import Box from "@mui/joy/Box";
import Typography from "@mui/joy/Typography";
import Tooltip from "@mui/joy/Tooltip";

import InfoOutlined from "@mui/icons-material/InfoOutlined";

function RequiredFieldIndicator() {
  return (
    <Typography color="danger" level="title-lg" sx={{ pr: 0.5 }}>
      *
    </Typography>
  );
}

export default function SubmissionCardFieldTitle(props) {
  const tooltipTitle = props.tooltipTitle;
  const tooltipContent = props.tooltipContent;
  const fieldRequired = props.fieldRequired;

  const showTooltip = tooltipTitle || tooltipContent;

  return (
    <Typography
      level="title-sm"
      endDecorator={
        <>
          {fieldRequired && <RequiredFieldIndicator />}
          {showTooltip && (
            <Tooltip
              placement="top-start"
              variant="outlined"
              size="lg"
              arrow
              title={
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    maxWidth: 320,
                    justifyContent: "center",
                    p: 1,
                  }}
                >
                  <Typography level="title-sm" sx={{ pb: 1 }}>
                    {tooltipTitle}
                  </Typography>
                  <Typography level="body-sm">{tooltipContent}</Typography>
                </Box>
              }
            >
              <InfoOutlined size="lg" />
            </Tooltip>
          )}
        </>
      }
    >
      {props.children}
    </Typography>
  );
}
