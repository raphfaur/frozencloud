import { Card, Paper, CardActions, Button, CardMedia, CardContent, Typography, IconButton, Grid, Box } from "@mui/material";
import { Component, useEffect, useState } from "react";
import { Delete, DeleteForever, Download, DownloadForOffline, Favorite } from '@mui/icons-material'
import example from './example.jpg'
import axios from "axios";
import { saveAs } from 'file-saver'
import { useLocation, useNavigate } from "react-router-dom";


async function getImage({ token, name }) {
    return await axios.get('http://138.195.138.73:8080/photo', {
        params: {
            name: name
        },
        headers: {
            Authorization: `Bearer ${token}`
        },
        responseType: 'blob'
    },).then((res) => res);
}

async function deleteImage({ token, name }) {
    return await axios.delete('http://138.195.138.73:8080/delete', {
        params: {
            name: name
        },
        headers: {
            Authorization: `Bearer ${token}`
        }
    }).then((res) => console.log(res))
}



export default function Preview({ name, token }) {
    const [image, setImage] = useState();
    const navigate = useNavigate();
    function download() {
        saveAs(image, name);
    }

    useEffect(() => {
        getImage({ token: token, name: name }).then((res) => { setImage(URL.createObjectURL(res.data)) })
    }, [])
    return (
        <Grid container spacing={0} sx={{ width: '100%', display: 'flex' }}>
            <Grid item xs={12} display={'flex'}>
                <Card sx={{ backgroundImage: `url(${image})`, backgroundSize: 'contain', backgroundRepeat: 'no-repeat', flexGrow: 1, minHeight: 200, display: 'flex', flexDirection: 'column-reverse' }}>
                    <link
                        rel="stylesheet"
                        href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
                    />
                </Card>
            </Grid>
            <Grid container spacing={5}>
                <Grid item xs={1}>
                    <IconButton onClick={download}>
                        <DownloadForOffline style={{ color: "black" }} ></DownloadForOffline>
                    </IconButton>
                </Grid>
                <Grid item xs={1}>
                    <IconButton onClick={() => { deleteImage({ token, name }); navigate(0) }}>
                        <Delete style={{ color: "black" }} ></Delete>
                    </IconButton>
                </Grid>
                <Grid item xs={9} margin={'auto'} >
                    <Box display={'flex'} alignItems={'center'} justifyItems={'center'} >
                        <Typography noWrap textAlign={'center'} >
                            {name}
                        </Typography>
                    </Box>

                </Grid>
            </Grid>



        </Grid>

    )
}
