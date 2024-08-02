import * as React from 'react';
import { Link } from 'react-router-dom';

import Jdenticon from 'react-jdenticon';

import Box from '@mui/joy/Box';
import Typography from '@mui/joy/Typography';
import Stack from '@mui/joy/Stack';
import Button from '@mui/joy/Button';
import ButtonGroup from '@mui/joy/ButtonGroup';
import MenuItem from '@mui/joy/MenuItem';
import MenuList from '@mui/joy/MenuList';
import { styled } from '@mui/joy/styles';
import Menu from '@mui/joy/Menu';
import ListDivider from '@mui/joy/ListDivider';
import MenuButton from '@mui/joy/MenuButton';
import Dropdown from '@mui/joy/Dropdown';
import Avatar from '@mui/joy/Avatar';
import Drawer from '@mui/joy/Drawer';
import List from '@mui/joy/List';
import Divider from '@mui/joy/Divider';
import ListItem from '@mui/joy/ListItem';
import ListItemButton from '@mui/joy/ListItemButton';

import { Popper } from '@mui/base/Popper';
import { ClickAwayListener } from '@mui/base/ClickAwayListener';
import MenuIcon from '@mui/icons-material/Menu';

const pages = [['Home', '/'], ['Datasets', '/datasets'], ['Notebooks', '/notebooks'], ['Publications', '/publications'], ['Educational Resources', '/oers']];
const AUTH_BACKEND_URL = import.meta.env.VITE_EXPRESS_BACKEND_URL;

export default function NavBar(props) {
    const isAuthenticated = props.isAuthenticated;
    const localUserInfo = props.localUserInfo;

    const Popup = styled(Popper)({
        zIndex: 1000,
    });

    const buttonRef = React.useRef(null);
    const [open, setOpen] = React.useState(false);

    const toggleDrawer = (inOpen) => (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }
        setOpen(inOpen);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleListKeyDown = (event) => {
        if (event.key === 'Tab') {
            setOpen(false);
        } else if (event.key === 'Escape') {
            buttonRef.current.focus();
            setOpen(false);
        }
    };

    // Redirect users to the auth backend for login
    const login = () => {
        window.open(AUTH_BACKEND_URL + "/login", "_self");
    }

    // Redirect users to auth backend for logout
    const logout = () => {
        window.open(AUTH_BACKEND_URL + "/logout", "_self");
    };

    // If the user is logged in, display the logout button, otherwise login
    function AuthButton() {
        if (isAuthenticated) {
            return (
                <ButtonGroup
                    color="primary"
                    orientation="horizontal"
                    size="md"
                    variant="plain"
                    spacing="0.5rem"
                >
                    <Button size="sm" component="a" href="https://jupyter.iguide.illinois.edu/" target="_blank" rel="noopener noreferrer">
                        JupyterHub
                    </Button>
                    <Dropdown>
                        <MenuButton color="primary">
                            {localUserInfo && localUserInfo.avatar_url ?
                                <Avatar variant="outlined" alt="User avatar" src={localUserInfo.avatar_url} />
                                :
                                <Jdenticon size="200" value={localUserInfo.openid} />
                            }
                        </MenuButton>
                        <Menu placement="bottom-end" color="primary">
                            <Link to={'/user-profile'} style={{ textDecoration: 'none' }}>
                                <MenuItem>
                                    My Profile
                                </MenuItem>
                            </Link>
                            <Link to={'/user-profile-update'} style={{ textDecoration: 'none' }}>
                                <MenuItem>
                                    Update Profile
                                </MenuItem>
                            </Link>
                            <ListDivider />
                            <Typography
                                level="body-xs"
                                textTransform="uppercase"
                                fontWeight="lg"
                                sx={{ px: 1.5, py: 1 }}
                            >
                                New Contribution
                            </Typography>
                            <MenuItem component="a" href="/contribution/dataset">
                                New Dataset
                            </MenuItem>
                            <MenuItem component="a" href="/contribution/notebook">
                                New Notebook
                            </MenuItem>
                            <MenuItem component="a" href="/contribution/publication">
                                New Publication
                            </MenuItem>
                            <MenuItem component="a" href="/contribution/oer">
                                New Educational Resource
                            </MenuItem>
                            <ListDivider />
                            <MenuItem onClick={logout}>
                                Logout
                            </MenuItem>
                        </Menu>
                    </Dropdown>
                </ButtonGroup>
            )
        } else {
            return (
                <ButtonGroup
                    color="primary"
                    orientation="horizontal"
                    size="md"
                    variant="plain"
                    spacing="0.5rem"
                >
                    <Button size="sm" component="a" href="https://jupyter.iguide.illinois.edu/" target="_blank" rel="noopener noreferrer">
                        JupyterHub
                    </Button>
                    <Button size="sm" color="primary" onClick={login}>
                        Login
                    </Button>
                </ButtonGroup>
            )
        }
    }

    function AuthInDrawer() {
        if (isAuthenticated) {
            return (
                <List>
                    <Link to={'/user-profile'} style={{ textDecoration: 'none' }}>
                        <ListItem>
                            My Profile
                        </ListItem>
                    </Link>
                    <Link to={'/user-profile-update'} style={{ textDecoration: 'none' }}>
                        <ListItem>
                            Update Profile
                        </ListItem>
                    </Link>
                    <Divider sx={{ my: 1 }}/>
                    <Typography
                        level="body-xs"
                        textTransform="uppercase"
                        fontWeight="lg"
                        sx={{ px: 1.5, py: 1 }}
                    >
                        New Contribution
                    </Typography>
                    <Link to="/contribution/dataset" style={{ textDecoration: 'none' }}>
                        <ListItem>
                            New Dataset
                        </ListItem>
                    </Link>
                    <Link to="/contribution/notebook" style={{ textDecoration: 'none' }}>
                        <ListItem>
                            New Notebook
                        </ListItem>
                    </Link>
                    <Link to="/contribution/publication" style={{ textDecoration: 'none' }}>
                        <ListItem>
                            New Publication
                        </ListItem>
                    </Link>
                    <Link to="/contribution/oer" style={{ textDecoration: 'none' }}>
                        <ListItem>
                            New Educational Resource
                        </ListItem>
                    </Link>
                    <Divider sx={{ my: 1 }} />
                    <ListItem onClick={logout}>
                        Logout
                    </ListItem>
                </List>
            )
        } else {
            return (
                <List>
                    <ListItem size="sm" color="primary" onClick={login}>
                        <ListItemButton>Login</ListItemButton>
                    </ListItem>
                </List>
            )
        }
    }


    return (
        <Box
            sx={{
                height: 70,
                pt: 1,
                mx: 2,
                display: 'auto'
            }}
        >
            {/* When page is narrower than 960px */}
            <Stack
                direction="row"
                justifyContent="flex-start"
                alignItems="center"
                spacing={2}
                sx={{ display: { xs: 'flex', md: 'none' } }}
            >
                <Stack
                    direction="row"
                    justifyContent="flex-start"
                    alignItems="center"
                >
                    <Button
                        size="lg"
                        ref={buttonRef}
                        id="composition-button"
                        aria-controls={'composition-menu'}
                        aria-haspopup="true"
                        aria-expanded={open ? 'true' : undefined}
                        variant="plain"
                        color="neutral"
                        onClick={toggleDrawer(true)}
                    >
                        <MenuIcon />
                    </Button>
                    <Drawer open={open} onClose={toggleDrawer(false)}>
                        <Box
                            role="presentation"
                            onClick={toggleDrawer(false)}
                            onKeyDown={toggleDrawer(false)}
                            sx={{ p: 2 }}
                        >
                            <List>
                                {pages?.map((page) => (
                                    <Link key={page[1]} to={page[1]} style={{ textDecoration: 'none' }}>
                                        <ListItem key={page[0]}>
                                            <Typography textAlign="center">{page[0]}</Typography>
                                        </ListItem>
                                    </Link>
                                ))}
                            </List>
                            <Divider sx={{ my: 1 }} />
                            <AuthInDrawer />
                        </Box>
                    </Drawer>
                    <Box
                        component="img"
                        sx={{ height: 40, mt: 1, px: 2 }}
                        alt="Logo"
                        src="/images/Logo.png"
                    />
                </Stack>

            </Stack>

            {/* When page is wider than 960px */}
            <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                sx={{ display: { xs: 'none', md: 'flex' } }}
            >
                <Stack
                    direction="row"
                    justifyContent="flex-start"
                    alignItems="center"
                >
                    <Link to={'https://i-guide.io'} style={{ textDecoration: 'none' }}>
                        <Box
                            component="img"
                            sx={{ height: 40, mt: 1, px: 2 }}
                            alt="Logo"
                            src="/images/Logo.png"
                        />
                    </Link>
                    {pages?.map((page) => (
                        <Link key={page[1]} to={page[1]} style={{ textDecoration: 'none' }}>
                            <Button
                                key={page[0]}
                                variant="plain"
                                color="neutral"
                                size="sm"
                                sx={{ alignSelf: 'center' }}
                            >
                                {page[0]}
                            </Button>
                        </Link>
                    ))}
                </Stack>
                <AuthButton />
            </Stack>
        </Box>
    );
}
