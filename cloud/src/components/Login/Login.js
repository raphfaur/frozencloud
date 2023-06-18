import React, { useState } from "react";
import { TextField, Button, Paper, Box, Grid, Snackbar, Alert, Typography} from '@mui/material'
import axios from 'axios'
import { useNavigate } from "react-router-dom";
import background from '../../album.jpg';
import { AccountCircle, Password } from "@mui/icons-material";

async function login(credentials) {
    return axios.post('http://localhost:8080/login', credentials).then(res => res.data).catch((e) => {
        console.log('Network error')
    })
}

export default function Login({ setToken }) {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [open, setOpen] = useState();
    const [alert, setAlert] = useState();
    const navigate = useNavigate();
    const [error, setError] = useState(false);

    const handleLogin = async e => {
        e.preventDefault();
        try {
            console.log('Submiting')
            let token;
            await login({
                username: username,
                password: password
            }).then((data) => {
                const response = data.response;
                if (response === 'right') {
                    token = data.token;
                    setToken(token);;
                } else {
                    setAlert(
                        <Alert severity="error">
                            Wrong credentials
                        </Alert>)
                    setOpen(true);
                    setError(true)
                }
            });

        } catch (error) {
        }
    }
    return (


        <div style={{ display: 'block', height: "100vh", backgroundImage: `url(${background})`, backgroundSize: 'cover' }}>
            <Grid container spacing={0} direction={"column"} sx={{ minHeight: '100%' }} alignItems="center"
                justifyContent="center">
                <Paper >

                    <form onSubmit={handleLogin}>
                        <link
                            rel="stylesheet"
                            href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
                        />
                        <Box textAlign={'center'} margin={2}>
                            <Typography variant="h4" >
                                Login to FrozenCloud
                            </Typography>
                        </Box>
                        
                        <Box textAlign={'center'}>
                            <Box sx={{ margin: 1, marginLeft: 10, marginRight: 10, display: 'flex', alignItems: 'flex-end' }}>
                                <AccountCircle sx={{ color: 'action.active', margin: 'auto', marginRight: 2 }}></AccountCircle>
                                <TextField sx={{ backgroundColor: "white" }} error={error} label="Username" type='email' onChange={(e) => { setUsername(e.target.value); setError(false) }} ></TextField>
                            </Box>

                            <Box sx={{ margin: 1, marginLeft: 10, marginRight: 10, display: 'flex', alignItems: 'flex-end' }}>
                                <Password sx={{ color: 'action.active', margin: 'auto', marginRight: 2 }}></Password>
                                <TextField sx={{ color: "white" }} error={error} label="Password" type="password" onChange={(e) => { setPassword(e.target.value); setError(false) }} ></TextField>
                            </Box>
                        </Box>

                        <Box display={'flex'} flexDirection={'row-reverse'} marginTop={3} >
                            
                            <Box textAlign={'center'} sx={{  marginBottom: 4 , flex:2, flexGrow:1}}>
                                <Button sx={{ textAlign: 'center', mx: 'auto' }} variant="outlined" type='submit'>Login</Button>
                            </Box>
                            <Box textAlign={'center'} sx={{  marginBottom: 4, flex:3, flexGrow:1}}>
                                <Button sx={{ textAlign: 'center', mx: 'auto' }} variant="outlined" onClick={() => navigate('/signup')}>Sign Up</Button>
                            </Box>
                            <Box flex={2}>

                            </Box>

                        </Box>
                        
                    </form>
                </Paper>



            </Grid>
            <Snackbar
                autoHideDuration={4000}
                onClose={(e) => setOpen(false)}
                open={open}
            >
                {alert}
            </Snackbar>

        </div>






    )
}