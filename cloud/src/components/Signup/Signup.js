import { useState } from "react"
import { TextField, Grid, Box, Button, Paper, Alert, Snackbar } from '@mui/material'
import background from '../../album.jpg';
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Signup() {
    const [username, setUsername] = useState();
    const [password, setPassword] = useState();
    const [passwordcheck, setPasswordcheck] = useState();
    const [open, setOpen] = useState();
    const [alert, setAlert] = useState();
    const navigate = useNavigate();


    async function handleSubmission(e) {
        var testEmail = /^[ ]*([^@\s]+)@((?:[-a-z0-9]+\.)+[a-z]{2,})[ ]*$/i;
        e.preventDefault();
        if (password !== passwordcheck) {
            setAlert(
                <Alert severity="error">
                    Passwords don't match
                </Alert>)
            setOpen(true)
        } else if (!testEmail.test(username)) {
            setAlert(
                <Alert severity="error">
                    Invalid email !
                </Alert>)
            setOpen(true)
        } else {
            await axios.post('http://localhost:8080/signup', {
                username: username,
                password: password
            }).then((res) => {
                if (res.data === 'success') {
                    setAlert(
                        <Alert severity="success">
                            Signed up successful ! Go check your email {username}
                        </Alert>)
                    setOpen(true);
                    setUsername('');
                    setPassword('');
                    setPasswordcheck('')
                    navigate('/verification', {state: { username : username}})
                } else if (res.data === 'ongoing') {
                    setAlert(
                        <Alert severity="error">
                            You already have a verrification running. Check your emails...
                        </Alert>)
                    setOpen(true);
                } else if (res.data === 'exists') {
                    setAlert(
                        <Alert severity="error">
                            Username already exists
                        </Alert>)
                    setOpen(true);
                } else {
                    setAlert(
                        <Alert severity="error">
                            Error while submiting infos...
                        </Alert>)
                    setOpen(true);
                }
            }).catch((e) => {
                setAlert(
                    <Alert severity="error">
                        Error while submiting infos...
                    </Alert>)
                setOpen(true);
            })

        }
    }



    return (
        <div style={{ display: 'block', height: "100vh", backgroundImage: `url(${background})`, backgroundSize: 'cover' }}>
            <Grid container spacing={0} direction={"column"} sx={{ minHeight: '100%' }} alignItems="center"
                justifyContent="center">
                <Paper >

                    <form onSubmit={handleSubmission}>
                        <div >
                            <TextField sx={{ marginTop: 4, marginLeft: 10, marginRight: 10, backgroundColor: "white" }} label="Email" type="email" onChange={(e) => setUsername(e.target.value)} value={username} ></TextField>
                        </div>

                        <div>
                            <TextField sx={{ margin: 1, marginLeft: 10, marginRight: 10, marginTop: 2, color: "white" }} label="Password" type="password" onChange={(e) => setPassword(e.target.value)} value={password} ></TextField>
                        </div>
                        <div>
                            <TextField sx={{ margin: 1, marginLeft: 10, marginRight: 10, marginTop: 0, color: "white" }} label="Confirm password" type="password" onChange={(e) => setPasswordcheck(e.target.value)} value={passwordcheck} ></TextField>
                        </div>
                        <div>
                            <Box textAlign={'center'} sx={{ margin: 1 }}>
                                <Button sx={{ textAlign: 'center', mx: 'auto' }} variant="outlined" type='submit '>Sign Up</Button>
                            </Box>

                        </div>
                        <Snackbar
                            autoHideDuration={4000}
                            onClose={(e) => setOpen(false)}
                            open={open}
                        >
                            {alert}
                        </Snackbar>

                    </form>
                </Paper>
            </Grid>

        </div>






    )
}