import React from "react";

import Box from "@mui/joy/Box";
import Button from "@mui/joy/Button";
import Card from "@mui/joy/Card";
import CardOverflow from "@mui/joy/CardOverflow";
import CardContent from "@mui/joy/CardContent";
import Typography from "@mui/joy/Typography";

const AUTH_BACKEND_URL = import.meta.env.VITE_EXPRESS_BACKEND_URL;

export default function LoginCard() {
  // Redirect users to the auth backend for login
  const login = () => {
    window.open(AUTH_BACKEND_URL + "/login", "_self");
  };

  return (
    <Box
      sx={{
        width: "100%",
        position: "relative",
        overflow: { xs: "auto", sm: "initial" },
      }}
    >
      <Button variant="plain" color="success" onClick={login}>
        <Card variant="outlined" sx={{ width: 320 }}>
          <CardOverflow>
            <img
              src="https://cilogon.org/images/cilogon-ci-64-g.png"
              srcSet="https://cilogon.org/images/cilogon-ci-64-g.png 2x"
              loading="lazy"
              alt="CILogon Service"
            />
          </CardOverflow>
          <CardContent>
            <Typography level="title-md">Please Click to Log In</Typography>
          </CardContent>
        </Card>
      </Button>
    </Box>
  );
}
