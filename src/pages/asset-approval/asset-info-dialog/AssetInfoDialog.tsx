import "./AssetInfoDialog.scss";
import React, {Fragment, useState} from 'react';
import {Link} from 'react-router-dom';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle, Divider,
    Grid,
    IconButton,
    Skeleton
} from '@mui/material';
import {Close, CorporateFare, Person} from '@mui/icons-material';
import {Asset} from "../../../models/Asset";
import {AssetApi} from "../../../api/asset.api";
import {useAppDispatch} from "../../../custom-hooks/hook";
import {showIndicator} from "../../../app/app.slice";
import AssetRejectDialog from "../asset-reject-dialog/AssetRejectDialog";

type Props = {
    open: boolean;
    onClose: () => void;
    reload: () => void;
    asset: Asset | null;
}

function AssetInfoDialog(props: Props) {
    const [imgLoading, setImgLoading] = useState(true);
    const [rejectDialogOpened, setRejectDialogOpened] = useState(false);

    const dispatch = useAppDispatch();

    const onClose = () => {
        props.onClose();
        setImgLoading(true);
    }

    const handleEscKey = (event: React.KeyboardEvent) => {
        if (event.key === 'Escape') {
            onClose();
        }
    }

    const handleApprove = () => {
        dispatch(showIndicator());
        AssetApi.publishAsset(props.asset?.id!).then(() => {
            onClose();
            props.reload();
        });
    }

    const onReject = () => {
        onCloseRejectDialog();
        onClose();
        props.reload();
    }

    const handleOpenRejectDialog = () => {
        setRejectDialogOpened(true);
    }

    const onCloseRejectDialog = () => {
        setRejectDialogOpened(false);
    }

    return (
        <Fragment>
            <Dialog className="asset-dialog" maxWidth="lg" open={props.open} onKeyDown={handleEscKey}>
                <IconButton className="close-btn" onClick={onClose}>
                    <Close/>
                </IconButton>
                <DialogTitle>
                    Asset's Information
                </DialogTitle>
                <DialogContent>
                    {props.asset ? (
                        <Fragment>
                            <Grid container columnSpacing={6}>
                                <Grid item xs={6}>
                                    <div className="img-wrapper">
                                        {imgLoading && <Skeleton animation="wave" variant="rectangular" className="img-skeleton"/>}
                                        <img className="asset-img" src={props.asset.imageUrl} alt="asset" onLoad={() => setImgLoading(false)} />
                                    </div>
                                </Grid>
                                <Grid item xs={6}>
                                    <div className="title">Name</div>
                                    <div className="content">{props.asset.name}</div>
                                    <div className="title">Type</div>
                                    <div className="content">{props.asset.type}</div>
                                    <div className="title">Description</div>
                                    <div className="content">{props.asset.description}</div>
                                </Grid>
                            </Grid>
                            <Divider/>
                            <Grid container columnSpacing={6}>
                                <Grid item xs={6}>
                                    <div className="title">Asset's URL</div>
                                    <div className="link">
                                        {props.asset.appUrl ? (
                                            <Link to={props.asset.appUrl} target="_blank">{props.asset.appUrl}</Link>
                                        ) : "This asset do not have URL"}
                                    </div>
                                    <div className="title">Repository's URL</div>
                                    <div className="link">
                                        {props.asset.repoUrl ? (
                                            <Link to={props.asset.repoUrl} target="_blank">{props.asset.repoUrl}</Link>
                                        ) : "This asset do not have URL"}
                                    </div>
                                </Grid>
                                <Grid item xs={6}>
                                    <div className="title">Other URL(s)</div>
                                </Grid>
                            </Grid>
                            <Divider/>
                            <div className="title">Organization(s):</div>
                            <Grid container columnSpacing={2}>
                                {props.asset.organizations.map(organization =>
                                    <Grid item xs={4} key={organization.id} className="map-row">
                                        <CorporateFare/>
                                        <div className="name">{organization.name}</div>
                                    </Grid>
                                )}
                            </Grid>
                            <Divider/>
                            <div className="title">List of Owner(s):</div>
                            <Grid container columnSpacing={2}>
                                {props.asset.owners.map(owner =>
                                    <Grid item xs={6} key={owner.id} className="map-row">
                                        <Person/>
                                        <div className="name">{owner.displayName}</div>
                                    </Grid>
                                )}
                            </Grid>
                            <div className="title">List of Developer(s):</div>
                            <div>
                                {props.asset.developers.map(developer =>
                                    <div key={developer.id} className="map-row">
                                        <Person/>
                                        <div className="name">{developer.displayName}</div>
                                    </div>
                                )}
                            </div>
                        </Fragment>
                    ) : null}
                </DialogContent>
                <DialogActions>
                    <Button variant="contained" color="primary" onClick={handleApprove}>
                        Approve
                    </Button>
                    <Button variant="contained" color="error" onClick={handleOpenRejectDialog}>
                        Reject
                    </Button>
                    <Button variant="contained" color="inherit" onClick={onClose}>
                        Cancel
                    </Button>
                </DialogActions>
            </Dialog>

            <AssetRejectDialog open={rejectDialogOpened} onClose={onCloseRejectDialog} onReject={onReject} asset={props.asset}/>
        </Fragment>
    );
}

export default AssetInfoDialog;
