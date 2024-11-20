import React, { useState } from "react";

import Grid from "@mui/material/Grid2";
import Typography from "@mui/joy/Typography";
import ContributorProfileCard from "../components/ContributorProfileCard";



export default function AdminPanel() {
  const [userList, setUserList] = useState([
    {
      id: "0",
      name: "Joe Doe",
      role: "Admin",
      org: "University of Illinois Urbana-Champaign",
      email: "example@gmail.com"
    },
    {
      id: "1",
      name: "James Jamerson",
      role: "User",
      org: "University of Arkansas",
      email: "example@gmail.com"
    },
    {
      id: "2",
      name: "This Guy",
      role: "Trusted User",
      org: "Naperville North High School",
      email: "example@gmail.com"
    },
    {
      id: "2",
      name: "This Guy",
      role: "Trusted User",
      org: "Naperville North High School",
      email: "example@gmail.com"
    },
    {
      id: "2",
      name: "This Guy",
      role: "Trusted User",
      org: "Naperville North High School",
      email: "example@gmail.com"
    }
  ]);

  return(
    <div>
      <Typography level="h1" align="center" sx= {{py: "100"}}>Admin Panel</Typography>
      <Grid
            container
            spacing={3}
            columns={12}
            sx={{ flexGrow: 1 , width: "85%", margin:"auto"}}
            justifyContent="flex-start"
          >
            {userList?.map((user) => (
              <Grid key={user.id} size={{ xs: 12, sm: 6, md: 4 }}>
                <ContributorProfileCard 
                  id = {user.id}
                  name = {user.name} 
                  role = {user.role}
                  org = {user.org}
                  email = {user.email}
                  avatar = "https://backend.i-guide.io/user-uploads/avatars/1722637076955-dsc07617.jpg"
                />
              </Grid>
            ))}
          </Grid>
    </div>
  )
}

