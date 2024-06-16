import * as React from 'react';
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

import { Link } from 'react-router-dom';

const pages = [['Home', '/home'], ['Datasets', '/datasets'], ['Notebooks', '/notebooks'], ['Publications', '/publications'], ['OCR', '/ocrs']];

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

    return (
        <Box
            sx={{
                height: 70,
                p: 2,
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
                <Box sx={{ width: 'flex' }}>
                    <Box
                        component="img"
                        sx={{ height: 40, mx: 2 }}
                        alt="Logo"
                        src="images/Logo.png"
                    />
                </Box>
                <Button
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
                            {pages.map((page) => (
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

            {/* When page is wider than 600px */}
            <Stack
                direction="row"
                justifyContent="flex-start"
                alignItems="center"
                spacing={1}
                sx={{ display: { xs: 'none', sm: 'flex' } }}
            >
                <Box sx={{ width: 'flex' }}>
                    <Box
                        component="img"
                        sx={{ height: 40, mx: 2 }}
                        alt="Logo"
                        src="images/Logo.png"
                    />
                </Box>

                {pages.map((page) => (
                    <Box key={page[1]} sx={{ width: 'flex' }}>
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
                    </Box>
                ))}
            </Stack>
        </Box>
    );
}
