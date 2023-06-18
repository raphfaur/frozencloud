import { useState } from "react"
import { TextField, Grid, Box, Button, Paper, Alert, Snackbar, Typography } from '@mui/material'
import background from '../../album.jpg';
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

export default function Verification() {
    const [code, setCode] = useState('');
    const [open, setOpen] = useState();
    const [alert, setAlert] = useState();
    const navigate = useNavigate();
    const { state } = useLocation();
    const { username } = state


    async function verify(e) {
        await axios.post('http://138.195.138.73:8080/verify', {
            username: username,
            code: code
        })
            .then((res) => {
                console.log(res);
                if (res.data === "success") {
                    navigate('/gallery');
                } else if (res.data === "expired") {
                    setAlert(
                        <Alert severity="error">
                            Verification expired, signup again.
                        </Alert>)
                    setOpen(true)
                } else if (res.data === "code") {
                    setAlert(
                        <Alert severity="error">
                            Wrong code !
                        </Alert>)
                    setOpen(true)
                }
            })
            .catch((err) => {
                console.log(err)
            })
    }



    return (
        <div style={{ display: 'block', height: "100vh", backgroundImage: `url(${background})`, backgroundSize: 'cover' }}>
            <Grid container spacing={0} direction={"column"} sx={{ minHeight: '100%' }} alignItems="center"
                justifyContent="center">
                <Paper sx={{ padding: 4 }}>
                    <link
                        rel="stylesheet"
                        href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
                    />
                    <Box textAlign={'center'} margin={'auto'}>
                        <Typography variant="h2" >
                            Welcome {username}
                        </Typography>
                        <Typography variant="h5" marginBottom={5}>
                            Enter your verification code
                        </Typography>
                    </Box>


                    <Box textAlign={'center'} >
                        <TextField sx={{ marginTop: 0, marginLeft: 10, marginRight: 10, backgroundColor: "white" }} inputProps={{ style: { textAlign: 'center' }, maxLength: 4 }} value={code} onChange={(e) => setCode(e.target.value)}></TextField>
                    </Box>


                    <div>
                        <Box textAlign={'center'} sx={{ margin: 1, marginBottom: 4 }}>
                            <Button sx={{ textAlign: 'center', mx: 'auto' }} variant="outlined" onClick={verify}>Verify</Button>
                        </Box>
                    </div>
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