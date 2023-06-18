import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AppBar, Button, Menu, MenuItem, Typography, Toolbar, Box, IconButton, Avatar } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu'
import { Person } from "@mui/icons-material";
export default function Navbar() {
    const [anchorEl, setAnchorEl] = useState(null);
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();

    function handleClose(e) {
        if(e.target.id === 'logout') {
            localStorage.removeItem('token');
            navigate(0)
        }
        setOpen(false)
    }
    return (
        <Box sx={{ flexGrow: 1 }}>
            <link
                rel="stylesheet"
                href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
            />
            <AppBar position="fixed">
                <Toolbar sx={{ backgroundColor: "grey" }}>
                    <Button color="inherit" sx={{ margin: 1 }} onClick={e => navigate('/import')}>Import</Button>
                    <Button color="inherit" sx={{ margin: 1 }} onClick={e => navigate('/gallery')}>Gallery</Button>
                    <Typography sx={{ flexGrow: 1 }}></Typography>
                    <IconButton onClick={e => {setOpen(true); setAnchorEl(e.currentTarget)}} sx={{ p: 0 }}>
                        <Avatar > <Person></Person> </Avatar>
                    </IconButton>

                </Toolbar>
            </AppBar>
            <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                    'aria-labelledby': 'basic-button',
                }}
            >
                <MenuItem id='logout' onClick={handleClose}>Logout</MenuItem>
            </Menu>
        </Box>
    );
}
