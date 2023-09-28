import "./BannerComponent.scss";
import React from "react";
import {Grid, Typography} from "@mui/material";
import {Hub} from "@mui/icons-material";
import {IMAGE_URI} from "../../../contants";

function BannerComponent() {

    return (
        <div className="dashboard-banner">
            <div className="app-name">
                <Hub/> Digital AppCore
            </div>
            <Grid className="grid-wrapper" container>
                <Grid item xs={7}>
                    <div className="text-wrapper">
                        <div className="org-central">
                            <Typography className="org-central-h6" variant="h6">
                                Digital application development center
                            </Typography>
                            <Typography className="org-central-subtitle"variant="subtitle1">
                                where to define, generate and manage all digital assets
                            </Typography>
                        </div>
                    </div>
                </Grid>
                <Grid item xs={5}>
                    <img className="core-img" alt="description" src={`${IMAGE_URI}/slider-img.png`}/>
                </Grid>
            </Grid>
        </div>
    );
}

export default BannerComponent;
