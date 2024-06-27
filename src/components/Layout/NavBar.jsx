import * as React from 'react';
import { Link } from 'react-router-dom';

import Box from '@mui/joy/Box';
import Typography from '@mui/joy/Typography';
import Stack from '@mui/joy/Stack';
import Button from '@mui/joy/Button';
import MenuItem from '@mui/joy/MenuItem';
import MenuList from '@mui/joy/MenuList';
import { Popper } from '@mui/base/Popper';
import { ClickAwayListener } from '@mui/base/ClickAwayListener';
import { styled } from '@mui/joy/styles';
import MenuIcon from '@mui/icons-material/Menu';

import { useAuth } from "react-oidc-context";

const pages = [['Home', '/'], ['Datasets', '/datasets'], ['Notebooks', '/notebooks'], ['Publications', '/publications'], ['Educational Resources', '/oers']];

export default function NavBar() {
    const Popup = styled(Popper)({
        zIndex: 1000,
    });

    const buttonRef = React.useRef(null);
    const [open, setOpen] = React.useState(false);

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

    function LoginButton() {
        const auth = useAuth();

        switch (auth.activeNavigator) {
            case "signinSilent":
                return <div>Signing you in...</div>;
            case "signoutRedirect":
                return <div>Signing you out...</div>;
        }

        if (auth.isLoading) {
            return <div>Loading...</div>;
        }

        if (auth.error) {
            return (
                <div>
                    <p>An error occurred during authentication:</p>
                    <pre>{auth.error.message}</pre>
                </div>
            );
        }

        if (auth.isAuthenticated) {
            return (
                <Button onClick={() => void auth.removeUser()}>
                    Log out {auth.user?.profile.given_name}
                </Button>
            );
        }

        return (
            <Button onClick={() => void auth.signinRedirect()} size="lg" variant={'outlined'} color="primary">
                Login
            </Button>
        )
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
            {/* When page is narrower than 600px */}
            <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                spacing={1}
                sx={{ display: { xs: 'flex', sm: 'none' } }}
            >
                <Link to={'https://i-guide.io'} style={{ textDecoration: 'none' }}>
                    <Box
                        component="img"
                        sx={{ height: 40, mt: 1, px: 2 }}
                        alt="Logo"
                        src="/images/Logo.png"
                    />
                </Link>
                <Stack
                    direction="row"
                    justifyContent="flex-start"
                    alignItems="center"
                    spacing={1}
                    sx={{ display: { xs: 'flex', sm: 'none' } }}
                >
                    <Link key="login" to={'/user_profile'} style={{ textDecoration: 'none' }}>
                        <Button size="lg" variant={'outlined'} color="primary">
                            Login
                        </Button>
                    </Link>
                    <Button
                        size="lg"
                        ref={buttonRef}
                        id="composition-button"
                        aria-controls={'composition-menu'}
                        aria-haspopup="true"
                        aria-expanded={open ? 'true' : undefined}
                        variant="outlined"
                        color="neutral"
                        onClick={() => {
                            setOpen(!open);
                        }}
                    >
                        <MenuIcon />
                    </Button>
                    <Popup
                        role={undefined}
                        id="composition-menu"
                        open={open}
                        anchorEl={buttonRef.current}
                        disablePortal
                        modifiers={[
                            {
                                name: 'offset',
                                options: {
                                    offset: [0, 4],
                                },
                            },
                        ]}
                    >
                        <ClickAwayListener
                            onClickAway={(event) => {
                                if (event.target !== buttonRef.current) {
                                    handleClose();
                                }
                            }}
                        >
                            <MenuList
                                variant="outlined"
                                onKeyDown={handleListKeyDown}
                                sx={{ boxShadow: 'md' }}
                            >
                                {pages?.map((page) => (
                                    <Link key={page[1]} to={page[1]} style={{ textDecoration: 'none' }}>
                                        <MenuItem key={page[0]}>
                                            <Typography textAlign="center">{page[0]}</Typography>
                                        </MenuItem>
                                    </Link>
                                ))}
                            </MenuList>
                        </ClickAwayListener>
                    </Popup>
                </Stack>
            </Stack>

            {/* When page is wider than 600px */}
            <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                spacing={1}
                sx={{ display: { xs: 'none', sm: 'flex' } }}
            >
                <Stack
                    direction="row"
                    justifyContent="flex-start"
                    alignItems="center"
                    spacing={1}
                    sx={{ display: { xs: 'none', sm: 'flex' } }}
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
                {/* <Link key="login" to={'/user_profile'} style={{ textDecoration: 'none' }}>
                    <Button size="lg" variant={'outlined'} color="primary">
                        Login
                    </Button>
                </Link> */}
                <LoginButton />
                {/* <Button onClick={() => void auth.signinRedirect()} size="lg" variant={'outlined'} color="primary">
                    Login
                </Button> */}
            </Stack>
        </Box>
    );
}
