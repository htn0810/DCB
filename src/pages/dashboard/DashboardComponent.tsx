import "./DashboardComponent.scss";
import React, {useEffect, useState} from "react";
import {useAppDispatch, useAppSelector} from "../../custom-hooks/hook";
import {hideIndicator, showIndicator} from "../../app/app.slice";
import {Card, CardContent, CardMedia, Grid, IconButton, InputAdornment, TextField, Typography} from "@mui/material";
import {ExtensionTwoTone, Search, SettingsSuggestTwoTone, WidgetsTwoTone} from "@mui/icons-material";
import ShowMoreText from "react-show-more-text";
import BannerComponent from "./banner/BannerComponent";
import {Asset} from "../../models/Asset";
import {AssetApi} from "../../api/asset.api";
import {DIGI_ASSET, IMAGE_URI} from "../../contants";

export default function DashboardComponent() {
    const [assets, setAssets] = useState<Asset[]>([]);
    const [keyword, setKeyword] = useState("");
    const account = useAppSelector(state => state.account);
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(showIndicator())
        AssetApi.getAllAssets().then(res => {
            setAssets(res);
            dispatch(hideIndicator())
        });
    }, [account]);

    const handleOpenApp = (appUrl: string) => {
        window.open(appUrl, '_blank');
    }

    return (
        <section className="dashboard-container">
            <BannerComponent/>
            <section className="dashboard-container-child">
                <div className="search-tab">
                    <Typography className="app-list-title" variant="h4">
                        {`${DIGI_ASSET.toUpperCase()}S`}
                    </Typography>
                    <div className="search">
                        <TextField className="name-text-field"
                                   name="name" label="Type your keyword. . ."
                                   onChange={event => setKeyword(event.target.value)}
                                   InputProps={{
                                       endAdornment:
                                           <InputAdornment position="start">
                                               <Search/>
                                           </InputAdornment>
                                   }}/>
                    </div>
                </div>
                <Grid className="app-list" container spacing={3}>
                    {assets.filter(app => {
                        if (keyword === '') {
                            return app;
                        } else {
                            return app.description
                                ? `${app.name.toLowerCase()} ${app.description.toLowerCase()}`.includes(keyword.toLowerCase())
                                : `${app.name.toLowerCase()}`.includes(keyword.toLowerCase());
                        }
                    }).map(app =>
                        <Grid item xl={2.4} lg={3} md={4} key={app.id}>
                            <Card className="app-card">
                                <CardMedia className="card-media" component="img" alt={app.name}
                                           image={app.imageUrl ? app.imageUrl : `${IMAGE_URI}/none-img.png`}
                                           onClick={() => handleOpenApp(app.appUrl)}/>
                                <CardContent>
                                    <Typography variant="h6">
                                        <IconButton className="app-icon" disabled={true}>
                                            {app.type === 'APP' && (<WidgetsTwoTone/>)}
                                            {app.type === 'SERVICE' && (<SettingsSuggestTwoTone/>)}
                                            {app.type === 'COMPONENT' && (<ExtensionTwoTone/>)}
                                        </IconButton>
                                        {app.name}
                                    </Typography>
                                    <ShowMoreText className="description" lines={2} truncatedEndingComponent={"... "}
                                                  more="Show more ▼"
                                                  less="Show less ▲">
                                        <Typography className="description" variant="body2" color="text.secondary">
                                            {app.description}
                                        </Typography>
                                    </ShowMoreText>
                                </CardContent>
                            </Card>
                        </Grid>
                    )}
                </Grid>
            </section>
        </section>
    );
}
