import Button from "@mui/joy/Button";
import Tooltip from "@mui/joy/Tooltip";

export default function FloatingButton(props) {
  const onClick = props.onClick;
  const label = props.label;

  return (
    <Tooltip title="Take a tour of the homepage" variant="solid">
      <Button
        variant="soft"
        size="lg"
        onClick={onClick}
        sx={{
          position: "fixed",
          bottom: 24,
          right: 24,
          borderRadius: "999px",
          textTransform: "none",
          paddingX: 3,
          paddingY: 1,
          fontSize: "16px",
          zIndex: 1000,
          borderWidth: 2,
          boxShadow: `
            0px 3px 5px -1px rgba(0,0,0,0.2),
            0px 6px 10px 0px rgba(0,0,0,0.14),
            0px 1px 18px 0px rgba(0,0,0,0.12)
          `,
          "&:hover": {
            borderColor: "darkblue",
            transform: "translateY(-2px)",
            boxShadow: `
              0px 5px 5px -3px rgba(0,0,0,0.2),
              0px 8px 10px 1px rgba(0,0,0,0.14),
              0px 3px 14px 2px rgba(0,0,0,0.12)
            `,
          },
        }}
      >
        {label}
      </Button>
    </Tooltip>
  );
}
