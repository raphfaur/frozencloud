import { Button, Grid, Paper, Card, IconButton } from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import Preview from "./Preview";
import { Add } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

async function getMyImages(token) {
    return axios.get('http://138.195.138.73:8080/gallery', {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }).then((res) => res.data)
}



const Item = <Paper></Paper>

export default function Gallery({ getToken }) {
    const [images, setImages] = useState(null);
    const token = getToken();
    const navigate = useNavigate();
    useEffect(() => {
        getMyImages(token).then((data) => { setImages(data.gallery.images) });
    }, []);
    if (!images) {
        return
    }
    return (
        <Grid container spacing={2} padding={10} >
            {images.map((name) => <Grid item xl={3} lg={4} md={6} sm={6} xs={12} key={name}>
                <Preview name={name} token={token} />
            </Grid>)}
            <Grid item xl={3} lg={4} md={6} sm={6} xs={12}>
                <Grid item xs={12} display={'flex'}>
                <Card sx={{ flexGrow: 1, minHeight: 200, display: 'flex', flexDirection: 'column-reverse' }}>
                    <link
                        rel="stylesheet"
                        href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
                    />
                    <IconButton sx={{margin:'auto'}} onClick={() => navigate('/import')} >
                        <Add sx={{fontSize:30}}></Add>
                    </IconButton>
                </Card>
            </Grid>
            </Grid>
        </Grid>
    )
}