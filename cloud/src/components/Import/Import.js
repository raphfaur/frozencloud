import { Input, Button, Paper, Grid, Typography, Box, IconButton, Snackbar, Alert } from "@mui/material";
import background from '../../back.jpg'
import { Close } from '@mui/icons-material'
import { useState } from "react";
import axios from "axios";
import React from "react";


export default function Import({ getToken }) {
    const [file, setFile] = useState();
    const [present, setPresent] = useState();
    const [source, setSource] = useState();
    const [open, setOpen] = useState();
    const [alert, setAlert] = useState();

    function handleFile(e) {
        console.log(e.target.files[0]);
        setFile(e.target.files[0]);
        setSource(<Box textAlign={'center'} margin={'auto'}>
            <img src={URL.createObjectURL(e.target.files[0])} style={{ width: '100%', textAlign: 'center' }} ></img>
        </Box>);
        setPresent(true);
    }

    async function handleSubmission(e) {
        const token = getToken();
        const formData = new FormData();
        formData.append('File', file);
        await axios.post('http://138.195.138.73:8080/import', formData, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).then((res) => {
            if (res.data === 'success') {
                setFile(null);
                setPresent(false);
                setSource();
                setAlert(
                    <Alert severity="success">
                        Upload successful !
                    </Alert>)
                setOpen(true)
            } else {
                setAlert(
                    <Alert severity="error">
                        Error
                    </Alert>)
                setOpen(true)
            }
        }).catch((err) => {
            setAlert(
                <Alert severity="error">
                    Failed to upload...
                </Alert>)
            setOpen(true)
        });
    }

    let send;
    if (present) {
        send =
            <Button variant="contained" component="label" sx={{ margin: 'auto' }} onClick={handleSubmission} >
                Send
            </Button>


    } else {
        send = null
    }
    return (
        <div style={{ display: 'block', height: '100vh', backgroundImage: `url(${background})`, backgroundSize: 'cover' }}>
            <Grid container spacing={0} direction={"column"} sx={{ minHeight: '100%' }} alignItems="center"
                justifyContent="center" >
                <Grid item xs={12} display={'flex'} flexDirection={"column"} width={'50%'}>
                    <Paper sx={{ marginTop: 10, width:"100%"}} >
                        <link
                            rel="stylesheet"
                            href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
                        />
                        <Box textAlign={'center'} display={'flex'} flexDirection={"column"}>
                            <Typography margin={'auto'} flexGrow={1} flex={1} marginTop={2} >
                                Import photo
                            </Typography>
                        </Box>
                        {source}

                        <Box display={'flex'} textAlign={'center'} marginBottom={3} marginTop={3}>
                            <Button variant="contained" component="label" sx={{ margin: 'auto' }} >
                                Upload
                                <input hidden accept="image/*" multiple type="file" onChange={handleFile} />
                            </Button>
                            {send}
                        </Box>
                    </Paper>
                </Grid>

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