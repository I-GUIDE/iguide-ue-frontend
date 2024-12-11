import { useState } from "react";

import Button from "@mui/joy/Button";
import Edit from "@mui/icons-material/Edit";
import ManageAccounts from "@mui/icons-material/ManageAccounts";
import Delete from "@mui/icons-material/Delete";
import Done from "@mui/icons-material/Done";
import Close from "@mui/icons-material/Close";

import { Link as RouterLink } from "react-router-dom";

// import Link from "@mui/joy/Link";
import Card from "@mui/joy/Card";
import Modal from "@mui/joy/Modal";
import ModalClose from "@mui/joy/ModalClose";
import Sheet from "@mui/joy/Sheet";
import Select from "@mui/joy/Select";
import Option from "@mui/joy/Option";
import Stack from "@mui/joy/Stack";
import Typography from "@mui/joy/Typography";
import Tooltip from '@mui/joy/Tooltip';
import CardContent from "@mui/joy/CardContent";

import { printListWithDelimiter, removeMarkdown } from "../helpers/helper";
import UserAvatar from "./UserAvatar";
import {
  RESOURCE_TYPE_COLORS,
  RESOURCE_TYPE_NAMES,
} from "../configs/VarConfigs";
import { EditAttributesOutlined } from "@mui/icons-material";


export default function ContributorProfileCard(props) {
  const contributorId = props.id;
  const contributorName = props.name;
  const [contributorRole, setContributorRole] = useState(props.role);
  const contributorAvatar = props.avatar;
  const contributorOrg = props.org;
  const contributorEmail = props.email;

  const deleteContributor = props.deleteContributor;

  const [roleOpen, setRoleOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  return (
    <>
    {/* <Link
      component={RouterLink}
      to={"/contributor/" + contributorId}
      style={{ textDecoration: "none" }}
    > */}
      <Card
        variant="outlined"
        justifyContent="center"
        sx={{
          width: "100%",
          height: "100%",
          "--Card-radius": "15px",
          "&:hover": {
          borderColor: "theme.vars.palette.primary.outlinedHoverBorder",
          transform: "translateY(-2px)",
          }
        }}
      >
        <CardContent>
          <Stack
            direction="row"
          >
            <Stack
                direction="column"
                alignItems="left"
                spacing={2}
                sx={{ width: "85%", py: 2 }}
            >
              <Typography level="title-lg" sx={{lineHeight: 1}}>{contributorName}</Typography>
              <Typography 
                level="title-md" 
                sx={{lineHeight: 0, fontWeight: "bold"}} 
                textColor="	#696969">
                  {contributorRole}
              </Typography>
            </Stack>
            <Stack
              direction="row"
              justifyContent="flex-end"
              sx={{ width: "25%" }}
            > 
              <UserAvatar
                  link={contributorAvatar}
                  userId={contributorId}
                  sx={{ ml: "auto" }}
              /> 
            </Stack>
          </Stack>
          <Stack direction="column">
            <Typography level="title-sm">{contributorOrg}</Typography>
            <Typography level="title-sm">{contributorEmail}</Typography>
          </Stack>
          <Stack
              direction="row"
              alignItems="center"
              spacing={0}
              sx={{ py: 2 }}
          >
            <Stack
                direction="column"
                alignItems="center"
                spacing={2}
                sx={{ py: 2 }}
            >
            </Stack>
            {/*User Options*/}
            <Stack
                direction="row"
                width="100%"
                justifyContent="space-between"
                // alignItems="center"
                spacing={2}
                sx={{ margin: "auto"}} 
            >
            
            
            <Tooltip title="Manage Role">
              <Button 
                color="primary" 
                size="sm" 
                sx={{ width: "50%" }} 
                onClick={()=>setRoleOpen(true)}>
                  <ManageAccounts/>
              </Button>
            </Tooltip>
            <Tooltip title="Edit Contributor Profile">
              <Button 
                color="primary" 
                size="sm" 
                sx={{ width: "50%" }}>
                  <Edit/>
                </Button>
            </Tooltip>
            <Tooltip title="Delete User">
            <Button 
                color="danger" 
                size="sm" 
                sx={{ width: "50%"}} 
                onClick={()=>setDeleteOpen(true)}>
                  <Delete/>
              </Button>
            </Tooltip>
            </Stack>
          </Stack>
        </CardContent>
        
      </Card>
    {/* </Link> */}



  {/* Change Role Modal */}
  <Modal
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
        setRoleOpen(false);
        // Do backend request
      }}
    >
        <Sheet
          variant="outlined"
          sx={{ maxWidth: 500, borderRadius: 'md', p: 3, boxShadow: 'lg' }}
        >
          <ModalClose />
          <Typography
            level="h3"
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
            sx={{ width: "100%", my: 1, mx: 0.5 }}
            onClick={()=>setRoleOpen(false)}
            >
              Cancel
              <Close/>
          </Button>
          <Button 
            type="submit" 
            color="primary" 
            size="sm" 
            sx={{ width: "100%", my: 1, mx: 0.5 }}>
              Confirm 
              <Done/>
          </Button>
        </Sheet>
      </form>
    </Modal>

  {/* Delete User Modal */}
  <Modal
    open={deleteOpen}
    onClose={() => setDeleteOpen(false)}
    sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
  >
    <form
      onSubmit={(event) => {
        
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const formJson = Object.fromEntries((formData).entries());
        deleteContributor(contributorId);
        // Do backend request
        setDeleteOpen(false);
        
      }}
    >
        <Sheet
          variant="outlined"
          sx={{ maxWidth: 500, borderRadius: 'md', p: 3, boxShadow: 'lg' }}
        >
          <ModalClose />
          <Typography
            align="center"
            level="h3"
            sx={{ fontWeight: 'lg', mb: 1 }}
          >
            Delete User {contributorName}
          </Typography>
          <Typography
            align="center"
            level="title-sm"
          >
            Are you sure you would like to delete user? This action cannot be undone.
          </Typography>
          <Stack direction="row">
            <Button 
              color="primary" 
              size="sm" 
              sx={{ width: "100%", my: 1, mx: 0.5 }}
              onClick={()=>setDeleteOpen(false)}
              >
                Cancel
                
            </Button>
            <Button 
              type="submit" 
              color="danger" 
              size="sm" 
              sx={{ width: "100%", my: 1, mx: 0.5 }}>
                Delete 
                <Delete/>
            </Button>
          </Stack>
        </Sheet>
      </form>
    </Modal>
  </>
  );
}
