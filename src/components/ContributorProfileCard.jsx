import { useState } from "react";

import Button from "@mui/joy/Button";
import Edit from "@mui/icons-material/Edit";
import Delete from "@mui/icons-material/Delete";
import Done from "@mui/icons-material/Done";
import Close from "@mui/icons-material/Close";

import { Link as RouterLink } from "react-router-dom";

import AspectRatio from "@mui/joy/AspectRatio";
// import Link from "@mui/joy/Link";
import Card from "@mui/joy/Card";
import Modal from "@mui/material/Modal";
import ModalClose from "@mui/joy/ModalClose";
import Sheet from "@mui/joy/Sheet";
import Select from "@mui/joy/Select";
import Option from "@mui/joy/Option";

import CardContent from "@mui/joy/CardContent";
import CardActions from "@mui/joy/CardActions";
import CardOverflow from "@mui/joy/CardOverflow";
import Stack from "@mui/joy/Stack";
import Typography from "@mui/joy/Typography";

import { printListWithDelimiter, removeMarkdown } from "../helpers/helper";
import UserAvatar from "./UserAvatar";
import {
  RESOURCE_TYPE_COLORS,
  RESOURCE_TYPE_NAMES,
} from "../configs/VarConfigs";


export default function ContributorProfileCard(props) {
  const contributorUserId = props.id;
  const contributorName = props.name;
  const [contributorRole, setContributorRole] = useState(props.role);
  const contributorAvatar = props.avatar;
  const contributorOrg = props.org;

  const [roleOpen, setRoleOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  return (
    <>
    <Card
      variant="outlined"
    //   color={categoryColor}
      sx={{
        width: "100%",
        height: "100%",
        "--Card-radius": "15px",
      }}
    >
    <Stack
      direction="row"
    >
      <Stack
          direction="column"
          alignItems="left"
          // justifyContent
          
          spacing={2}
          sx={{ width: "75%", py: 2 }}
      >
          <Typography level="title-lg" sx={{lineHeight: 1}}>{contributorName}</Typography>
          <Typography level="title-md" sx={{lineHeight: 0, fontWeight: "bold"}} textColor="	#696969">{contributorRole}</Typography>
      </Stack>
      <Stack
        direction="row"
        justifyContent="flex-end"
        sx={{ width: "25%" }}
      > 
        <UserAvatar
            link={contributorAvatar}
            userId={contributorUserId}
            sx={{ ml: "auto" }}
        /> 
      </Stack>
    </Stack>
      <Stack
          direction="row"
          alignItems="center"
          spacing={2}
          sx={{ py: 2 }}
      >
        {/*Additional Info*/}
        <Stack
            direction="column"
            alignItems="center"
            spacing={2}
            sx={{ py: 2 }}
        >
        <Typography level="title-sm">{contributorOrg}</Typography>
        </Stack>
        {/*User Options*/}
        <Stack
            direction="column"
            alignItems="center"
            spacing={2}
            sx={{ py: 2 }}
        >
        <Button color="success" size="sm" sx={{ width: "100%", my: 1, mx: 0.5 }} onClick={()=>setRoleOpen(true)}>Change Role<Edit/></Button>
        <Button color="success" size="sm" sx={{ width: "100%", my: 1, mx: 0.5 }}>Edit User<Edit/></Button>
        <Button color="danger" size="sm" sx={{ width: "100%", my: 1, mx: 0.5 }}>Delete User<Delete/></Button>
        </Stack>
      </Stack>
    </Card>
    <Modal
    aria-labelledby="modal-title" // ??
    aria-describedby="modal-desc" // ?? 
    open={roleOpen}
    onClose={() => setRoleOpen(false)}
    sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
  >
    <form
      onSubmit={(event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const formJson = Object.fromEntries((formData).entries());
        setContributorRole(formJson["role"]);
        // Do backend request
      }}
    >
        <Sheet
          variant="outlined"
          sx={{ maxWidth: 500, borderRadius: 'md', p: 3, boxShadow: 'lg' }}
        >
          <ModalClose />
          <Typography
            component="h2"
            id="modal-title"
            level="h4"
            textColor="inherit"
            sx={{ fontWeight: 'lg', mb: 1 }}
          >
            Change User Role
          </Typography>
          <Select defaultValue={contributorRole} name="role">
            <Option value="Admin">Admin</Option>
            <Option value="Trusted User"> Trusted User</Option>
            <Option value="User">User</Option>
          </Select>
          <Button 
            color="danger" 
            size="sm" 
            sx={{ width: "100%", my: 1, mx: 0.5 }}>
              Cancel
              <Close/>
          </Button>
          <Button type="submit" color="success" size="sm" sx={{ width: "100%", my: 1, mx: 0.5 }}>Confirm<Done/></Button>
        </Sheet>
      </form>
    </Modal>
  </>
  );
}
